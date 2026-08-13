import {
  NextRequest,
  NextResponse,
} from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_IMAGE_SIZE =
  12 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES =
  new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
  ]);

type ReconstructionResponse = {
  success?: boolean;
  sessionId?: string;
  session_id?: string;
  status?: string;
  avatarUrl?: string | null;
  avatar_url?: string | null;
  measurements?: {
    heightCm?: number;
    shoulderCm?: number;
    chestCm?: number;
    waistCm?: number;
    hipCm?: number;
    inseamCm?: number;
    torsoCm?: number;
  } | null;
  confidence?: number | null;
  message?: string;
  error?: string;
};

function jsonError(
  message: string,
  status: number,
  extra?: Record<string, unknown>,
) {
  return NextResponse.json(
    {
      success: false,
      message,
      ...extra,
    },
    {
      status,
    },
  );
}

function isImageFile(
  value: FormDataEntryValue | null,
): value is File {
  return (
    value instanceof File &&
    ALLOWED_IMAGE_TYPES.has(
      value.type,
    )
  );
}

function validateImage(
  file: File,
  label: string,
) {
  if (
    !ALLOWED_IMAGE_TYPES.has(
      file.type,
    )
  ) {
    return `${label} must be JPG, PNG or WEBP.`;
  }

  if (
    file.size <= 0
  ) {
    return `${label} is empty.`;
  }

  if (
    file.size >
    MAX_IMAGE_SIZE
  ) {
    return `${label} must be smaller than 12 MB.`;
  }

  return null;
}

function normalizeHeight(
  value:
    | FormDataEntryValue
    | null,
) {
  if (
    typeof value !==
    "string"
  ) {
    return null;
  }

  const height =
    Number(value);

  if (
    !Number.isFinite(
      height,
    )
  ) {
    return null;
  }

  if (
    height < 120 ||
    height > 220
  ) {
    return null;
  }

  return Math.round(
    height * 10,
  ) / 10;
}

function normalizeResponse(
  payload:
    ReconstructionResponse,
) {
  const sessionId =
    payload.sessionId ||
    payload.session_id ||
    null;

  const avatarUrl =
    payload.avatarUrl ||
    payload.avatar_url ||
    null;

  const status =
    payload.status ||
    (
      avatarUrl
        ? "completed"
        : "processing"
    );

  return {
    success:
      payload.success !==
      false,
    sessionId,
    status,
    avatarUrl,
    measurements:
      payload.measurements ||
      null,
    confidence:
      payload.confidence ??
      null,
    message:
      payload.message ||
      null,
  };
}

export async function POST(
  request: NextRequest,
) {
  try {
    const reconstructionUrl =
      process.env
        .DIGITAL_TWIN_RECONSTRUCTION_URL;

    const reconstructionApiKey =
      process.env
        .DIGITAL_TWIN_RECONSTRUCTION_API_KEY;

    if (
      !reconstructionUrl
    ) {
      return jsonError(
        "Digital Twin reconstruction service is not configured yet.",
        503,
        {
          code:
            "DIGITAL_TWIN_BACKEND_NOT_CONFIGURED",
        },
      );
    }

    let incomingForm:
      FormData;

    try {
      incomingForm =
        await request.formData();
    } catch {
      return jsonError(
        "Invalid multipart form data.",
        400,
      );
    }

    const frontPhoto =
      incomingForm.get(
        "frontPhoto",
      );

    const sidePhoto =
      incomingForm.get(
        "sidePhoto",
      );

    const heightCm =
      normalizeHeight(
        incomingForm.get(
          "heightCm",
        ),
      );

    if (
      !isImageFile(
        frontPhoto,
      )
    ) {
      return jsonError(
        "A valid front full-body photo is required.",
        400,
      );
    }

    if (
      !isImageFile(
        sidePhoto,
      )
    ) {
      return jsonError(
        "A valid side full-body photo is required.",
        400,
      );
    }

    if (
      heightCm === null
    ) {
      return jsonError(
        "Height must be between 120 cm and 220 cm.",
        400,
      );
    }

    const frontPhotoError =
      validateImage(
        frontPhoto,
        "Front photo",
      );

    if (
      frontPhotoError
    ) {
      return jsonError(
        frontPhotoError,
        400,
      );
    }

    const sidePhotoError =
      validateImage(
        sidePhoto,
        "Side photo",
      );

    if (
      sidePhotoError
    ) {
      return jsonError(
        sidePhotoError,
        400,
      );
    }

    const outgoingForm =
      new FormData();

    outgoingForm.append(
      "frontPhoto",
      frontPhoto,
      frontPhoto.name ||
        "front-photo.jpg",
    );

    outgoingForm.append(
      "sidePhoto",
      sidePhoto,
      sidePhoto.name ||
        "side-photo.jpg",
    );

    outgoingForm.append(
      "heightCm",
      String(heightCm),
    );

    /*
      Optional fields can be added later
      without changing the frontend API
      contract.

      Example:
      outgoingForm.append(
        "customerId",
        customerId,
      );
    */

    const headers =
      new Headers();

    headers.set(
      "Accept",
      "application/json",
    );

    if (
      reconstructionApiKey
    ) {
      headers.set(
        "Authorization",
        `Bearer ${reconstructionApiKey}`,
      );
    }

    const upstreamResponse =
      await fetch(
        reconstructionUrl,
        {
          method: "POST",
          headers,
          body:
            outgoingForm,
          cache:
            "no-store",
        },
      );

    let upstreamPayload:
      ReconstructionResponse;

    try {
      upstreamPayload =
        (await upstreamResponse.json()) as ReconstructionResponse;
    } catch {
      return jsonError(
        "Digital Twin backend returned an invalid response.",
        502,
        {
          code:
            "INVALID_RECONSTRUCTION_RESPONSE",
        },
      );
    }

    if (
      !upstreamResponse.ok
    ) {
      return jsonError(
        upstreamPayload.message ||
          upstreamPayload.error ||
          "Digital Twin reconstruction failed.",
        upstreamResponse.status >=
          400 &&
        upstreamResponse.status <
          600
          ? upstreamResponse.status
          : 502,
        {
          code:
            "RECONSTRUCTION_FAILED",
        },
      );
    }

    const normalized =
      normalizeResponse(
        upstreamPayload,
      );

    if (
      !normalized.sessionId
    ) {
      return jsonError(
        "Digital Twin backend did not return a session ID.",
        502,
        {
          code:
            "MISSING_SESSION_ID",
        },
      );
    }

    return NextResponse.json(
      normalized,
      {
        status:
          normalized.status ===
          "completed"
            ? 200
            : 202,
      },
    );
  } catch (error) {
    console.error(
      "DIGITAL_TWIN_CREATE_ERROR",
      error,
    );

    return jsonError(
      "Something went wrong while starting the Digital Twin process.",
      500,
      {
        code:
          "DIGITAL_TWIN_CREATE_ERROR",
      },
    );
  }
}
