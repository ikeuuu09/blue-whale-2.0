import {
    auth,
    db
} from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc,
    runTransaction,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


let currentUser = null;

let currentRoomCode = null;

let unsubscribeRoom = null;


// =====================================================
// AUTHENTICATION
// =====================================================

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            console.log(
                "No Firebase user found."
            );

            window.location.href =
                "login.html";

            return;

        }


        currentUser = user;

        console.log(
            "Firebase user:",
            user.email
        );

    }
);


// =====================================================
// GENERATE ROOM CODE
// =====================================================

function generateRoomCode() {

    const characters =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code = "";

    for (
        let i = 0;
        i < 6;
        i++
    ) {

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
// GET PROFILE
// =====================================================

async function getProfile(uid) {

    const profileRef =
        doc(
            db,
            "players",
            uid
        );


    const snapshot =
        await getDoc(
            profileRef
        );


    if (!snapshot.exists()) {

        throw new Error(
            "PROFILE_NOT_FOUND"
        );

    }


    return snapshot.data();

}


// =====================================================
// CREATE ROOM
// =====================================================

async function createRoom() {

    if (!currentUser) {

        showMessage(
            "Please wait for Firebase login."
        );

        return;

    }


    try {

        showMessage(
            "Creating room..."
        );


        const profile =
            await getProfile(
                currentUser.uid
            );


        let createdCode = null;


        for (
            let attempt = 0;
            attempt < 10;
            attempt++
        ) {

            const code =
                generateRoomCode();


            const roomRef =
                doc(
                    db,
                    "rooms",
                    code
                );


            const existing =
                await getDoc(
                    roomRef
                );


            if (
                !existing.exists()
            ) {

                await setDoc(
                    roomRef,
                    {

                        roomCode:
                            code,

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


                createdCode =
                    code;


                break;

            }

        }


        if (!createdCode) {

            throw new Error(
                "ROOM_CREATE_FAILED"
            );

        }


        currentRoomCode =
            createdCode;


        showRoom(
            createdCode
        );


        listenToRoom(
            createdCode
        );


    } catch (error) {

        console.error(
            "Create room error:",
            error
        );


        showMessage(
            getFriendlyError(error)
        );

    }

}


// =====================================================
// JOIN ROOM
// =====================================================

async function joinRoom() {

    if (!currentUser) {

        showMessage(
            "Please wait for Firebase login."
        );

        return;

    }


    const input =
        document.getElementById(
            "realRoomCode"
        );


    const code =
        input.value
            .trim()
            .toUpperCase();


    if (
        !/^[A-Z0-9]{6}$/.test(code)
    ) {

        showMessage(
            "Enter a valid 6-character room code."
        );

        return;

    }


    try {

        showMessage(
            "Joining room..."
        );


        const profile =
            await getProfile(
                currentUser.uid
            );


        const roomRef =
            doc(
                db,
                "rooms",
                code
            );


        await runTransaction(
            db,
            async (transaction) => {

                const snapshot =
                    await transaction.get(
                        roomRef
                    );


                if (
                    !snapshot.exists()
                ) {

                    throw new Error(
                        "ROOM_NOT_FOUND"
                    );

                }


                const room =
                    snapshot.data();


                if (
                    room.playerOneUid ===
                    currentUser.uid
                ) {

                    return;

                }


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
            code;


        showRoom(
            code
        );


        listenToRoom(
            code
        );


    } catch (error) {

        console.error(
            "Join room error:",
            error
        );


        showMessage(
            getFriendlyError(error)
        );

    }

}


// =====================================================
// SHOW ROOM
// =====================================================

function showRoom(code) {

    document.getElementById(
        "realLobby"
    ).style.display =
        "none";


    document.getElementById(
        "realRoom"
    ).style.display =
        "block";


    document.getElementById(
        "realRoomDisplay"
    ).textContent =
        code;


    showMessage("");

}


// =====================================================
// LISTEN TO ROOM
// =====================================================

function listenToRoom(code) {

    if (
        unsubscribeRoom
    ) {

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
            (snapshot) => {

                if (
                    !snapshot.exists()
                ) {

                    alert(
                        "Room was deleted."
                    );

                    return;

                }


                const room =
                    snapshot.data();


                updateRoomUI(
                    room
                );

            },
            (error) => {

                console.error(
                    "Room listener error:",
                    error
                );

                alert(
                    "Could not listen to room."
                );

            }
        );

}


// =====================================================
// UPDATE ROOM
// =====================================================

function updateRoomUI(room) {

    document.getElementById(
        "realPlayerOne"
    ).textContent =
        room.playerOneName ||
        "Player 1";


    document.getElementById(
        "realPlayerTwo"
    ).textContent =
        room.playerTwoName ||
        "Waiting...";


    document.getElementById(
        "realScoreOne"
    ).textContent =
        room.playerOneScore ||
        0;


    document.getElementById(
        "realScoreTwo"
    ).textContent =
        room.playerTwoScore ||
        0;


    document.getElementById(
        "realRoomStatus"
    ).textContent =
        room.playerTwoUid
            ? "🟢 MATCH ACTIVE"
            : "🟡 WAITING FOR PLAYER";


    displayChallenge(
        room
    );

}


// =====================================================
// CREATE CHALLENGE
// =====================================================

async function sendChallenge() {

    if (
        !currentUser ||
        !currentRoomCode
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


    if (
        !title ||
        !description
    ) {

        alert(
            "Enter a challenge title and description."
        );

        return;

    }


    // Safe challenge filter

    const blockedWords = [

        "suicide",
        "self harm",
        "self-harm",
        "hurt yourself",
        "weapon",
        "drug",
        "steal",
        "illegal",
        "dangerous",
        "injure",
        "choke",
        "fire"

    ];


    const combined =
        (
            title +
            " " +
            description
        ).toLowerCase();


    if (
        blockedWords.some(
            word =>
                combined.includes(word)
        )
    ) {

        alert(
            "Please create a safe, skill-based challenge."
        );

        return;

    }


    try {

        const roomRef =
            doc(
                db,
                "rooms",
                currentRoomCode
            );


        await runTransaction(
            db,
            async (transaction) => {

                const snapshot =
                    await transaction.get(
                        roomRef
                    );


                if (
                    !snapshot.exists()
                ) {

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
                        "NOT_PLAYER"
                    );

                }


                if (
                    !room.playerTwoUid
                ) {

                    throw new Error(
                        "WAITING_FOR_PLAYER"
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

                        }

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

        console.error(
            "Challenge error:",
            error
        );


        alert(
            getFriendlyError(error)
        );

    }

}


// =====================================================
// DISPLAY CHALLENGE
// =====================================================

function displayChallenge(room) {

    const box =
        document.getElementById(
            "liveChallenge"
        );


    if (
        !room.challenge
    ) {

        box.innerHTML = `

            <div class="waiting-box">

                <div class="waiting-animation">
                    ⚔️
                </div>

                <h2>
                    Ready for battle
                </h2>

                <p>
                    Waiting for a challenge...
                </p>

            </div>

        `;

        return;

    }


    box.innerHTML = `

        <div class="opponent-challenge">

            <span class="section-tag">
                ⚔️ NEW CHALLENGE
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

            <p>
                ⭐ Reward:
                <strong>
                    ${room.challenge.reward}
                    XP
                </strong>
            </p>

        </div>

    `;

}


// =====================================================
// COPY ROOM
// =====================================================

async function copyRoomCode() {

    if (
        !currentRoomCode
    ) {

        return;

    }


    try {

        await navigator.clipboard.writeText(
            currentRoomCode
        );


        alert(
            "Room code copied!"
        );

    } catch {

        alert(
            "Room code: " +
            currentRoomCode
        );

    }

}


// =====================================================
// MESSAGE
// =====================================================

function showMessage(message) {

    const element =
        document.getElementById(
            "roomMessage"
        );


    if (element) {

        element.textContent =
            message;

    }

}


// =====================================================
// ERROR HANDLER
// =====================================================

function getFriendlyError(error) {

    switch (
        error.message
    ) {

        case "PROFILE_NOT_FOUND":
            return "Your player profile was not found. Please register again.";

        case "ROOM_CREATE_FAILED":
            return "Could not create a room. Try again.";

        case "ROOM_NOT_FOUND":
            return "That room does not exist.";

        case "ROOM_FULL":
            return "That room already has two players.";

        case "NOT_PLAYER":
            return "You are not a player in this room.";

        case "WAITING_FOR_PLAYER":
            return "Wait for Player 2 to join first.";

        default:
            return "Something went wrong. Open F12 → Console for the exact error.";

    }

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// =====================================================
// BUTTONS
// =====================================================

document
    .getElementById(
        "createRoomButton"
    )
    .addEventListener(
        "click",
        createRoom
    );


document
    .getElementById(
        "joinRoomButton"
    )
    .addEventListener(
        "click",
        joinRoom
    );


document
    .getElementById(
        "copyRoomButton"
    )
    .addEventListener(
        "click",
        copyRoomCode
    );


document
    .getElementById(
        "sendChallengeButton"
    )
    .addEventListener(
        "click",
        sendChallenge
    );
    