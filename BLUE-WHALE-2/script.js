// ============================================
// BLUE WHALE 2.0
// Main JavaScript
// ============================================

const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");


// ============================================
// MODAL
// ============================================

function openModal(content) {

    modalContent.innerHTML = content;

    modal.style.display = "flex";
}


function closeModal() {

    modal.style.display = "none";
}


// Close when clicking outside

modal.addEventListener("click", function (event) {

    if (event.target === modal) {
        closeModal();
    }

});


// ============================================
// SOLO
// ============================================

function openSolo() {

    document
        .getElementById("challenges")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// ============================================
// START CHALLENGE
// ============================================

function startChallenge(name) {

    openModal(`
    
        <h2 style="color:#38bdf8;">
            🎯 ${name}
        </h2>

        <p style="
            color:#94a3b8;
            margin:20px 0;
            line-height:1.7;
        ">
            Challenge ready!
            Complete the challenge and submit
            your proof when you're finished.
        </p>

        <button
            class="primary-btn"
            onclick="beginChallenge('${name}')">

            START

        </button>

    `);

}


function beginChallenge(name) {

    openModal(`

        <h2 style="color:#38bdf8;">
            ${name}
        </h2>

        <div style="
            margin:30px 0;
            font-size:50px;
            text-align:center;
        ">
            ⏱️
        </div>

        <p style="
            text-align:center;
            color:#94a3b8;
        ">
            Challenge started!
        </p>

        <button
            class="secondary-btn"
            style="
                width:100%;
                margin-top:25px;
            "
            onclick="submitProof()">

            📸 SUBMIT PROOF

        </button>

    `);

}


// ============================================
// PROOF
// ============================================

function submitProof() {

    openModal(`

        <h2 style="color:#38bdf8;">
            📸 Submit Proof
        </h2>

        <p style="
            color:#94a3b8;
            margin:15px 0;
        ">
            Upload evidence that you completed
            the challenge.
        </p>

        <input
            type="file"
            accept="image/*,video/*"
            style="
                width:100%;
                margin:20px 0;
                padding:15px;
                background:#020617;
                color:white;
                border:1px solid #075985;
                border-radius:10px;
            "
        >

        <button
            class="primary-btn"
            style="width:100%;"
            onclick="proofSubmitted()">

            SUBMIT PROOF

        </button>

    `);

}


function proofSubmitted() {

    openModal(`

        <div style="text-align:center;">

            <div style="font-size:60px;">
                ✅
            </div>

            <h2 style="color:#38bdf8;">
                Proof Submitted!
            </h2>

            <p style="
                color:#94a3b8;
                margin-top:15px;
            ">
                Your proof has been submitted
                for verification.
            </p>

        </div>

    `);

}


// ============================================
// MULTIPLAYER
// ============================================

function openMultiplayer() {

    openModal(`

        <h2 style="color:#38bdf8;">
            ⚔️ Multiplayer
        </h2>

        <p style="
            color:#94a3b8;
            margin:20px 0;
        ">
            Choose how you want to play.
        </p>

        <button
            class="primary-btn"
            style="width:100%; margin-bottom:10px;"
            onclick="createRoom()">

            ➕ CREATE ROOM

        </button>

        <button
            class="secondary-btn"
            style="width:100%;"
            onclick="joinRoom()">

            🔗 JOIN ROOM

        </button>

    `);

}


function createRoom() {

    const roomCode =
        Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

    openModal(`

        <div style="text-align:center;">

            <h2 style="color:#38bdf8;">
                ROOM CREATED
            </h2>

            <p style="
                color:#94a3b8;
                margin:20px;
            ">
                Share this code with your opponent.
            </p>

            <div style="
                font-size:35px;
                letter-spacing:8px;
                padding:20px;
                background:#020617;
                border-radius:10px;
                color:white;
            ">
                ${roomCode}
            </div>

            <p style="
                color:#64748b;
                margin-top:20px;
            ">
                Waiting for opponent...
            </p>

        </div>

    `);

}


function joinRoom() {

    openModal(`

        <h2 style="color:#38bdf8;">
            JOIN ROOM
        </h2>

        <input
            id="roomCode"
            type="text"
            placeholder="Enter room code"
            maxlength="6"
            style="
                width:100%;
                padding:15px;
                margin:20px 0;
                background:#020617;
                color:white;
                border:1px solid #075985;
                border-radius:10px;
            "
        >

        <button
            class="primary-btn"
            style="width:100%;"
            onclick="joinRoomNow()">

            JOIN

        </button>

    `);

}


function joinRoomNow() {

    const code =
        document
        .getElementById("roomCode")
        .value
        .trim()
        .toUpperCase();

    if (!code) {

        alert("Please enter a room code.");

        return;
    }

    openModal(`

        <div style="text-align:center;">

            <div style="font-size:60px;">
                ⚔️
            </div>

            <h2 style="color:#38bdf8;">
                ROOM JOINED
            </h2>

            <p style="
                color:#94a3b8;
                margin-top:15px;
            ">
                Room: ${code}
            </p>

            <p style="
                color:#64748b;
                margin-top:10px;
            ">
                Waiting for the match to begin...
            </p>

        </div>

    `);

}


// ============================================
// PROFILE
// ============================================

function openProfile() {

    openModal(`

        <div style="text-align:center;">

            <div style="font-size:70px;">
                👤
            </div>

            <h2 style="color:#38bdf8;">
                PLAYER
            </h2>

            <p style="
                color:#94a3b8;
                margin-top:10px;
            ">
                Level 12
            </p>

            <p style="
                color:#38bdf8;
                margin-top:5px;
            ">
                ⭐ 8,420 XP
            </p>

        </div>

    `);

}


// ============================================
// ALL CHALLENGES
// ============================================

function showAllChallenges() {

    openModal(`

        <h2 style="color:#38bdf8;">
            🎯 All Challenges
        </h2>

        <p style="
            color:#94a3b8;
            margin:20px 0;
        ">
            More challenges will appear here
            once our challenge database is connected.
        </p>

        <button
            class="primary-btn"
            onclick="closeModal()">

            CLOSE

        </button>

    `);

}
// =====================================================
// LOCAL AUTHENTICATION SYSTEM
// BLUE WHALE 2.0 V1
// =====================================================


// -----------------------------------------------------
// REGISTER
// -----------------------------------------------------

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const username =
                document
                .getElementById("registerUsername")
                .value
                .trim();

            const email =
                document
                .getElementById("registerEmail")
                .value
                .trim();

            const password =
                document
                .getElementById("registerPassword")
                .value;

            const confirmPassword =
                document
                .getElementById("confirmPassword")
                .value;

            const message =
                document.getElementById(
                    "registerMessage"
                );


            // Check password

            if (password !== confirmPassword) {

                message.textContent =
                    "Passwords do not match.";

                message.className =
                    "form-message error";

                return;
            }


            // Check existing user

            const existingUser =
                localStorage.getItem(
                    "blueWhaleUser"
                );


            if (existingUser) {

                const user =
                    JSON.parse(existingUser);

                if (
                    user.username.toLowerCase()
                    === username.toLowerCase()
                ) {

                    message.textContent =
                        "Username already exists.";

                    message.className =
                        "form-message error";

                    return;
                }
            }


            // Create user

            const user = {

                username: username,

                email: email,

                password: password,

                xp: 0,

                level: 1,

                wins: 0,

                losses: 0,

                challengesCompleted: 0

            };


            localStorage.setItem(
                "blueWhaleUser",
                JSON.stringify(user)
            );


            message.textContent =
                "Account created successfully!";

            message.className =
                "form-message success";


            setTimeout(function () {

                window.location.href =
                    "login.html";

            }, 1200);

        }
    );

}


