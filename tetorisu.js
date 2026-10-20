const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const startBtn = document.getElementById("start-btn");

context.scale(20, 20);

// ========== パーティクルシステム ==========
class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3 - 0.1;
    this.life = 1;
    this.decay = 0.02;
    this.size = Math.random() * 0.3 + 0.1;
    this.color = color;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.01;
    this.life -= this.decay;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 0.3;
    ctx.shadowColor = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
    ctx.restore();
  }
}

const particles = [];
let clearingRows = [];
let clearAnimation = 0;
let screenShake = { x: 0, y: 0, intensity: 0 };
let comboText = { text: "", alpha: 0, y: 10 };

// ========== テトリミノの色 ==========
const colors = [
  null,
  "#FF0D72", "#0DC2FF", "#0DFF72", "#F538FF",
  "#FF8E0D", "#FFE138", "#3877FF",
];

// ========== 列消し ==========
function arenaSweep() {
  clearingRows = [];

  for (let y = arena.length - 1; y > 0; --y) {
    let isFullRow = true;
    for (let x = 0; x < arena[y].length; ++x) {
      if (arena[y][x] === 0) {
        isFullRow = false;
        break;
      }
    }
    if (isFullRow) {
      clearingRows.push(y);
    }
  }

  if (clearingRows.length > 0) {
    clearAnimation = 30;
    screenShake.intensity = 0.2 + clearingRows.length * 0.1;

    const comboTexts = ["SINGLE!", "DOUBLE!!", "TRIPLE!!!", "TETRIS!!!!"];
    comboText.text = comboTexts[Math.min(clearingRows.length - 1, 3)];
    comboText.alpha = 1;
    comboText.y = 10;

    clearingRows.forEach((y) => {
      for (let x = 0; x < arena[y].length; ++x) {
        const color = colors[arena[y][x]];
        const particleCount = 8 + clearingRows.length * 2;
        for (let i = 0; i < particleCount; i++) {
          particles.push(new Particle(x + 0.5, y + 0.5, color));
        }
      }
    });
  }
}

function completeClearRows() {
  let rowCount = 1;
  const sortedRows = clearingRows.sort((a, b) => b - a);
  sortedRows.forEach((y) => {
    arena.splice(y, 1);
    player.score += rowCount * 10;
    rowCount *= 2;
  });
  sortedRows.forEach(() => {
    arena.unshift(new Array(arena[0].length).fill(0));
  });
  clearingRows = [];
}

// ========== 衝突判定 ==========
function collide(arena, player) {
  const [m, o] = [player.matrix, player.pos];
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      if (m[y][x] !== 0 &&
          (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

// ========== 盤面作成 ==========
function createMatrix(w, h) {
  const matrix = [];
  while (h--) {
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}

// ========== テトリミノ定義 ==========
function createPiece(type) {
  if (type === "I") {
    return [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]];
  } else if (type === "L") {
    return [[0,2,0],[0,2,0],[0,2,2]];
  } else if (type === "J") {
    return [[0,3,0],[0,3,0],[3,3,0]];
  } else if (type === "O") {
    return [[4,4],[4,4]];
  } else if (type === "Z") {
    return [[5,5,0],[0,5,5],[0,0,0]];
  } else if (type === "S") {
    return [[0,6,6],[6,6,0],[0,0,0]];
  } else if (type === "T") {
    return [[0,7,0],[7,7,7],[0,0,0]];
  }
}

// ========== 描画 ==========
function draw() {
  context.save();

  if (screenShake.intensity > 0) {
    screenShake.x = (Math.random() - 0.5) * screenShake.intensity;
    screenShake.y = (Math.random() - 0.5) * screenShake.intensity;
    context.translate(screenShake.x, screenShake.y);
    screenShake.intensity *= 0.9;
  }

  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.lineWidth = 0.05;
  context.strokeStyle = "#333";
  for (let x = 0; x < 12; ++x) {
    context.beginPath(); context.moveTo(x, 0);
    context.lineTo(x, 20); context.stroke();
  }
  for (let y = 0; y < 20; ++y) {
    context.beginPath(); context.moveTo(0, y);
    context.lineTo(12, y); context.stroke();
  }

  drawMatrix(arena, { x: 0, y: 0 });
  drawMatrix(player.matrix, player.pos);

  if (clearAnimation > 0) {
    const flash = Math.sin(clearAnimation * 0.5) * 0.5 + 0.5;
    clearingRows.forEach((y) => {
      context.save();
      context.globalAlpha = flash;
      context.fillStyle = "#ffffff";
      context.fillRect(0, y, 12, 1);
      context.restore();
    });
  }

  particles.forEach((particle) => { particle.draw(context); });

  if (comboText.alpha > 0) {
    context.save();
    context.globalAlpha = comboText.alpha;
    context.fillStyle = "#FFD700";
    context.shadowBlur = 0.5;
    context.shadowColor = "#FFD700";
    context.font = "bold 1px Arial";
    context.textAlign = "center";
    context.fillText(comboText.text, 6, comboText.y);
    context.restore();
  }

  context.restore();
}

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        const px = x + offset.x;
        const py = y + offset.y;
        context.save();
        context.shadowBlur = 0.5;
        context.shadowColor = colors[value];
        context.fillStyle = colors[value];
        context.fillRect(px, py, 1, 1);
        context.restore();
        context.lineWidth = 0.05;
        context.strokeStyle = "rgba(255, 255, 255, 0.5)";
        context.strokeRect(px, py, 1, 1);
        context.fillStyle = "rgba(255, 255, 255, 0.3)";
        context.fillRect(px + 0.1, py + 0.1, 0.3, 0.3);
      }
    });
  });
}

