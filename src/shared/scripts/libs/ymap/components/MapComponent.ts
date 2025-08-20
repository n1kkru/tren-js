import { BREAKPOINT_DESKTOP } from '@shared/scripts/config'
import type { YMap, YMapTheme } from '@yandex/ymaps3-types'

import { type IMapConfig, type TThemes, customThemes, mapConfig } from '../config'
import { createClusterer, parseCoords } from './MapClusterer'
import { PopupMarkerComponent } from './MarkerBalloonComponent'

class MapComponent {
  private map: YMap
  private config: IMapConfig
  private clusterer: any
  private markerRefs: Record<string, ymaps3.YMapMarker> = {}
  private activeMarkerId: string | null = null

  constructor(mapElement: HTMLElement) {
    this.config = JSON.parse(JSON.stringify(mapConfig))
    this.overrideConfigFromDataAttributes(mapElement)
    this.initMap(mapElement)
  }

  private overrideConfigFromDataAttributes(mapElement: HTMLElement): void {
    const centerData = mapElement.dataset?.mapCenter,
      center = centerData?.split(',').map(Number) ?? [],
      zoom: number = +mapElement.dataset?.mapZoom,
      theme: string = mapElement.dataset?.mapTheme

    if (
      Array.isArray(center) &&
      center.length === 2 &&
      Number.isFinite(center[0]) &&
      Number.isFinite(center[1])
    ) {
      this.config.location.center = [center[0], center[1]]
    } else {
      console.warn('Некорректный center:', center)
    }

    if (zoom > 0) this.config.location.zoom = zoom

    if (theme) this.config.theme = theme as TThemes
  }

  private addThemeLayer(): void {
    const theme = this.config.theme ?? 'light'
    if (theme in customThemes) {
      this.map.addChild(
        new ymaps3.YMapDefaultSchemeLayer({
          visible: true,
          customization: customThemes[theme]
        })
      )
    } else {
      this.map.addChild(
        new ymaps3.YMapDefaultSchemeLayer({
          visible: true,
          theme: theme as YMapTheme
        })
      )
    }

    this.map.addChild(new ymaps3.YMapDefaultFeaturesLayer({ visible: true }))
  }

  private addMarkers = (mapElement: HTMLElement): void => {
    const markersDataSelector = mapElement.dataset?.mapMarkers
    const markersDataEl = document.querySelector(
      `input[name=${markersDataSelector}]`
    ) as HTMLInputElement

    if (!markersDataEl) return

    let markersData: any[] = []

    try {
      markersData = JSON.parse(markersDataEl.value)
      if (!Array.isArray(markersData)) {
        throw new Error('Not array')
      }
    } catch (err) {
      console.warn('[Map] Invalid markers data', err)
      return
    }

    // this.markersComponent = new PopupMarkerComponent(this.map, markersData)
    this.clusterer = createClusterer(this.map, markersData, {
      onMarkerCreated: (id, markerInstance) => {
        this.markerRefs[id] = markerInstance
      },
      onMarkerClick: data => {
        this.focusOnMarker(data)
      },
      resetActiveMarkers: () => this.resetActiveMarkers()
    })
  }

  private initControllers(mapElement: HTMLElement): void {
    const mapID = mapElement.dataset.map,
      decreaseZoom = document.querySelector(`[data-map-decrease=${mapID}]`),
      increaseZoom = document.querySelector(`[data-map-increase=${mapID}]`)

    if (!decreaseZoom || !increaseZoom) return

    decreaseZoom.addEventListener('click', () => {
      this.map.update({ location: { zoom: this.map.zoom - 1, duration: 300 } })
    })

    increaseZoom.addEventListener('click', () => {
      this.map.update({ location: { zoom: this.map.zoom + 1, duration: 300 } })
    })
  }

  private initMap(mapElement: HTMLElement): void {
    if (
      window.matchMedia(`(min-width: ${BREAKPOINT_DESKTOP}px)`).matches &&
      mapElement.id.includes('-mobile')
    ) {
      return
    } else if (
      window.matchMedia(`(max-width: ${BREAKPOINT_DESKTOP - 1}px)`).matches &&
      !mapElement.id.includes('-mobile')
    ) {
      const mobileElementId = mapElement.id + '-mobile'
      const mobileElementExists = document.getElementById(mobileElementId) !== null

      if (mobileElementExists) {
        return
      }
    }

    const { theme, ...restConfig } = this.config
    mapElement.innerHTML = ''
    this.map = new ymaps3.YMap(mapElement, restConfig)
    this.addThemeLayer()
    this.addMarkers(mapElement)
    this.initControllers(mapElement)
    this.bindPlacemarkListClicks(mapElement)

    console.log('>>>> Мы инициализировали карту ', mapElement.id)
  }

  public destroy(): void {
    if (!this.map) return
    this.map?.destroy?.()
    const container = this.map?.container
    if (container instanceof HTMLElement) {
      container.innerHTML = ''
    }
    const parent = container?.parentElement
    if (parent) {
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild)
      }
    }
    if (this.clusterer && this.map.children.includes(this.clusterer)) {
      this.map.removeChild(this.clusterer)
      this.clusterer = null
    }
  }

  public getMap(): YMap {
    return this.map
  }

  // Сброс активных маркеров
  public resetActiveMarkers() {
    Object.values(this.markerRefs).forEach(marker => {
      marker.element?.classList.remove('map__marker--active')
    })
    this.activeMarkerId = null
  }

  public async focusOnMarker(data: { id: string; coords: any }) {
    // 1. Центруем и зумим карту к маркеру
    console.log('data', data.coords)

    this.map.update({
      location: {
        center: parseCoords(data.coords) as any,
        zoom: Math.max(this.map.zoom, 13), // или любой зум, при котором кластеры распадаются
        duration: 300
      }
    })

    // 2. Ждём пару рендер-циклов, пока кластерер пересчитает маркеры
    setTimeout(() => {
      // 3. Теперь ищем маркер среди markerRefs (он должен уже быть создан!)
      const marker = this.markerRefs[data.id]
      if (marker) {
        // Сбрасываем выделение со всех
        Object.values(this.markerRefs).forEach(m =>
          m.element?.classList.remove('map__marker--active')
        )
        marker.element?.classList.add('map__marker--active')
      }
    }, 350)
  }

  private bindPlacemarkListClicks(mapElement: HTMLElement): void {
    const mapID = mapElement.dataset.map
    if (!mapID) return

    const buttons = document.querySelectorAll<HTMLButtonElement>('[data-id-button]')
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id-button')
        const coords = btn.closest('li')?.getAttribute('data-coords')
        if (!id || !coords) return
        this.focusOnMarker({ id, coords })
      })
    })
  }
}

export { MapComponent }
