// 1. Firebaseの必要な機能をインポート
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// 2. あなたのFirebase設定（接続情報）
const firebaseConfig = {
    apiKey: "AIzaSyBtLHgM6RzCU_grTElSqLCmsaRu4rVe-4o", 
    authDomain: "://firebaseapp.com", 
    projectId: "koubai-7b6a6", 
    storageBucket: "koubai-7b6a6.firebasetorage.app", 
    messagingSenderId: "934504714342", 
    appId: "1:934504714342:web:e160ada63fcfcd906c5da7"
};

// 3. Firebaseとデータベース（Firestore）の初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


//💡 ダッシュボード画面が開かれたとき、JavaScriptが自動で実行する処理のイメージ
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


import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// 2. あなたのFirebase設定
const firebaseConfig = {
    apiKey: "AIzaSyBtLHgM6RzCU_grTElSqLCmsaRu4rVe-4o", 
    authDomain: "://firebaseapp.com", 
    projectId: "koubai-7b6a6", 
    storageBucket: "koubai-7b6a6.firebasetorage.app", 
    messagingSenderId: "934504714342", 
    appId: "1:934504714342:web:e160ada63fcfcd906c5da7"
};

// 3. 初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 4. 商品の単価設定
const PRICE_A = 160;
const PRICE_B = 180;
const PRICE_C = 140;
const PRICE_D1 = 180;
const PRICE_D2 = 180;
const PRICE_D3 = 150;

// 数量と金額を記録する変数をトップレベルに用意
let savedName = 0;
let savedMsg = 0;
let saved1 = 0;
let savedD1 = 0;
let savedD2 = 0;
let savedD3 = 0;

let totalA = 0;
let totalB = 0;
let totalC = 0;
let totalD1 = 0;
let totalD2 = 0;
let totalD3 = 0;

// 💡 表示と非表示、テキスト代入をまとめた関数
function handleRow(rowId, countId, priceId, count, price) {
    const rowElement = document.getElementById(rowId);
    if (!rowElement) return;

    if (count === 0) {
        rowElement.style.display = 'none'; // 0個なら行ごと隠す
    } else {
        rowElement.style.display = ''; // 表示する
        document.getElementById(countId).textContent = count + "個";
        document.getElementById(priceId).textContent = price.toLocaleString() + "円";
    }
}

// 5. 画面が開いた時の初期化と計算処理（バグを防ぐため、一番最初に走るように調整しました）
function initDashboard() {
    // ローカルストレージから個数を取得。空なら0にする
    const rawA = localStorage.getItem('inputName') || "";
    const rawB = localStorage.getItem('inputMsg') || "";
    const rawC = localStorage.getItem('input1') || "";
    const rawD1 = localStorage.getItem('inputD1') || "";
    const rawD2 = localStorage.getItem('inputD2') || "";
    const rawD3 = localStorage.getItem('inputD3') || "";

    // 数値に変換
    savedName = parseInt(rawA.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 65248)), 10) || 0;
    savedMsg = parseInt(rawB.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 65248)), 10) || 0;
    saved1 = parseInt(rawC.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 65248)), 10) || 0;
    savedD1 = parseInt(rawD1.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 65248)), 10) || 0;
    savedD2 = parseInt(rawD2.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 65248)), 10) || 0;
    savedD3 = parseInt(rawD3.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 65248)), 10) || 0;

    // 料金の計算
    totalA = savedName * PRICE_A;
    totalB = savedMsg * PRICE_B;
    totalC = saved1 * PRICE_C;
    totalD1 = savedD1 * PRICE_D1;
    totalD2 = savedD2 * PRICE_D2;
    totalD3 = savedD3 * PRICE_D3;

    // 画面への表示
    handleRow('rowName', 'displayName', 'priceName', savedName, totalA);
    handleRow('rowMsg', 'displayMsg', 'priceMsg', savedMsg, totalB);
    handleRow('row1', 'display1', 'price1', saved1, totalC);
    handleRow('rowD1', 'displayD1', 'priceD1', savedD1, totalD1);
    handleRow('rowD2', 'displayD2', 'priceD2', savedD2, totalD2);
    handleRow('rowD3', 'displayD3', 'priceD3', savedD3, totalD3);

    // 総合計の表示
    const totalBox = document.getElementById('totalPrice');
    if (totalBox) {
        totalBox.textContent = (totalA + totalB + totalC + totalD1 + totalD2 + totalD3).toLocaleString();
    }
}

// type="module" では、DOMが準備できたら直接関数を呼び出すのが安全です
initDashboard();

// 6. 📤 注文データ送信処理
const mailBtn = document.getElementById('mailBtn');
if (mailBtn) {
    mailBtn.addEventListener('click', async () => {
        const nameInput = document.getElementById('yourname').value;
        const gakunenInput = document.getElementById('gakunen').value;
        const classInput = document.getElementById('class').value;

        if (!nameInput) {
            alert("氏名を入力してください。");
            return;
        }

        // 注文があった商品だけをわかりやすくまとめる
        let itemDetails = "";
        if (savedName > 0) itemDetails += `メロンパン:${savedName}個(${totalA}円) `;
        if (savedMsg > 0) itemDetails += `おにぎり:${savedMsg}個(${totalB}円) `;
        if (saved1 > 0) itemDetails += `チョコブラウニー:${saved1}個(${totalC}円) `;
        if (savedD1 > 0) itemDetails += `きりっと果実:${savedD1}個(${totalD1}円) `;
        if (savedD2 > 0) itemDetails += `キリンメッツライチ:${savedD2}個(${totalD2}円) `;
        if (savedD3 > 0) itemDetails += `きりっと果実スカッシュ:${savedD3}個(${totalD3}円) `;

        if (!itemDetails) {
            alert("選択された商品はありません。");
            return;
        }

        const allTotal = totalA + totalB + totalC + totalD1 + totalD2 + totalD3;

        try {
            await addDoc(collection(db, "orders"), {
                gakunen: gakunenInput,
                className: classInput,
                name: nameInput,
                items: itemDetails,
                totalPrice: allTotal,
                createdAt: serverTimestamp()
            });

            alert("注文データを送信しました！管理者画面に反映されます。");
            document.getElementById('yourname').value = ""; // 入力欄をクリア

        } catch (error) {
            console.error("データ送信エラー:", error);
            alert("送信に失敗しました。Live Serverで開いているか確認してください。");
        }
    });
}

// 7. データクリアボタンの処理
const clearBtn = document.getElementById('clearBtn');
if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        localStorage.clear();
        location.reload();
    });
}