// -----------------------------------------------------
// LOGIN
// -----------------------------------------------------

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const username =
                document
                .getElementById("loginUsername")
                .value
                .trim();

            const password =
                document
                .getElementById("loginPassword")
                .value;

            const message =
                document.getElementById(
                    "loginMessage"
                );


            const storedUser =
                localStorage.getItem(
                    "blueWhaleUser"
                );


            if (!storedUser) {

                message.textContent =
                    "No account found. Please register first.";

                message.className =
                    "form-message error";

                return;
            }


            const user =
                JSON.parse(storedUser);


            if (
                user.username.toLowerCase()
                !== username.toLowerCase()
                ||
                user.password !== password
            ) {

                message.textContent =
                    "Incorrect username or password.";

                message.className =
                    "form-message error";

                return;
            }


            // Login successful

            localStorage.setItem(
                "blueWhaleLoggedIn",
                "true"
            );


            message.textContent =
                "Login successful! Entering the arena...";

            message.className =
                "form-message success";


            setTimeout(function () {

                window.location.href =
    "dashboard.html";

            }, 1000);

        }
    );

}
// =====================================================
// DASHBOARD SYSTEM
// =====================================================


// Load dashboard information

function loadDashboard() {

    const storedUser =
        localStorage.getItem("blueWhaleUser");

    const loggedIn =
        localStorage.getItem("blueWhaleLoggedIn");


    if (!storedUser || loggedIn !== "true") {

        window.location.href = "login.html";

        return;

    }


    const user =
        JSON.parse(storedUser);


    const username =
        document.getElementById(
            "dashboardUsername"
        );

    const xp =
        document.getElementById(
            "dashboardXP"
        );

    const completed =
        document.getElementById(
            "dashboardCompleted"
        );

    const wins =
        document.getElementById(
            "dashboardWins"
        );

    const losses =
        document.getElementById(
            "dashboardLosses"
        );

    const level =
        document.getElementById(
            "dashboardLevel"
        );

    const currentLevel =
        document.getElementById(
            "xpCurrentLevel"
        );

    const progress =
        document.getElementById(
            "xpProgress"
        );

    const progressText =
        document.getElementById(
            "xpProgressText"
        );


    if (username)
        username.textContent = user.username;


    if (xp)
        xp.textContent = user.xp;


    if (completed)
        completed.textContent =
            user.challengesCompleted;


    if (wins)
        wins.textContent = user.wins;


    if (losses)
        losses.textContent = user.losses;


    const calculatedLevel =
        Math.floor(user.xp / 500) + 1;


    if (level)
        level.textContent =
            calculatedLevel;


    if (currentLevel)
        currentLevel.textContent =
            calculatedLevel;


    const levelStart =
        (calculatedLevel - 1) * 500;

    const levelXP =
        user.xp - levelStart;

    const percentage =
        Math.min(
            (levelXP / 500) * 100,
            100
        );


    if (progress)
        progress.style.width =
            percentage + "%";


    if (progressText)
        progressText.textContent =
            levelXP + " / 500";

}


