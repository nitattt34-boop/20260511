let video;
let faceMesh;
let faces = [];
let earringImg; // 宣告耳環圖片變數

function preload() {
  // 載入 ml5.js v1 的 FaceMesh 模型
  faceMesh = ml5.faceMesh();
  // 載入耳環圖片 (請確保檔案路徑與名稱正確)
  earringImg = loadImage('pic/acc1_ring.png');
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  
  video.hide(); // 隱藏原本自動生成的 HTML video 元素
  
  // 啟動人臉辨識，並將結果傳給 gotFaces 函式
  faceMesh.detectStart(video, gotFaces);
}

function gotFaces(results) {
  faces = results;
}

function draw() {
  // 確保攝影機畫面繪製基準為左上角
  imageMode(CORNER);
  // 繪製攝影機畫面
  image(video, 0, 0, width, height);
  
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

    // 繪製左耳環圖片 (Y座標 +20 讓它稍微往下偏移，掛在耳垂下；長寬暫設為 40x40，可依需求調整)
    image(earringImg, leftEarlobe.x, leftEarlobe.y + 20, 40, 40);

    // 繪製右耳環圖片
    image(earringImg, rightEarlobe.x, rightEarlobe.y + 20, 40, 40);
  }
}
