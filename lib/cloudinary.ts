import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(
  buffer: Buffer,
  options: {
    folder: string;
    resourceType?: "image" | "raw" | "auto";
  }
): Promise<{ publicId: string; secureUrl: string }> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: options.folder,
          resource_type: options.resourceType || "auto",
          access_mode: "authenticated",
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Upload failed"));
            return;
          }
          resolve({
            publicId: result.public_id,
            secureUrl: result.secure_url,
          });
        }
      )
      .end(buffer);
  });
}

export default cloudinary;