// Run dashboard

if (
    document.querySelector(
        ".dashboard-page"
    )
) {

    loadDashboard();

}


// =====================================================
// SOLO CHALLENGES
// =====================================================

function startSoloChallenge(
    challengeName,
    reward
) {

    openModal(`

        <div>

            <span class="section-tag">
                SOLO CHALLENGE
            </span>

            <h2 style="
                font-size:30px;
                margin-top:10px;
                color:#38bdf8;
            ">
                ${challengeName}
            </h2>

            <p style="
                color:#94a3b8;
                line-height:1.7;
                margin:20px 0;
            ">
                Complete this challenge and submit
                proof when you are finished.
            </p>

            <div style="
                padding:20px;
                background:#020617;
                border:1px solid #0c3150;
                border-radius:12px;
                margin-bottom:20px;
            ">

                <strong>
                    ⭐ Reward: ${reward} XP
                </strong>

            </div>

            <button
                class="primary-btn"
                style="width:100%;"
                onclick="
                    completeSoloChallenge(
                        '${challengeName}',
                        ${reward}
                    )
                "
            >
                COMPLETE CHALLENGE
            </button>

        </div>

    `);

}


// Complete challenge

function completeSoloChallenge(
    challengeName,
    reward
) {

    const storedUser =
        localStorage.getItem(
            "blueWhaleUser"
        );


    if (!storedUser) {

        closeModal();

        window.location.href =
            "login.html";

        return;

    }


    const user =
        JSON.parse(storedUser);


    user.xp += reward;

    user.challengesCompleted += 1;


    localStorage.setItem(
        "blueWhaleUser",
        JSON.stringify(user)
    );


    openModal(`

        <div style="
            text-align:center;
        ">

            <div style="
                font-size:60px;
            ">
                🎉
            </div>

            <h2 style="
                color:#38bdf8;
                margin:15px 0;
            ">
                Challenge Complete!
            </h2>

            <p style="
                color:#94a3b8;
            ">
                ${challengeName}
            </p>

            <div style="
                margin:25px 0;
                font-size:30px;
                color:#38bdf8;
            ">
                +${reward} XP ⭐
            </div>

            <button
                class="primary-btn"
                onclick="
                    closeModal();
                    loadDashboard();
                "
            >
                CONTINUE
            </button>

        </div>

    `);

}


// =====================================================
// LOGOUT
// =====================================================

function logout() {

    localStorage.removeItem(
        "blueWhaleLoggedIn"
    );

    window.location.href =
        "login.html";

}
// =====================================================
// MULTIPLAYER SYSTEM
// BLUE WHALE 2.0 V1
// =====================================================


// Current room

let currentRoom = null;


// Current player

let currentPlayer = null;


// -----------------------------------------------------
// Generate Room Code
// -----------------------------------------------------

