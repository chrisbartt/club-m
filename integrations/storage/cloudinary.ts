import { v2 as cloudinary } from 'cloudinary'
import type { StorageProvider, UploadOptions, UploadResult, ImageTransforms } from './types'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export class CloudinaryStorageProvider implements StorageProvider {
  async upload(file: File | Buffer, options: UploadOptions): Promise<UploadResult> {
    const buffer = file instanceof File ? Buffer.from(await file.arrayBuffer()) : file

    const result = await new Promise<UploadResult>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: options.folder,
            public_id: options.publicId,
            transformation: [{ width: options.maxWidth ?? 1200, height: options.maxHeight ?? 1200, crop: 'limit' }],
          },
          (error, result) => {
            if (error) return reject(error)
            if (!result) return reject(new Error('No result from Cloudinary'))
            resolve({ publicId: result.public_id, url: result.secure_url, width: result.width, height: result.height })
          }
        )
        .end(buffer)
    })

    return result
  }

  async delete(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId)
  }

  getUrl(publicId: string, transforms?: ImageTransforms): string {
    return cloudinary.url(publicId, {
      secure: true,
      transformation: transforms
        ? [{ width: transforms.width, height: transforms.height, crop: transforms.crop ?? 'fill', quality: transforms.quality ?? 'auto' }]
        : undefined,
    })
  }
}
