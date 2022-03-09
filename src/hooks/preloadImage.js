import { useEffect, useState } from "react"

export function usePreloadImage(imageUrl) {
    const [isLoaded, setIsLoaded] = useState(false)
    useEffect(() => {
      setIsLoaded(false)
      if (imageUrl) {
        const img = new Image()
        img.src = imageUrl
        function handleImageLoad() {
          setIsLoaded(true)
        }
        img.addEventListener('load', handleImageLoad)
        return () => {
          img.removeEventListener('load', handleImageLoad)
        }
      }
    }, [imageUrl])
    return isLoaded
  }