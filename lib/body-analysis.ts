import {
  FilesetResolver,
  PoseLandmarker,
} from "@mediapipe/tasks-vision";

export type EstimatedMeasurements = {
  heightCm: number;
  shoulderCm: number;
  chestCm: number;
  waistCm: number;
  hipCm: number;
  inseamCm: number;
  torsoCm: number;
  confidence: number;
};

export type BodyAnalysisResult = {
  measurements: EstimatedMeasurements;
  faceTextureDataUrl: string | null;
  bodyRatios: {
    shoulder: number;
    torso: number;
    hip: number;
    leg: number;
  };
};

let poseLandmarkerPromise:
  | Promise<PoseLandmarker>
  | null = null;

async function getPoseLandmarker() {
  if (!poseLandmarkerPromise) {
    poseLandmarkerPromise = (async () => {
      const vision =
        await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm",
        );

      return PoseLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task",
            delegate: "GPU",
          },
          runningMode: "IMAGE",
          numPoses: 1,
        },
      );
    })();
  }

  return poseLandmarkerPromise;
}

function distance(
  a: { x: number; y: number },
  b: { x: number; y: number },
) {
  return Math.hypot(
    a.x - b.x,
    a.y - b.y,
  );
}

function clamp(
  value: number,
  min: number,
  max: number,
) {
  return Math.min(
    max,
    Math.max(min, value),
  );
}

function makeFaceTexture(
  image: HTMLImageElement,
  landmarks: {
    x: number;
    y: number;
  }[],
) {
  const nose = landmarks[0];
  const leftEar = landmarks[7];
  const rightEar = landmarks[8];

  if (
    !nose ||
    !leftEar ||
    !rightEar
  ) {
    return null;
  }

  const faceWidthPx =
    Math.abs(
      leftEar.x -
        rightEar.x,
    ) *
    image.naturalWidth;

  const centerX =
    nose.x *
    image.naturalWidth;

  const centerY =
    nose.y *
    image.naturalHeight;

  const cropW =
    clamp(
      faceWidthPx *
        2.15,
      120,
      image.naturalWidth,
    );

  const cropH =
    cropW *
    1.18;

  const sx =
    clamp(
      centerX -
        cropW / 2,
      0,
      image.naturalWidth -
        cropW,
    );

  const sy =
    clamp(
      centerY -
        cropH *
          0.42,
      0,
      image.naturalHeight -
        cropH,
    );

  const canvas =
    document.createElement(
      "canvas",
    );

  canvas.width = 512;
  canvas.height = 512;

  const ctx =
    canvas.getContext(
      "2d",
    );

  if (!ctx) {
    return null;
  }

  ctx.fillStyle =
    "#161412";
  ctx.fillRect(
    0,
    0,
    512,
    512,
  );

  ctx.save();

  ctx.beginPath();
  ctx.ellipse(
    256,
    250,
    215,
    245,
    0,
    0,
    Math.PI * 2,
  );
  ctx.clip();

  ctx.drawImage(
    image,
    sx,
    sy,
    cropW,
    cropH,
    0,
    0,
    512,
    512,
  );

  ctx.restore();

  return canvas.toDataURL(
    "image/jpeg",
    0.92,
  );
}

export async function analyzeBodyFromPhoto({
  image,
  heightCm,
}: {
  image: HTMLImageElement;
  heightCm: number;
}): Promise<BodyAnalysisResult> {
  const landmarker =
    await getPoseLandmarker();

  const result =
    landmarker.detect(
      image,
    );

  const landmarks =
    result.landmarks?.[0];

  if (
    !landmarks ||
    landmarks.length <
      33
  ) {
    throw new Error(
      "A complete body could not be detected. Use a clear, front-facing full-body photo.",
    );
  }

  const leftShoulder =
    landmarks[11];
  const rightShoulder =
    landmarks[12];

  const leftHip =
    landmarks[23];
  const rightHip =
    landmarks[24];

  const leftAnkle =
    landmarks[27];
  const rightAnkle =
    landmarks[28];

  const nose =
    landmarks[0];

  const shoulderWidth =
    distance(
      leftShoulder,
      rightShoulder,
    );

  const hipWidth =
    distance(
      leftHip,
      rightHip,
    );

  const shoulderMid = {
    x:
      (leftShoulder.x +
        rightShoulder.x) /
      2,
    y:
      (leftShoulder.y +
        rightShoulder.y) /
      2,
  };

  const hipMid = {
    x:
      (leftHip.x +
        rightHip.x) /
      2,
    y:
      (leftHip.y +
        rightHip.y) /
      2,
  };

  const ankleMid = {
    x:
      (leftAnkle.x +
        rightAnkle.x) /
      2,
    y:
      (leftAnkle.y +
        rightAnkle.y) /
      2,
  };

  const visibleBodyHeight =
    Math.max(
      0.25,
      distance(
        nose,
        ankleMid,
      ),
    );

  const scaleCm =
    heightCm /
    (visibleBodyHeight *
      1.08);

  const shoulderCm =
    clamp(
      shoulderWidth *
        scaleCm,
      30,
      58,
    );

  const hipLinearCm =
    clamp(
      hipWidth *
        scaleCm,
      28,
      55,
    );

  const torsoLinearCm =
    clamp(
      distance(
        shoulderMid,
        hipMid,
      ) * scaleCm,
      38,
      72,
    );

  const legLinearCm =
    clamp(
      distance(
        hipMid,
        ankleMid,
      ) * scaleCm,
      60,
      115,
    );

  /*
    Single-photo circumference estimates are approximate.
    They are deliberately conservative and should be used
    for size recommendation, not tailoring.
  */
  const chestCm =
    clamp(
      shoulderCm *
        2.02,
      74,
      132,
    );

  const waistCm =
    clamp(
      hipLinearCm *
        1.72,
      62,
      122,
    );

  const hipCm =
    clamp(
      hipLinearCm *
        2.05,
      76,
      138,
    );

  const confidence =
    Math.round(
      clamp(
        (shoulderWidth +
          hipWidth) *
          135,
        58,
        91,
      ),
    );

  return {
    measurements: {
      heightCm:
        Math.round(
          heightCm,
        ),
      shoulderCm:
        Math.round(
          shoulderCm,
        ),
      chestCm:
        Math.round(
          chestCm,
        ),
      waistCm:
        Math.round(
          waistCm,
        ),
      hipCm:
        Math.round(
          hipCm,
        ),
      inseamCm:
        Math.round(
          legLinearCm *
            0.86,
        ),
      torsoCm:
        Math.round(
          torsoLinearCm,
        ),
      confidence,
    },

    faceTextureDataUrl:
      makeFaceTexture(
        image,
        landmarks,
      ),

    bodyRatios: {
      shoulder:
        clamp(
          shoulderCm / 43,
          0.78,
          1.28,
        ),
      torso:
        clamp(
          torsoLinearCm /
            53,
          0.82,
          1.23,
        ),
      hip:
        clamp(
          hipCm / 98,
          0.78,
          1.28,
        ),
      leg:
        clamp(
          legLinearCm /
            84,
          0.8,
          1.25,
        ),
    },
  };
}
