import {
    auth,
    db
} from "./firebase-config.js";

import {
    onAuthStateChanged
} from
"https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc,
    runTransaction,
    onSnapshot
} from
"https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


// =====================================================
// BLUE WHALE 2.0
// REAL-TIME MULTIPLAYER
// =====================================================

let currentUser = null;

let currentRoomCode = null;

let unsubscribeRoom = null;


// =====================================================
// GENERATE ROOM CODE
// =====================================================

function generateRoomCode() {

    const characters =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code = "";

    for (let i = 0; i < 6; i++) {

        code += characters[
            Math.floor(
                Math.random() *
                characters.length
            )
        ];

    }

    return code;
}


// =====================================================
// GET PLAYER PROFILE
// =====================================================

async function getPlayerProfile(uid) {

    const profileRef =
        doc(
            db,
            "players",
            uid
        );

    const profile =
        await getDoc(profileRef);

    if (!profile.exists()) {

        throw new Error(
            "Player profile not found."
        );

    }

    return profile.data();
}


// =====================================================
// AUTH
// =====================================================

onAuthStateChanged(
    auth,
    async function(user) {

        if (!user) {

            window.location.href =
                "login.html";

            return;

        }

        currentUser = user;

        try {

            const profile =
                await getPlayerProfile(
                    user.uid
                );

            console.log(
                "Logged in as:",
                profile.username
            );

        } catch (error) {

            console.error(error);

        }

    }
);


// =====================================================
// CREATE ROOM
// =====================================================

window.createRealRoom =
    async function() {

        if (!currentUser) {

            alert(
                "Please wait for login to finish."
            );

            return;

        }


        try {

            const profile =
                await getPlayerProfile(
                    currentUser.uid
                );


            let roomCode = null;

            let roomCreated = false;


            // Try different codes until one is unused.

            for (let attempt = 0; attempt < 10; attempt++) {

                const candidate =
                    generateRoomCode();

                const roomRef =
                    doc(
                        db,
                        "rooms",
                        candidate
                    );


                const existing =
                    await getDoc(roomRef);


                if (!existing.exists()) {

                    await setDoc(
                        roomRef,
                        {

                            roomCode:
                                candidate,

                            playerOneUid:
                                currentUser.uid,

                            playerOneName:
                                profile.username,

                            playerOneScore:
                                0,

                            playerTwoUid:
                                null,

                            playerTwoName:
                                null,

                            playerTwoScore:
                                0,

                            status:
                                "waiting",

                            challenge:
                                null,

                            turn:
                                "playerOne",

                            createdAt:
                                Date.now()

                        }
                    );


                    roomCode =
                        candidate;

                    roomCreated =
                        true;

                    break;

                }

            }


            if (!roomCreated) {

                throw new Error(
                    "Could not generate a room. Try again."
                );

            }


            currentRoomCode =
                roomCode;


            showRealRoom(
                roomCode
            );


            listenToRoom(
                roomCode
            );


        } catch (error) {

            console.error(error);

            alert(
                "Could not create room: " +
                error.message
            );

        }

    };


// =====================================================
// JOIN ROOM
// =====================================================

window.joinRealRoom =
    async function() {

        if (!currentUser) {

            alert(
                "Please wait for login to finish."
            );

            return;

        }


        const input =
            document.getElementById(
                "realRoomCode"
            );


        if (!input) return;


        const roomCode =
            input.value
                .trim()
                .toUpperCase();


        if (!/^[A-Z0-9]{6}$/.test(roomCode)) {

            alert(
                "Enter a valid 6-character room code."
            );

            return;

        }


        try {

            const profile =
                await getPlayerProfile(
                    currentUser.uid
                );


            const roomRef =
                doc(
                    db,
                    "rooms",
                    roomCode
                );


            await runTransaction(
                db,
                async function(transaction) {

                    const roomSnapshot =
                        await transaction.get(
                            roomRef
                        );


                    if (!roomSnapshot.exists()) {

                        throw new Error(
                            "ROOM_NOT_FOUND"
                        );

                    }


                    const room =
                        roomSnapshot.data();


                    // Already Player 1

                    if (
                        room.playerOneUid ===
                        currentUser.uid
                    ) {

                        return;

                    }


                    // Already Player 2

                    if (
                        room.playerTwoUid ===
                        currentUser.uid
                    ) {

                        return;

                    }


                    // Room full

                    if (
                        room.playerTwoUid
                    ) {

                        throw new Error(
                            "ROOM_FULL"
                        );

                    }


                    transaction.update(
                        roomRef,
                        {

                            playerTwoUid:
                                currentUser.uid,

                            playerTwoName:
                                profile.username,

                            playerTwoScore:
                                0,

                            status:
                                "active"

                        }
                    );

                }
            );


            currentRoomCode =
                roomCode;


            showRealRoom(
                roomCode
            );


            listenToRoom(
                roomCode
            );


        } catch (error) {

            console.error(error);


            if (
                error.message ===
                "ROOM_NOT_FOUND"
            ) {

                alert(
                    "Room not found."
                );

                return;

            }


            if (
                error.message ===
                "ROOM_FULL"
            ) {

                alert(
                    "This room already has two players."
                );

                return;

            }


            alert(
                "Could not join room: " +
                error.message
            );

        }

    };