function generateRoomCode() {

    const characters =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code = "";

    for (let i = 0; i < 6; i++) {

        code +=
            characters.charAt(
                Math.floor(
                    Math.random() *
                    characters.length
                )
            );

    }

    return code;

}


// -----------------------------------------------------
// Get Current User
// -----------------------------------------------------

function getCurrentUser() {

    const storedUser =
        localStorage.getItem(
            "blueWhaleUser"
        );

    if (!storedUser) {

        window.location.href =
            "login.html";

        return null;

    }

    return JSON.parse(storedUser);

}


// -----------------------------------------------------
// CREATE ROOM
// -----------------------------------------------------

function createMultiplayerRoom() {

    const user =
        getCurrentUser();

    if (!user) return;


    const roomCode =
        generateRoomCode();


    const room = {

        code: roomCode,

        playerOne: {

            username: user.username,

            score: 0

        },

        playerTwo: null,

        challenge: null,

        status: "waiting",

        createdAt: Date.now()

    };


    localStorage.setItem(

        "blueWhaleRoom_" + roomCode,

        JSON.stringify(room)

    );


    currentRoom = room;

    currentPlayer = "playerOne";


    showActiveRoom();

}


// -----------------------------------------------------
// JOIN ROOM
// -----------------------------------------------------

function joinMultiplayerRoom() {

    const input =
        document.getElementById(
            "joinRoomInput"
        );

    if (!input) return;


    const code =
        input.value
            .trim()
            .toUpperCase();


    if (code.length !== 6) {

        alert(
            "Please enter a valid 6-character room code."
        );

        return;

    }


    const roomData =
        localStorage.getItem(
            "blueWhaleRoom_" + code
        );


    if (!roomData) {

        alert(
            "Room not found. Check the code and try again."
        );

        return;

    }


    const room =
        JSON.parse(roomData);


    if (room.playerTwo) {

        alert(
            "This room already has two players."
        );

        return;

    }


    const user =
        getCurrentUser();

    if (!user) return;


    room.playerTwo = {

        username: user.username,

        score: 0

    };


    room.status = "active";


    localStorage.setItem(

        "blueWhaleRoom_" + code,

        JSON.stringify(room)

    );


    currentRoom = room;

    currentPlayer = "playerTwo";


    showActiveRoom();

}


// -----------------------------------------------------
// SHOW ACTIVE ROOM
// -----------------------------------------------------

function showActiveRoom() {

    const lobby =
        document.getElementById(
            "multiplayerLobby"
        );

    const activeRoom =
        document.getElementById(
            "activeRoom"
        );


    if (lobby)
        lobby.style.display = "none";


    if (activeRoom)
        activeRoom.style.display = "block";


    updateRoomInterface();

}


// -----------------------------------------------------
// UPDATE ROOM
// -----------------------------------------------------

function updateRoomInterface() {

    if (!currentRoom) return;


    const code =
        document.getElementById(
            "currentRoomCode"
        );

    const shareCode =
        document.getElementById(
            "shareRoomCode"
        );

    const playerOne =
        document.getElementById(
            "playerOneName"
        );

    const playerTwo =
        document.getElementById(
            "playerTwoName"
        );

    const playerOneScore =
        document.getElementById(
            "playerOneScore"
        );

    const playerTwoScore =
        document.getElementById(
            "playerTwoScore"
        );


    if (code)
        code.textContent =
            currentRoom.code;


    if (shareCode)
        shareCode.textContent =
            currentRoom.code;


    if (playerOne)
        playerOne.textContent =
            currentRoom.playerOne.username;


    if (playerOneScore)
        playerOneScore.textContent =
            currentRoom.playerOne.score;


    if (currentRoom.playerTwo) {

        if (playerTwo)
            playerTwo.textContent =
                currentRoom.playerTwo.username;


        if (playerTwoScore)
            playerTwoScore.textContent =
                currentRoom.playerTwo.score;

    }


    updateTurnInterface();

}


// -----------------------------------------------------
// TURN INTERFACE
// -----------------------------------------------------