// ========== ゲーム操作 ==========
function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
        const color = colors[value];
        for (let i = 0; i < 3; i++) {
          particles.push(
            new Particle(x + player.pos.x + 0.5,
                        y + player.pos.y + 0.5, color)
          );
        }
      }
    });
  });
  screenShake.intensity = 0.05;
}

function playerDrop() {
  player.pos.y++;
  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    playerReset();
    arenaSweep();
    updateScore();
  }
  dropCounter = 0;
}

function playerHardDrop() {
  while (!collide(arena, player)) { player.pos.y++; }
  player.pos.y--;
  merge(arena, player);
  playerReset();
  arenaSweep();
  updateScore();
  dropCounter = 0;
}

function playerMove(dir) {
  player.pos.x += dir;
  if (collide(arena, player)) { player.pos.x -= dir; }
}

function playerReset() {
    const pieces = "ILJOTSZ";
    const randomType = pieces[(pieces.length * Math.random()) | 0];
    
    player.type = randomType; // 現在のミノの種類を保存（ホールドで使用するため）
    player.matrix = createPiece(randomType);
    player.pos.y = 0;
    player.pos.x = ((arena[0].length / 2) | 0) - ((player.matrix[0].length / 2) | 0);
    
    hasHeld = false; // 新しいミノになったので、ホールドを再度使用可能にする

    if (collide(arena, player)) {
        gameOver = true;
        startBtn.innerText = "GAME OVER - RESTART";
        startBtn.style.display = "block";
    }
}

function playerRotate(dir) {
  const pos = player.pos.x;
  let offset = 1;
  rotate(player.matrix, dir);
  while (collide(arena, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.matrix[0].length) {
      rotate(player.matrix, -dir);
      player.pos.x = pos;
      return;
    }
  }
}

function rotate(matrix, dir) {
  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < y; ++x) {
      [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
    }
  }
  if (dir > 0) { matrix.forEach(row => row.reverse()); }
  else { matrix.reverse(); }
}

function playerHold() {
    if (hasHeld) return; // 1つのミノにつきホールドは1回まで

    const pieces = "ILJOTSZ";
    // 現在のプレイヤーのミノがどの種類(文字)かを判定
    let currentType = null;
    for (let type of pieces) {
        // createPieceで作ったマトリックスと現在のプレイヤーのマトリックスの形状が一致するか簡易チェック
        // (簡易的に、最初に見つかった文字、またはplayerReset時にtypeを保持させておくとより確実です)
    }
    
    // ※より確実に動作させるため、playerReset() を少し修正して player.type を保持させるのがスマートです。
    // 以下は player.type を保持している前提の実装です（後述のplayerReset修正を適用してください）
    
    const nextHold = player.type; 

    if (holdPiece === null) {
        // 初めてのホールド: 現在のミノをホールドに送り、新しいミノを生成
        holdPiece = nextHold;
        playerReset(); 
    } else {
        // 2回目以降: ホールド内のミノと現在のミノを入れ替える
        const temp = holdPiece;
        holdPiece = nextHold;
        
        player.type = temp;
        player.matrix = createPiece(temp);
        player.pos.y = 0;
        player.pos.x = ((arena[0].length / 2) | 0) - ((player.matrix[0].length / 2) | 0);
        
        if (collide(arena, player)) {
            gameOver = true;
            startBtn.innerText = "GAME OVER - RESTART";
            startBtn.style.display = "block";
        }
    }

    hasHeld = true; // このミノでのホールドをロック
    console.log("現在のホールド:", holdPiece); // デバッグ用（必要に応じて画面に描画してください）
}


// ========== ゲームループ ==========
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

function update(time = 0) {
  if (gameOver) return;

  const deltaTime = time - lastTime;
  lastTime = time;

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    if (particles[i].life <= 0) { particles.splice(i, 1); }
  }

  if (comboText.alpha > 0) {
    comboText.alpha -= 0.015;
    comboText.y -= 0.05;
  }

  if (clearAnimation > 0) {
    clearAnimation--;
    if (clearAnimation === 0) {
      completeClearRows();
      updateScore();
    }
  } else {
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) { playerDrop(); }
  }

  draw();
  requestAnimationFrame(update);
}

function updateScore() {
  scoreElement.innerText = player.score;
}

// ========== 初期化 ==========
const arena = createMatrix(12, 20);
const player = { pos: { x: 0, y: 0 }, matrix: null, score: 0 };
let gameOver = true;

let holdPiece = null; // ホールドしているミノの種類 (例: "I", "T")
let hasHeld = false;  // 現在のミノで既にホールドを使用したかどうかのフラグ

document.addEventListener("keydown", (event) => {
    if (gameOver) return;
    switch (event.code) {
        case "KeyA": // Aで左移動
            playerMove(-1);
            break;
        case "KeyD": // Dで右移動
            playerMove(1);
            break;
        case "KeyS": // Sでソフトドロップ
            playerDrop();
            break;
        case "Space": // スペースで時計回りに回転
            playerRotate(1);
            break;
        case "KeyW": // Wでハードドロップ
            event.preventDefault();
            playerHardDrop();
            break;
        case "KeyQ": // 【追加】Cキーでホールド
   
            event.preventDefault();
            playerHold();
            break;
    }
});


startBtn.addEventListener("click", () => {
    arena.forEach(row => row.fill(0));
    player.score = 0;
    holdPiece = null; // ホールドをクリア
    hasHeld = false;  // フラグをリセット
    updateScore();
    gameOver = false;
    playerReset();
    startBtn.style.display = "none";
    update();
});

draw();