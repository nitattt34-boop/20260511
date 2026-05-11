let video;
let facemesh;
let predictions = [];

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  
  // 載入 ml5.js 的 Facemesh 模型
  facemesh = ml5.facemesh(video, modelReady);
  
  // 當辨識到人臉時，將結果儲存到 predictions 陣列
  facemesh.on("predict", results => {
    predictions = results;
  });
  
  video.hide(); // 隱藏原本自動生成的 HTML video 元素
}

function modelReady() {
  console.log("Facemesh 模型載入完成！");
}

function draw() {
  // 繪製攝影機畫面
  image(video, 0, 0, width, height);
  
  // 迴圈處理每一個辨識到的人臉
  for (let i = 0; i < predictions.length; i += 1) {
    const keypoints = predictions[i].scaledMesh;
    
    // MediaPipe Facemesh 中：
    // 177 為左臉最下緣外側，401 為右臉最下緣外側，這兩個點最接近耳垂位置
    const leftEarlobe = keypoints[177];
    const rightEarlobe = keypoints[401];
    
    fill(255, 255, 0); // 設定為黃色
    noStroke();
    circle(leftEarlobe[0], leftEarlobe[1], 20); // 畫左耳垂
    circle(rightEarlobe[0], rightEarlobe[1], 20); // 畫右耳垂
  }
}
