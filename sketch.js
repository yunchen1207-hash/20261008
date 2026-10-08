// 宣告測驗相關的全域變數
let questions = [
  {
    question: "請問在 p5.js 中，用來設定畫布大小的指令是哪一個？",
    options: ["createCanvas()", "windowSize()", "setSize()", "newCanvas()"],
    answer: 0 // 正確答案的索引值 (第 1 個選項)
  },
  {
    question: "請問下列哪一個指令可以用來設定圖形的「填滿顏色」？",
    options: ["stroke()", "fill()", "color()", "background()"],
    answer: 1 // 正確答案的索引值 (第 2 個選項)
  },
  {
    question: "在 p5.js 中，若要在畫布上繪製一個長方形，應使用哪個指令？",
    options: ["circle()", "ellipse()", "rect()", "line()"],
    answer: 2 // 正確答案的索引值 (第 3 個選項)
  },
  {
    question: "請問下列何者是用來清除畫布背景顏色的指令？",
    options: ["clearBg()", "bg()", "canvasColor()", "background()"],
    answer: 3 // 正確答案的索引值 (第 4 個選項)
  },
  {
    question: "p5.js 的程式中，哪一個函式只會被執行「一次」（通常用於初始化設定）？",
    options: ["setup()", "draw()", "preload()", "init()"],
    answer: 0 // 正確答案的索引值 (第 1 個選項)
  }
];

let currentQuestion = 0;     // 目前作答到第幾題 (從 0 開始)
let score = 0;               // 記錄答對的題數
let selectedOption = null;   // 使用者目前點選的選項索引
let isAnswered = false;      // 記錄當前題目是否已經作答
let nextButton;              // 「下一題」按鈕物件
let animTimer = 0;           // 用於控制動畫跳動或晃動的計時器

function setup() {
  // 建立全螢幕畫布，支援各種裝置螢幕
  createCanvas(windowWidth, windowHeight);
  
  // 建立「下一題」按鈕
  nextButton = createButton('下一題');
  nextButton.style('font-family', 'sans-serif');
  nextButton.style('background-color', '#4ea8de');
  nextButton.style('color', 'white');
  nextButton.style('border', 'none');
  nextButton.style('border-radius', '8px');
  nextButton.style('cursor', 'pointer');
  nextButton.hide(); // 一開始先隱藏
  nextButton.mousePressed(nextQuestion); // 設定按鈕點擊事件
  
  // 初始化調整介面尺寸
  updateUILayout();
}

function draw() {
  // 設定背景顏色 (深藍灰色)
  background(30, 41, 59);
  
  // 更新動畫計時器
  animTimer += 0.1;

  // 判斷測驗是否已經結束
  if (currentQuestion >= questions.length) {
    displayResult(); // 顯示最終成績
    return;
  }

  // 取得當前裝置的動態排版尺寸（確保手機橫向直向、平板電腦皆能完美適應）
  let layout = getLayoutDimensions();

  // 繪製標題與進度
  fill(255);
  textSize(layout.titleSize);
  textAlign(CENTER, TOP);
  text("p5.js 簡易指令隨堂測驗", width / 2, layout.titleY);
  
  textSize(layout.subSize);
  fill(148, 163, 184);
  text(`題目 ${currentQuestion + 1} / ${questions.length}`, width / 2, layout.subY);

  // 繪製目前題目文字（支援自動換行，適應窄螢幕手機）
  let q = questions[currentQuestion];
  fill(255);
  textSize(layout.questionSize);
  textAlign(CENTER, CENTER);
  textWidthLimit(q.question, width / 2, layout.questionY, layout.boxWidth);

  // 繪製四個選項按鈕區域
  for (let i = 0; i < q.options.length; i++) {
    let boxX = width / 2 - layout.boxWidth / 2;
    let boxY = layout.startY + i * (layout.boxHeight + layout.spacing);

    // 預設選項背景顏色 (深色卡片風格)
    let fillColor = color(51, 65, 85);
    let textColor = color(255);
    let offsetX = 0; // 左右晃動偏移量
    let offsetY = 0; // 上下跳動偏移量

    // 如果已經作答，根據對錯套用指定特效與顏色
    if (isAnswered) {
      if (i === q.answer) {
        // 正確答案顯示黃色背景 (#fdffb6)
        fillColor = color(253, 255, 182);
        textColor = color(0);
        // 上下跳動特效
        offsetY = sin(animTimer * 5) * 6; 
      } else if (i === selectedOption) {
        // 使用者點選的錯誤答案顯示紅色背景 (#ff4d6d)
        fillColor = color(255, 77, 109);
        textColor = color(255);
        // 左右移動（晃動）特效
        offsetX = sin(animTimer * 20) * 8;
      }
    }

    // 繪製選項外框與背景
    push();
    translate(boxX + offsetX, boxY + offsetY);
    
    fill(fillColor);
    stroke(100, 116, 139);
    strokeWeight(2);
    rect(0, 0, layout.boxWidth, layout.boxHeight, 10); // 圓角矩形

    // 繪製選項文字
    noStroke();
    fill(textColor);
    textSize(layout.optionTextSize);
    textAlign(LEFT, CENTER);
    text(`${i + 1}. ${q.options[i]}`, 20, layout.boxHeight / 2);
    pop();
  }
}

