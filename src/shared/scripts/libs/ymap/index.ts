import type { YMap } from '@yandex/ymaps3-types'

import { MapComponent } from './components/MapComponent'

const readyMaps: Record<string, MapComponent> = {}
const mapIDs = new Set<string>()

const getMap = (mapID: string): YMap => readyMaps[mapID]?.getMap()

declare global {
  interface Window {
    ymaps3?: any
  }
}

const destroyMaps = (): void => {
  Object.entries(readyMaps).forEach(([mapID, instance]) => {
    instance.destroy?.()
    delete readyMaps[mapID]
    mapIDs.delete(mapID)
  })

  // Удаление глобальной переменной ymaps3
  if (typeof ymaps3 !== 'undefined') window.ymaps3 = undefined

  // Удаление скрипта Yandex Maps из DOM
  const script = document.querySelector('script[src*="ymaps3"]')
  if (script) script.remove()
}

const initMaps = async (): Promise<void> => {
  console.log('initMaps')

  const maps: NodeListOf<HTMLElement> = document.querySelectorAll('[data-map]')
  if (!maps.length) return

  // Проверяем, загрузился ли YMaps
  if (typeof ymaps3 === 'undefined') {
    console.error('ymaps3 не загружен.')
    return
  }

  try {
    await ymaps3.ready
  } catch (error) {
    console.error('Ошибка при загрузке ymaps3:', error)
    return
  }

  maps.forEach((mapElement: HTMLElement) => {
    const mapID = mapElement.dataset.map as string

    if (readyMaps[mapID]) {
      readyMaps[mapID].destroy()
      delete readyMaps[mapID]
    }

    const mapComponent = new MapComponent(mapElement)
    readyMaps[mapID] = mapComponent
  })
}

export { initMaps, destroyMaps, getMap }
