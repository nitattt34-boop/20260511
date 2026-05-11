let video;
let faceMesh;
let faces = [];

function preload() {
  // 載入 ml5.js v1 的 FaceMesh 模型
  faceMesh = ml5.faceMesh();
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
    
    // 繪製左耳環 (垂墜樣式)
    stroke(200); // 銀色的耳鍊
    strokeWeight(2);
    line(leftEarlobe.x, leftEarlobe.y, leftEarlobe.x, leftEarlobe.y + 30);
    fill(0, 255, 255); // 青色的寶石
    noStroke();
    circle(leftEarlobe.x, leftEarlobe.y + 30, 15);

    // 繪製右耳環 (垂墜樣式)
    stroke(200); 
    strokeWeight(2);
    line(rightEarlobe.x, rightEarlobe.y, rightEarlobe.x, rightEarlobe.y + 30);
    fill(0, 255, 255); 
    noStroke();
    circle(rightEarlobe.x, rightEarlobe.y + 30, 15);
  }
}
