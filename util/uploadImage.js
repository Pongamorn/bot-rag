import { Storage } from "@google-cloud/storage";

const storage = new Storage();
const bucket = storage.bucket(process.env.BUCKET_NAME);

async function uploadImage(base64Image, fileName) {
  const buffer = Buffer.from(base64Image, "base64");

  const file = bucket.file(fileName);

  await file.save(buffer, {
    metadata: {
      contentType: "image/jpeg",
    },
  });

  return `https://storage.googleapis.com/${process.env.BUCKET_NAME}/${fileName}`;
}

export { uploadImage };
