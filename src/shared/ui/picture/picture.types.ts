import type { ImageMetadata } from 'astro'

/**
 * Описание картинки и брейкпоинта, при котором она должна подставляться
 */
export interface ResponsiveSource {
  image: ImageMetadata
  breakpoint: number | string
}
