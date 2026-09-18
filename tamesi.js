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


