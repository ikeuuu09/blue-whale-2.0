import {
    auth,
    db
} from "./firebase-config.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


// =====================================================
// REGISTER
// =====================================================

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async (event) => {

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
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById("registerPassword")
                    .value;


            const message =
                document.getElementById(
                    "registerMessage"
                );


            if (username.length < 3) {

                message.textContent =
                    "Username must be at least 3 characters.";

                return;

            }


            if (password.length < 6) {

                message.textContent =
                    "Password must be at least 6 characters.";

                return;

            }


            message.textContent =
                "Creating your account...";


            try {

                const result =
                    await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                const user =
                    result.user;


                // Create Firestore player profile

                await setDoc(
                    doc(
                        db,
                        "players",
                        user.uid
                    ),
                    {

                        uid: user.uid,

                        username: username,

                        email: email,

                        xp: 0,

                        level: 1,

                        wins: 0,

                        losses: 0,

                        challengesCompleted: 0,

                        createdAt:
                            serverTimestamp()

                    }
                );


                message.textContent =
                    "✅ Account created!";


                setTimeout(() => {

                    window.location.href =
                        "dashboard.html";

                }, 800);


            } catch (error) {

                console.error(
                    "Registration error:",
                    error
                );


                message.textContent =
                    firebaseErrorMessage(
                        error.code
                    );

            }

        }
    );

}


// =====================================================
// LOGIN
// =====================================================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById("loginPassword")
                    .value;


            const message =
                document.getElementById(
                    "loginMessage"
                );


            if (!email) {

                message.textContent =
                    "Please enter your email.";

                return;

            }


            if (!password) {

                message.textContent =
                    "Please enter your password.";

                return;

            }


            message.textContent =
                "Logging in...";


            try {

                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


                message.textContent =
                    "✅ Login successful!";


                setTimeout(() => {

                    window.location.href =
                        "dashboard.html";

                }, 500);


            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );


                message.textContent =
                    firebaseErrorMessage(
                        error.code
                    );

            }

        }
    );

}


// =====================================================
// LOGOUT
// =====================================================

window.logoutFirebase =
    async function () {

        try {

            await signOut(auth);

            window.location.href =
                "login.html";

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

        }

    };


// =====================================================
// AUTH STATE
// =====================================================

window.requireLogin =
    function (callback) {

        onAuthStateChanged(
            auth,
            (user) => {

                if (!user) {

                    window.location.href =
                        "login.html";

                    return;

                }


                if (callback) {

                    callback(user);

                }

            }
        );

    };


// =====================================================
// FIREBASE ERROR MESSAGES
// =====================================================

function firebaseErrorMessage(code) {

    switch (code) {

        case "auth/email-already-in-use":
            return "❌ This email is already registered.";

        case "auth/invalid-email":
            return "❌ Please enter a valid email address.";

        case "auth/weak-password":
            return "❌ Password must be at least 6 characters.";

        case "auth/invalid-credential":
            return "❌ Incorrect email or password.";

        case "auth/user-not-found":
            return "❌ No account found with this email.";

        case "auth/wrong-password":
            return "❌ Incorrect password.";

        case "auth/too-many-requests":
            return "❌ Too many attempts. Try again later.";

        case "auth/network-request-failed":
            return "❌ Network error. Check your internet connection.";

        default:
            return "❌ Something went wrong. Check the browser console.";

    }

}