// =====================================================
// SHOW ROOM
// =====================================================

function showRealRoom(code) {

    const lobby =
        document.getElementById(
            "realLobby"
        );

    const room =
        document.getElementById(
            "realRoom"
        );


    if (lobby)
        lobby.style.display =
            "none";


    if (room)
        room.style.display =
            "block";


    const codeElement =
        document.getElementById(
            "realRoomDisplay"
        );


    if (codeElement)
        codeElement.textContent =
            code;

}


// =====================================================
// REAL-TIME LISTENER
// =====================================================

function listenToRoom(code) {

    // Remove old listener

    if (unsubscribeRoom) {

        unsubscribeRoom();

    }


    const roomRef =
        doc(
            db,
            "rooms",
            code
        );


    unsubscribeRoom =
        onSnapshot(
            roomRef,
            function(snapshot) {

                if (!snapshot.exists()) {

                    alert(
                        "This room no longer exists."
                    );

                    return;

                }


                const room =
                    snapshot.data();


                updateRealRoomUI(
                    room
                );

            },

            function(error) {

                console.error(
                    "Room listener error:",
                    error
                );

            }
        );

}


// =====================================================
// UPDATE UI
// =====================================================

function updateRealRoomUI(room) {

    const p1 =
        document.getElementById(
            "realPlayerOne"
        );

    const p2 =
        document.getElementById(
            "realPlayerTwo"
        );

    const s1 =
        document.getElementById(
            "realScoreOne"
        );

    const s2 =
        document.getElementById(
            "realScoreTwo"
        );

    const status =
        document.getElementById(
            "realRoomStatus"
        );


    if (p1)
        p1.textContent =
            room.playerOneName ||
            "Player 1";


    if (p2)
        p2.textContent =
            room.playerTwoName ||
            "Waiting...";


    if (s1)
        s1.textContent =
            room.playerOneScore || 0;


    if (s2)
        s2.textContent =
            room.playerTwoScore || 0;


    if (status) {

        status.textContent =
            room.playerTwoUid
                ? "🟢 MATCH ACTIVE"
                : "🟡 WAITING FOR PLAYER";

    }


    // Challenge display

    displayChallenge(
        room
    );

}


// =====================================================
// DISPLAY CHALLENGE
// =====================================================

function displayChallenge(room) {

    const box =
        document.getElementById(
            "liveChallenge"
        );


    if (!box) return;


    if (!room.challenge) {

        box.innerHTML = `

            <div class="waiting-box">

                <div class="waiting-animation">
                    ⚔️
                </div>

                <h2>
                    Ready for battle
                </h2>

                <p>
                    A challenge will appear here
                    when your opponent sends one.
                </p>

            </div>

        `;

        return;

    }


    box.innerHTML = `

        <div class="opponent-challenge">

            <span class="section-tag">
                ⚔️ CHALLENGE
            </span>

            <h2>
                ${escapeHTML(
                    room.challenge.title
                )}
            </h2>

            <p>
                ${escapeHTML(
                    room.challenge.description
                )}
            </p>

            <div class="challenge-reward">

                <span>
                    ⭐ Reward
                </span>

                <strong>
                    ${room.challenge.reward || 100} XP
                </strong>

            </div>

            <button
                class="primary-btn"
                onclick="completeRealChallenge()"
            >
                COMPLETE
            </button>

        </div>

    `;

}


// =====================================================
// CREATE CHALLENGE
// =====================================================

