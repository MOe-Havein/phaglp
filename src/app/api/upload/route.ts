import { v2 as cloudinary } from "cloudinary"
import { NextResponse } from "next/server"
import { auth } from "@/auth"

// --- Constants ---
const UPLOAD_FOLDER = "phaglp/lectures"
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

// Only configure manually if CLOUDINARY_URL is NOT set (to avoid overriding with undefined)
if (!process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
}

export async function POST(request: Request) {
  // --- Authentication ---
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // --- File type validation ---
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Invalid file type "${file.type}". Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`,
        },
        { status: 415 },
      )
    }

    // --- File size validation ---
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${MAX_FILE_SIZE_BYTES / (1024 * 1024)} MB.` },
        { status: 413 },
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: UPLOAD_FOLDER,
            transformation: [
              { width: 1280, crop: "scale" }, // Resize to width 1280
            ],
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          },
        )
        .end(buffer)
    })

    return NextResponse.json(result)
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Upload failed"
    console.error("Upload error:", error)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
