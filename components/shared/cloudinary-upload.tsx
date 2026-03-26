'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CloudinaryUploadProps {
  folder: string
  onUpload: (urls: string[]) => void
  currentImage?: string
  currentImages?: string[]
  multiple?: boolean
  maxSizeMB?: number
  accept?: string[]
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export function CloudinaryUpload({
  folder,
  onUpload,
  currentImage,
  currentImages = [],
  multiple = false,
  maxSizeMB = 5,
  accept = ALLOWED_TYPES,
}: CloudinaryUploadProps) {
  const [images, setImages] = useState<string[]>(
    currentImages.length > 0 ? currentImages : currentImage ? [currentImage] : []
  )
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const maxSizeBytes = maxSizeMB * 1024 * 1024

  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    if (!accept.includes(file.type)) {
      setError(`Type non supporte. Utilisez JPG, PNG ou WebP.`)
      return null
    }
    if (file.size > maxSizeBytes) {
      setError(`Fichier trop volumineux (max ${maxSizeMB} Mo).`)
      return null
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET || '')
    formData.append('folder', folder)

    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`)

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100))
        }
      }

      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText)
          resolve(data.secure_url)
        } else {
          setError('Echec de l\'upload. Reessayez.')
          resolve(null)
        }
      }

      xhr.onerror = () => {
        setError('Erreur reseau. Verifiez votre connexion.')
        resolve(null)
      }

      xhr.send(formData)
    })
  }, [accept, folder, maxSizeBytes, maxSizeMB])

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setError(null)
    setUploading(true)
    setProgress(0)

    const filesToUpload = multiple ? Array.from(files) : [files[0]]
    const newUrls: string[] = []

    for (const file of filesToUpload) {
      const url = await uploadFile(file)
      if (url) newUrls.push(url)
    }

    if (newUrls.length > 0) {
      const updated = multiple ? [...images, ...newUrls] : newUrls
      setImages(updated)
      onUpload(updated)
    }

    setUploading(false)
    setProgress(0)
  }, [images, multiple, onUpload, uploadFile])

  function removeImage(index: number) {
    const updated = images.filter((_, i) => i !== index)
    setImages(updated)
    onUpload(updated)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        disabled={uploading}
        className={cn(
          'flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-sm transition-colors',
          dragOver
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50',
          uploading && 'pointer-events-none opacity-60'
        )}
      >
        {uploading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-muted-foreground">Upload en cours... {progress}%</span>
            <div className="h-1.5 w-48 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        ) : (
          <>
            <Upload className="h-8 w-8 text-muted-foreground" />
            <span className="text-muted-foreground">
              Glisser ou cliquer pour ajouter {multiple ? 'des images' : 'une image'}
            </span>
            <span className="text-xs text-muted-foreground/70">
              JPG, PNG ou WebP — max {maxSizeMB} Mo
            </span>
          </>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={accept.join(',')}
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {/* Previews */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((url, i) => (
            <div key={url} className="group relative">
              <Image
                src={url}
                alt={`Upload ${i + 1}`}
                width={96}
                height={96}
                className="h-24 w-24 rounded-lg border object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
