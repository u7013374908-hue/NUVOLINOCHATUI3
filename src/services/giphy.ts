import { GifData } from '../types/sticker'

const GIPHY_API_KEY = process.env.REACT_APP_GIPHY_API_KEY || 'your-giphy-api-key'
const GIPHY_BASE_URL = 'https://api.giphy.com/v1/gifs'

export interface GiphySearchParams {
  query: string
  limit?: number
  offset?: number
  rating?: 'g' | 'pg' | 'pg-13' | 'r'
  lang?: string
}

export interface GiphyResponse {
  data: Array<{
    id: string
    title: string
    images: {
      original: {
        url: string
        width: string
        height: string
      }
      preview_gif: {
        url: string
        width: string
        height: string
      }
    }
    user?: {
      username: string
    }
  }>
  pagination: {
    total_count: number
    count: number
    offset: number
  }
}

export const searchGifs = async (params: GiphySearchParams): Promise<GifData[]> => {
  try {
    const searchParams = new URLSearchParams({
      api_key: GIPHY_API_KEY,
      q: params.query,
      limit: (params.limit || 20).toString(),
      offset: (params.offset || 0).toString(),
      rating: params.rating || 'g',
      lang: params.lang || 'en'
    })

    const response = await fetch(`${GIPHY_BASE_URL}/search?${searchParams}`)
    
    if (!response.ok) {
      throw new Error(`Giphy API error: ${response.status}`)
    }

    const data: GiphyResponse = await response.json()
    
    return data.data.map(gif => ({
      id: gif.id,
      url: gif.images.original.url,
      title: gif.title,
      width: parseInt(gif.images.original.width),
      height: parseInt(gif.images.original.height),
      preview_url: gif.images.preview_gif.url,
      source: 'giphy' as const
    }))
  } catch (error) {
    console.error('Error searching GIFs:', error)
    return []
  }
}

export const getTrendingGifs = async (limit: number = 20): Promise<GifData[]> => {
  try {
    const searchParams = new URLSearchParams({
      api_key: GIPHY_API_KEY,
      limit: limit.toString(),
      rating: 'g'
    })

    const response = await fetch(`${GIPHY_BASE_URL}/trending?${searchParams}`)
    
    if (!response.ok) {
      throw new Error(`Giphy API error: ${response.status}`)
    }

    const data: GiphyResponse = await response.json()
    
    return data.data.map(gif => ({
      id: gif.id,
      url: gif.images.original.url,
      title: gif.title,
      width: parseInt(gif.images.original.width),
      height: parseInt(gif.images.original.height),
      preview_url: gif.images.preview_gif.url,
      source: 'giphy' as const
    }))
  } catch (error) {
    console.error('Error fetching trending GIFs:', error)
    return []
  }
}

export const getRandomGif = async (tag?: string): Promise<GifData | null> => {
  try {
    const searchParams = new URLSearchParams({
      api_key: GIPHY_API_KEY,
      rating: 'g'
    })

    if (tag) {
      searchParams.append('tag', tag)
    }

    const response = await fetch(`${GIPHY_BASE_URL}/random?${searchParams}`)
    
    if (!response.ok) {
      throw new Error(`Giphy API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.data) {
      return {
        id: data.data.id,
        url: data.data.images.original.url,
        title: data.data.title,
        width: parseInt(data.data.images.original.width),
        height: parseInt(data.data.images.original.height),
        preview_url: data.data.images.preview_gif.url,
        source: 'giphy' as const
      }
    }

    return null
  } catch (error) {
    console.error('Error fetching random GIF:', error)
    return null
  }
}
