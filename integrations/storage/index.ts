import type { StorageProvider } from './types'
import { CloudinaryStorageProvider } from './cloudinary'

export function getStorageProvider(): StorageProvider {
  return new CloudinaryStorageProvider()
}

export type { StorageProvider, UploadOptions, UploadResult, ImageTransforms } from './types'
