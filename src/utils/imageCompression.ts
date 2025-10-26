// Utility per la compressione delle immagini
export const compressImage = async (file: File, options: {
  maxSizeMB?: number
  maxWidthOrHeight?: number
  useWebWorker?: boolean
  fileType?: string
} = {}): Promise<File> => {
  const {
    maxSizeMB = 1,
    maxWidthOrHeight = 1920,
    useWebWorker = true,
    fileType = 'image/webp'
  } = options

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Calcola le nuove dimensioni mantenendo l'aspect ratio
      let { width, height } = img
      
      if (width > height) {
        if (width > maxWidthOrHeight) {
          height = (height * maxWidthOrHeight) / width
          width = maxWidthOrHeight
        }
      } else {
        if (height > maxWidthOrHeight) {
          width = (width * maxWidthOrHeight) / height
          height = maxWidthOrHeight
        }
      }

      canvas.width = width
      canvas.height = height

      // Disegna l'immagine ridimensionata
      ctx?.drawImage(img, 0, 0, width, height)

      // Converti in blob con compressione
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Errore nella compressione dell\'immagine'))
            return
          }

          // Controlla la dimensione del file
          const fileSizeMB = blob.size / (1024 * 1024)
          if (fileSizeMB > maxSizeMB) {
            // Se è ancora troppo grande, riduci ulteriormente la qualità
            const quality = Math.max(0.1, maxSizeMB / fileSizeMB)
            canvas.toBlob(
              (compressedBlob) => {
                if (!compressedBlob) {
                  reject(new Error('Errore nella compressione dell\'immagine'))
                  return
                }
                resolve(new File([compressedBlob], file.name, { type: fileType }))
              },
              fileType,
              quality
            )
          } else {
            resolve(new File([blob], file.name, { type: fileType }))
          }
        },
        fileType,
        0.8
      )
    }

    img.onerror = () => reject(new Error('Errore nel caricamento dell\'immagine'))
    img.src = URL.createObjectURL(file)
  })
}

// Utility per generare thumbnail
export const generateThumbnail = async (file: File, size: number = 150): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = size
      canvas.height = size

      // Disegna l'immagine centrata e ridimensionata
      ctx?.drawImage(img, 0, 0, size, size)

      resolve(canvas.toDataURL('image/jpeg', 0.8))
    }

    img.onerror = () => reject(new Error('Errore nel caricamento dell\'immagine'))
    img.src = URL.createObjectURL(file)
  })
}

// Utility per pre-caricare le immagini
export const preloadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Errore nel caricamento dell'immagine: ${src}`))
    img.src = src
  })
}

// Utility per il lazy loading delle immagini
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
) => {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  }

  return new IntersectionObserver(callback, defaultOptions)
}

// Utility per ottimizzare le immagini per il web
export const optimizeImageForWeb = async (file: File): Promise<{
  original: File
  thumbnail: string
  medium: string
  full: string
}> => {
  try {
    // Genera thumbnail (150x150)
    const thumbnail = await generateThumbnail(file, 150)
    
    // Genera versione media (800x800)
    const mediumFile = await compressImage(file, {
      maxWidthOrHeight: 800,
      maxSizeMB: 0.5,
      fileType: 'image/webp'
    })
    const medium = URL.createObjectURL(mediumFile)
    
    // Genera versione full (1920px max)
    const fullFile = await compressImage(file, {
      maxWidthOrHeight: 1920,
      maxSizeMB: 1,
      fileType: 'image/webp'
    })
    const full = URL.createObjectURL(fullFile)

    return {
      original: file,
      thumbnail,
      medium,
      full
    }
  } catch (error) {
    console.error('Errore nell\'ottimizzazione dell\'immagine:', error)
    throw error
  }
}
