let video;
let faceMesh;
let handPose;
let faces = [];
let hands = [];
let earrings = []; // 宣告耳環圖片陣列
let currentEarringIndex = 0; // 當前顯示的耳環索引 (0~4)

function preload() {
  // 載入 ml5.js v1 的 FaceMesh 與 HandPose 模型
  faceMesh = ml5.faceMesh();
  handPose = ml5.handPose();
  
  // 載入 5 款耳環圖片 (請確保檔案路徑與名稱正確)
  earrings[0] = loadImage('pic/acc1_ring.png');
  earrings[1] = loadImage('pic/acc2_pearl.png');
  earrings[2] = loadImage('pic/acc3_tassel.png');
  earrings[3] = loadImage('pic/acc4_jade.png');
  earrings[4] = loadImage('pic/acc5_phoenix.png');
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  
  video.hide(); // 隱藏原本自動生成的 HTML video 元素
  
  // 啟動人臉與手勢辨識
  faceMesh.detectStart(video, gotFaces);
  handPose.detectStart(video, gotHands);
}

function gotFaces(results) {
  faces = results;
}

function gotHands(results) {
  hands = results;
}

function draw() {
  // 確保攝影機畫面繪製基準為左上角
  imageMode(CORNER);
  // 繪製攝影機畫面
  image(video, 0, 0, width, height);
  
  // --- 手勢辨識與切換耳環邏輯 ---
  if (hands.length > 0) {
    let hand = hands[0]; // 只取偵測到的第一隻手
    let count = 0;
    
    // 分別為：大拇指(4), 食指(8), 中指(12), 無名指(16), 小指(20) 的指尖與根部關節索引
    let tips = [4, 8, 12, 16, 20];
    let bases = [2, 6, 10, 14, 18]; 
    
    // 如果指尖的 Y 座標小於根部關節的 Y 座標 (在畫面上方)，視為手指伸出
    for (let j = 0; j < 5; j++) {
      if (hand.keypoints[tips[j]].y < hand.keypoints[bases[j]].y) {
        count++;
      }
    }
    
    // 當判斷出 1~5 根手指時，切換對應的耳環 (陣列索引 0~4)
    if (count >= 1 && count <= 5) {
      currentEarringIndex = count - 1;
    }
  }
  
  // --- 人臉辨識與繪製耳環邏輯 ---
  // 迴圈處理每一個辨識到的人臉
  for (let i = 0; i < faces.length; i++) {
    const face = faces[i];
    
    // MediaPipe Facemesh 中：
    // 177 為左臉最下緣外側，401 為右臉最下緣外側，這兩個點最接近耳垂位置
    // 注意：ml5 v1 的節點結構改為 {x, y, z}，需用 .x 與 .y 取得座標
    const leftEarlobe = face.keypoints[177];
    const rightEarlobe = face.keypoints[401];
    
    // 將圖片基準點設為中心 (CENTER)
    imageMode(CENTER);
    
    // 取出當前對應的耳環圖片
    let currentImg = earrings[currentEarringIndex];

    // 繪製左耳環圖片 (Y座標 +20 讓它稍微往下偏移，掛在耳垂下；長寬暫設為 40x40，可依需求調整)
    image(currentImg, leftEarlobe.x, leftEarlobe.y + 20, 40, 40);

    // 繪製右耳環圖片
    image(currentImg, rightEarlobe.x, rightEarlobe.y + 20, 40, 40);
  }
}
