export interface UploadOptions {
  folder: string
  publicId?: string
  maxWidth?: number
  maxHeight?: number
}

export interface UploadResult {
  publicId: string
  url: string
  width: number
  height: number
}

export interface ImageTransforms {
  width?: number
  height?: number
  crop?: 'fill' | 'fit' | 'thumb'
  quality?: number
}

export interface StorageProvider {
  upload(file: File | Buffer, options: UploadOptions): Promise<UploadResult>
  delete(publicId: string): Promise<void>
  getUrl(publicId: string, transforms?: ImageTransforms): string
}