function updateTurnInterface() {

    const waitingBox =
        document.querySelector(
            ".waiting-box"
        );

    const creator =
        document.getElementById(
            "challengeCreator"
        );

    const opponent =
        document.getElementById(
            "opponentChallenge"
        );


    if (!currentRoom.playerTwo) {

        if (waitingBox)
            waitingBox.style.display =
                "block";

        if (creator)
            creator.style.display =
                "none";

        if (opponent)
            opponent.style.display =
                "none";

        return;

    }


    if (waitingBox)
        waitingBox.style.display =
            "none";


    /*
       Player One creates the first challenge.
    */

    if (
        currentPlayer === "playerOne" &&
        !currentRoom.challenge
    ) {

        if (creator)
            creator.style.display =
                "block";

        if (opponent)
            opponent.style.display =
                "none";

        return;

    }


    /*
       Player Two receives Player One's challenge.
    */

    if (
        currentPlayer === "playerTwo" &&
        currentRoom.challenge
    ) {

        if (creator)
            creator.style.display =
                "none";

        if (opponent)
            opponent.style.display =
                "block";


        const title =
            document.getElementById(
                "receivedChallengeTitle"
            );

        const description =
            document.getElementById(
                "receivedChallengeDescription"
            );


        if (title)
            title.textContent =
                currentRoom.challenge.title;


        if (description)
            description.textContent =
                currentRoom.challenge.description;


        return;

    }

}


// -----------------------------------------------------
// SEND CHALLENGE
// -----------------------------------------------------

function sendChallenge() {

    if (!currentRoom) return;


    const title =
        document.getElementById(
            "customChallengeTitle"
        ).value.trim();


    const description =
        document.getElementById(
            "customChallengeDescription"
        ).value.trim();


    if (!title || !description) {

        alert(
            "Please enter both a title and description."
        );

        return;

    }


    /*
       Basic safety check.
       This prototype blocks several categories
       of unsafe challenge requests.
    */

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
        "blood"

    ];


    const text =
        (
            title +
            " " +
            description
        ).toLowerCase();


    const unsafe =
        blockedWords.some(
            word =>
                text.includes(word)
        );


    if (unsafe) {

        alert(
            "This challenge cannot be submitted. " +
            "Please create a safe skill-based challenge."
        );

        return;

    }


    currentRoom.challenge = {

        title: title,

        description: description,

        reward: 100,

        createdBy: currentPlayer

    };


    localStorage.setItem(

        "blueWhaleRoom_" +
        currentRoom.code,

        JSON.stringify(currentRoom)

    );


    updateTurnInterface();


    alert(
        "Challenge sent to your opponent!"
    );

}


// -----------------------------------------------------
// COMPLETE OPPONENT CHALLENGE
// -----------------------------------------------------

function completeOpponentChallenge() {

    if (!currentRoom) return;


    const reward = 100;


    if (currentPlayer === "playerTwo") {

        currentRoom.playerTwo.score +=
            reward;

    } else {

        currentRoom.playerOne.score +=
            reward;

    }


    /*
       Clear the challenge after completion.
    */

    currentRoom.challenge = null;


    localStorage.setItem(

        "blueWhaleRoom_" +
        currentRoom.code,

        JSON.stringify(currentRoom)

    );


    /*
       Add XP to local player.
    */

    const storedUser =
        localStorage.getItem(
            "blueWhaleUser"
        );


    if (storedUser) {

        const user =
            JSON.parse(storedUser);


        user.xp += reward;

        user.challengesCompleted += 1;


        localStorage.setItem(

            "blueWhaleUser",

            JSON.stringify(user)

        );

    }


    openModal(`

        <div style="text-align:center;">

            <div style="font-size:60px;">
                🎉
            </div>

            <h2 style="
                color:#38bdf8;
                margin:15px 0;
            ">
                Challenge Completed!
            </h2>

            <p style="
                color:#94a3b8;
            ">
                You earned
            </p>

            <div style="
                font-size:32px;
                color:#38bdf8;
                margin:15px;
            ">
                +${reward} XP ⭐
            </div>

            <button
                class="primary-btn"
                onclick="closeModal(); updateRoomInterface();"
            >
                CONTINUE
            </button>

        </div>

    `);


}


// -----------------------------------------------------
// COPY ROOM CODE
// -----------------------------------------------------

function copyRoomCode() {

    if (!currentRoom) return;


    navigator.clipboard
        .writeText(
            currentRoom.code
        )
        .then(function () {

            alert(
                "Room code copied!"
            );

        })
        .catch(function () {

            alert(
                "Room code: " +
                currentRoom.code
            );

        });

}


// -----------------------------------------------------
// AUTO LOAD ROOM
// -----------------------------------------------------

if (
    window.location.pathname
        .toLowerCase()
        .includes("multiplayer.html")
) {

    const user =
        localStorage.getItem(
            "blueWhaleUser"
        );

    const loggedIn =
        localStorage.getItem(
            "blueWhaleLoggedIn"
        );


    if (!user || loggedIn !== "true") {

        window.location.href =
            "login.html";

    }

}
