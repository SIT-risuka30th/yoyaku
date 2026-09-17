// 💡 ダッシュボード画面が開かれたとき、JavaScriptが自動で実行する処理のイメージ
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. ログイン状態のチェック (Firebase等の機能を利用)
    const isLoggedIn = checkUserStatus(); // ログインしているか判定する関数（仮）

    if (!isLoggedIn && window.location.pathname.includes("dashboard.html")) {
        alert("ログインが必要です。");
        window.location.href = "login.html"; // 未ログインならログイン画面へ強制送還
    }

    // 2. ログアウト処理
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            // ログアウト処理を実行してlogin.htmlへリダイレクト
            window.location.href = "login.html";
        });
    }
});


import { initializeApp } from "https://gstatic.com";
import { getAuth, signInWithEmailAndPassword } from "https://gstatic.com";

const firebaseConfig = {
    apiKey: "AIzaSyBtLHgM6RzCU_grTElSqLCmsaRu4rVe-4o",
    authDomain: "koubai-7b6a6.firebaseapp.com",
    projectId: "koubai-7b6a6",
    storageBucket: "koubai-7b6a6.firebasetorage.app",
    messagingSenderId: "934504714342",
    appId: "1:934504714342:web:e160ada63fcfcd906c5da7",
    measurementID: "G-57V67C28RK"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ＝===================================================
// ④ ここから下に、これまでのログイン処理などのコードを書く
// ＝===================================================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Firebaseの機能を使ってログインチェックを実行！
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                alert("ログインに成功しました！");
                window.location.href = "dashboard.html"; // ダッシュボードへ移動
            })
            .catch((error) => {
                console.error("エラー内容:", error.code);
                document.getElementById("errorMessage").textContent = "IDまたはパスワードが違います。";
            });
    });
}
