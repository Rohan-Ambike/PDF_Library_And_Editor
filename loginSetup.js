
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getDatabase, set, get, ref, child } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyDZi8B2z-0KI5HE7DqZO-kL59LOwZhA6wY",
    authDomain: "pdfeditor-503b6.firebaseapp.com",
    databaseURL: "https://pdfeditor-503b6-default-rtdb.firebaseio.com",
    projectId: "pdfeditor-503b6",
    storageBucket: "pdfeditor-503b6.appspot.com",
    messagingSenderId: "906558857959",
    appId: "1:906558857959:web:a5a4edeff417400d607842",
    measurementId: "G-S17RYGB8F4"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth(app);
const dbref = ref(db);
const analytics = getAnalytics(app);

// LOGIN FORM START

let EmailLogInp = document.getElementById('emailLogInp');
let PassLogInp = document.getElementById('passwordLogInp');

let LoginForm = document.getElementById('LoginForm');

let ForgotPassLabel = document.getElementById('forgotpasslabel');


let SignInUser = evt => {
    evt.preventDefault();
    signInWithEmailAndPassword(auth, EmailLogInp.value, PassLogInp.value).then((credentials) => {
        // console.log(credentials);
        alert("Logged in!! 😄");
        permission(true);
    }).catch((error) => {
        alert(error.message + " Login Failed!! 😡");
        console.log(error.code);
        console.log(error.message);
    })
}

let ForgotPassword = () => {
    sendPasswordResetEmail(auth, EmailLogInp.value).then(() => {
        alert("A Password Reset Link has been sent to your email! 🤓");
        // console.log(EmailLogInp.value);
    }).catch((error) => {
        alert(error.message + "Task Failed, Contact Admin! 😮");
        console.log(error.code);
        console.log(error.message);
    })
}

LoginForm.addEventListener('submit', SignInUser);
ForgotPassLabel.addEventListener('click', ForgotPassword);

// document.getElementById('navSignOut').addEventListener('click', permission(false));


// LOGIN FORM END


// REGISTER FORM START

let FnameRegInp = document.getElementById('fnameRegInp');
let LnameRegInp = document.getElementById('lnameRegInp');
let PhoneRegInp = document.getElementById('phoneRegInp');
let EmailRegInp = document.getElementById('emailRegInp');
let PassRegInp = document.getElementById('passwordRegInp');
let RegisterForm = document.getElementById('RegisterForm');


let RegisterUser = evt => {
    evt.preventDefault();
    createUserWithEmailAndPassword(auth, EmailRegInp.value, PassRegInp.value).then((credentials) => {
        // console.log(credentials);
        set(ref(db, 'UserInformation/' + credentials.user.uid), {
            firstname: FnameRegInp.value,
            lastname: LnameRegInp.value,
            email: EmailRegInp.value,
            phone: PhoneRegInp.value
        });

        alert('User Created!! 🤩');

    }).catch((error) => {
        alert(error.message + " Something went wrong! 🧐");
        console.log(error.code);
        console.log(error.message);
    })

}

RegisterForm.addEventListener('submit', RegisterUser);

// REGISTER FORM End

