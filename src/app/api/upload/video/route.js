   // app/api/upload/video/route.js
import { google } from "googleapis";
import stream from "stream";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // ✅ Needed for googleapis

const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});
const drive = google.drive({ version: "v3", auth });

export async function POST(req) {
  try {
    // ✅ Parse FormData directly
    const formData = await req.formData();
    const file = formData.get("video");

    if (!file) {
      return NextResponse.json({ error: "No video uploaded" }, { status: 400 });
    }

    // Convert file (Blob) to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Stream to Google Drive
    const bufferStream = new stream.PassThrough();
    bufferStream.end(buffer);

    const driveResp = await drive.files.create({
      requestBody: {
        name: Date.now() + "-" + file.name,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
      },
      media: { mimeType: file.type, body: bufferStream },
      fields: "id, webViewLink, webContentLink",
    });

    // Make public
    await drive.permissions.create({
      fileId: driveResp.data.id,
      requestBody: { role: "reader", type: "anyone" },
    });

    return NextResponse.json({
      videoId: driveResp.data.id,
      videoLink: driveResp.data.webViewLink,
      downloadLink: driveResp.data.webContentLink,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}