// 根據目前畫布寬高，動態計算適合各裝置（手機直向、橫向、平板、電腦）的排版參數
function getLayoutDimensions() {
  let isMobilePortrait = width < 600 && height > width; // 手機直向判斷
  
  let boxWidth = min(680, width - 40); // 寬螢幕最大 680px，窄螢幕自動縮減左右留白
  let boxHeight = isMobilePortrait ? 48 : 56; // 手機直向稍微降低高度以防超出畫面
  let spacing = isMobilePortrait ? 12 : 16;   // 選項間距
  
  let titleY = height * 0.05;
  let subY = height * 0.12;
  let questionY = height * 0.22;
  let startY = height * 0.32;
  
  let titleSize = constrain(width * 0.045, 18, 28);
  let subSize = constrain(width * 0.03, 14, 18);
  let questionSize = constrain(width * 0.038, 16, 22);
  let optionTextSize = constrain(width * 0.032, 14, 18);

  return {
    boxWidth,
    boxHeight,
    spacing,
    titleY,
    subY,
    questionY,
    startY,
    titleSize,
    subSize,
    questionSize,
    optionTextSize
  };
}

// 更新按鈕與介面排版定位
function updateUILayout() {
  let layout = getLayoutDimensions();
  let btnW = min(200, width * 0.5);
  let btnH = 45;
  let btnY = layout.startY + 4 * (layout.boxHeight + layout.spacing) + 10;
  
  nextButton.size(btnW, btnH);
  nextButton.style('font-size', '16px');
  nextButton.position(width / 2 - btnW / 2, btnY);
}

// 輔助函式：讓過長的題目文字在行動裝置上也能自動換行並保持置中
function textWidthLimit(txt, x, y, maxW) {
  push();
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  // 使用 p5.js 的 textWrap 支援自動換行
  textWrap(WORD);
  text(txt, x, y, maxW);
  pop();
}

// 滑鼠或觸控點擊事件：用於判斷使用者點擊了哪一個選項
function mousePressed() {
  // 如果已經作答，或者測驗已經結束，則不重複處理點擊
  if (isAnswered || currentQuestion >= questions.length) return;

  let layout = getLayoutDimensions();
  let boxX = width / 2 - layout.boxWidth / 2;

  // 檢查點擊是否落在四個選項的範圍內
  for (let i = 0; i < 4; i++) {
    let boxY = layout.startY + i * (layout.boxHeight + layout.spacing);
    if (
      mouseX >= boxX &&
      mouseX <= boxX + layout.boxWidth &&
      mouseY >= boxY &&
      mouseY <= boxY + layout.boxHeight
    ) {
      selectedOption = i;
      isAnswered = true; // 標記為已作答

      // 檢查是否答對並累加分數
      if (selectedOption === questions[currentQuestion].answer) {
        score++;
      }

      // 顯示「下一題」按鈕並即時更新位置
      updateUILayout();
      nextButton.show();
      break;
    }
  }
}

// 進入下一題的函式
function nextQuestion() {
  currentQuestion++;      // 題目索引加一
  isAnswered = false;     // 重置作答狀態
  selectedOption = null;  // 清除選中的選項
  nextButton.hide();      // 隱藏下一題按鈕
}

// 顯示測驗結果畫面（自動適應各種螢幕大小與置中）
function displayResult() {
  nextButton.hide(); // 隱藏按鈕

  push();
  textAlign(CENTER, CENTER);
  
  // 結算標題
  fill(255);
  textSize(constrain(width * 0.06, 24, 36));
  text("測驗結束！", width / 2, height / 2 - 60);

  // 答對題數與分數
  textSize(constrain(width * 0.045, 18, 26));
  fill(78, 168, 222);
  text(`您總共答對了 ${score} 題 / 共 ${questions.length} 題`, width / 2, height / 2);

  // 鼓勵文字
  textSize(constrain(width * 0.035, 14, 20));
  fill(148, 163, 184);
  if (score === questions.length) {
    text("太棒了！你對 p5.js 已經非常熟悉囉！", width / 2, height / 2 + 55);
  } else {
    text("做得好！再練習一下會更厲害喔！", width / 2, height / 2 + 55);
  }
  pop();
}

// 當瀏覽器視窗大小改變或手機螢幕轉向時觸發，自動重新調整版面與畫布
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateUILayout();
}