window.createRealChallenge =
    async function() {

        if (
            !currentRoomCode ||
            !currentUser
        ) {

            return;

        }


        const title =
            document.getElementById(
                "realChallengeTitle"
            ).value.trim();


        const description =
            document.getElementById(
                "realChallengeDescription"
            ).value.trim();


        if (!title || !description) {

            alert(
                "Enter a challenge title and description."
            );

            return;

        }


        // Safe challenge filtering

        const blockedWords = [

            "self harm",
            "suicide",
            "hurt yourself",
            "weapon",
            "drug",
            "steal",
            "illegal",
            "dangerous",
            "injure",
            "blood",
            "choke",
            "fire"

        ];


        const text =
            (
                title +
                " " +
                description
            ).toLowerCase();


        if (
            blockedWords.some(
                word =>
                    text.includes(word)
            )
        ) {

            alert(
                "This challenge isn't allowed. " +
                "Create a safe skill-based challenge."
            );

            return;

        }


        const roomRef =
            doc(
                db,
                "rooms",
                currentRoomCode
            );


        try {

            await runTransaction(
                db,
                async function(transaction) {

                    const snapshot =
                        await transaction.get(
                            roomRef
                        );


                    if (!snapshot.exists()) {

                        throw new Error(
                            "ROOM_NOT_FOUND"
                        );

                    }


                    const room =
                        snapshot.data();


                    const isPlayerOne =
                        room.playerOneUid ===
                        currentUser.uid;


                    const isPlayerTwo =
                        room.playerTwoUid ===
                        currentUser.uid;


                    if (
                        !isPlayerOne &&
                        !isPlayerTwo
                    ) {

                        throw new Error(
                            "NOT_A_PLAYER"
                        );

                    }


                    transaction.update(
                        roomRef,
                        {

                            challenge: {

                                title:
                                    title,

                                description:
                                    description,

                                reward:
                                    100,

                                createdBy:
                                    currentUser.uid,

                                createdAt:
                                    Date.now()

                            },

                            turn:
                                isPlayerOne
                                    ? "playerTwo"
                                    : "playerOne"

                        }
                    );

                }
            );


            document.getElementById(
                "realChallengeTitle"
            ).value = "";


            document.getElementById(
                "realChallengeDescription"
            ).value = "";


            alert(
                "Challenge sent!"
            );


        } catch (error) {

            console.error(error);

            alert(
                "Could not send challenge."
            );

        }

    };


// =====================================================
// COMPLETE CHALLENGE
// =====================================================

window.completeRealChallenge =
    async function() {

        if (
            !currentRoomCode ||
            !currentUser
        ) {

            return;

        }


        const roomRef =
            doc(
                db,
                "rooms",
                currentRoomCode
            );


        try {

            await runTransaction(
                db,
                async function(transaction) {

                    const snapshot =
                        await transaction.get(
                            roomRef
                        );


                    if (!snapshot.exists()) {

                        throw new Error(
                            "ROOM_NOT_FOUND"
                        );

                    }


                    const room =
                        snapshot.data();


                    if (!room.challenge) {

                        throw new Error(
                            "NO_CHALLENGE"
                        );

                    }


                    const isPlayerOne =
                        room.playerOneUid ===
                        currentUser.uid;


                    const isPlayerTwo =
                        room.playerTwoUid ===
                        currentUser.uid;


                    if (
                        !isPlayerOne &&
                        !isPlayerTwo
                    ) {

                        throw new Error(
                            "NOT_A_PLAYER"
                        );

                    }


                    const reward =
                        room.challenge.reward ||
                        100;


                    const updates = {

                        challenge:
                            null,

                        turn:
                            isPlayerOne
                                ? "playerOne"
                                : "playerTwo"

                    };


                    if (isPlayerOne) {

                        updates.playerOneScore =
                            (room.playerOneScore || 0)
                            + reward;

                    } else {

                        updates.playerTwoScore =
                            (room.playerTwoScore || 0)
                            + reward;

                    }


                    transaction.update(
                        roomRef,
                        updates
                    );

                }
            );


            alert(
                "Challenge completed! +" +
                "100 XP"
            );


        } catch (error) {

            console.error(error);

            alert(
                "Could not complete challenge."
            );

        }

    };


// =====================================================
// COPY ROOM CODE
// =====================================================

window.copyRealRoomCode =
    function() {

        if (!currentRoomCode)
            return;


        navigator.clipboard
            .writeText(
                currentRoomCode
            )
            .then(
                function() {

                    alert(
                        "Room code copied!"
                    );

                }
            );

    };


// =====================================================
// HTML ESCAPE
// =====================================================

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}
