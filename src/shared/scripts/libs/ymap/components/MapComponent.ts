import { BREAKPOINT_DESKTOP } from '@shared/scripts/config'
import type { YMap, YMapTheme } from '@yandex/ymaps3-types'

import { type IMapConfig, type TThemes, customThemes, mapConfig } from '../config'
import { createClusterer, parseCoords } from './MapClusterer'

class MapComponent {
  private map!: YMap
  private config: IMapConfig
  private clusterer: any
  private markerRefs: Record<string, ymaps3.YMapMarker> = {}
  private activeMarkerId: string | null = null

  private balloonMarker: ymaps3.YMapMarker | null = null

  private pointsById: Record<string, any> = {}

  constructor(mapElement: HTMLElement) {
    this.config = JSON.parse(JSON.stringify(mapConfig))
    this.overrideConfigFromDataAttributes(mapElement)
    this.initMap(mapElement)
  }

  private overrideConfigFromDataAttributes(mapElement: HTMLElement): void {
    const centerData = mapElement.dataset?.mapCenter
    const center = centerData?.split(',').map(Number) ?? []
    const zoom: number = +(mapElement.dataset?.mapZoom ?? 0)
    const theme: string | undefined = mapElement.dataset?.mapTheme

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
          customization: (customThemes as any)[theme]
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
      if (!Array.isArray(markersData)) throw new Error('Not array')
    } catch (err) {
      console.warn('[Map] Invalid markers data', err)
      return
    }

    this.pointsById = Object.fromEntries(markersData.map((p: any) => [String(p.id ?? ''), p]))

    this.clusterer = createClusterer(this.map, markersData, {
      onMarkerCreated: (id, markerInstance) => {
        this.markerRefs[id] = markerInstance
      },
      onMarkerClick: (data: { id: string; coords: [number, number]; props?: any }) => {
        this.focusOnMarker(data)
        this.openBalloon(data)
      },
      resetActiveMarkers: () => this.resetActiveMarkers()
    })
  }

  private initControllers(mapElement: HTMLElement): void {
    const mapID = mapElement.dataset.map
    const decreaseZoom = document.querySelector<HTMLElement>(`[data-map-decrease=${mapID}]`)
    const increaseZoom = document.querySelector<HTMLElement>(`[data-map-increase=${mapID}]`)

    if (!decreaseZoom || !increaseZoom) return

    decreaseZoom.addEventListener('click', () => {
      this.map.update({ location: { zoom: (this.map as any).zoom - 1, duration: 300 } })
    })

    increaseZoom.addEventListener('click', () => {
      this.map.update({ location: { zoom: (this.map as any).zoom + 1, duration: 300 } })
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
      if (mobileElementExists) return
    }

    const { theme, ...restConfig } = this.config
    mapElement.innerHTML = ''
    this.map = new ymaps3.YMap(mapElement, restConfig as any)
    this.addThemeLayer()
    this.addMarkers(mapElement)
    this.initControllers(mapElement)
    this.bindPlacemarkListClicks(mapElement)

    console.log('>>>> Мы инициализировали карту ', mapElement.id)
  }

  public destroy(): void {
    if (!this.map) return

    if (this.balloonMarker) {
      try {
        this.map.removeChild(this.balloonMarker)
      } catch {}
      this.balloonMarker = null
    }

    if (this.clusterer && (this.map as any).children?.includes(this.clusterer)) {
      try {
        this.map.removeChild(this.clusterer)
      } catch {}
      this.clusterer = null
    }

    try {
      ;(this.map as any).destroy?.()
    } catch {}
    const container = (this.map as any)?.container
    if (container instanceof HTMLElement) container.innerHTML = ''
    const parent = container?.parentElement
    if (parent) while (parent.firstChild) parent.removeChild(parent.firstChild)
  }

  public getMap(): YMap {
    return this.map
  }

  public resetActiveMarkers() {
    Object.values(this.markerRefs).forEach(marker => {
      marker.element?.classList.remove('map__marker--active')
    })
    this.activeMarkerId = null
    this.closeBalloon()
  }

  private normalizeCoords(coords: any): [number, number] {
    return Array.isArray(coords) ? coords : parseCoords(String(coords))
  }

  private escapeHTML(raw: any): string {
    const div = document.createElement('div')
    div.textContent = String(raw ?? '')
    return div.innerHTML
  }

  private setActiveButton(id: string): void {
    const root: ParentNode =
      ((this.map as any)?.container?.closest?.('.map-container') as Element) ?? document
    const buttons = root.querySelectorAll<HTMLButtonElement>('[data-id-button]')
    buttons.forEach(b => b.classList.remove('active'))
    const btn = root.querySelector<HTMLButtonElement>(
      `[data-id-button="${CSS.escape(String(id))}"]`
    )
    if (btn) btn.classList.add('active')
  }

  private renderBalloonContent(data: { id: string; props?: any }): HTMLElement {
    const p = data.props ?? this.pointsById[data.id] ?? {}
    const el = document.createElement('div')
    el.className = 'map-balloon'
    el.innerHTML = `
      <button class="map-balloon__close" type="button" aria-label="Закрыть" data-map-balloon-close>×</button>
      <div class="map-balloon__body">
        <div class="map-balloon__title">${this.escapeHTML(p.name ?? `Точка #${data.id}`)}</div>
        ${p.address ? `<div class="map-balloon__row">${this.escapeHTML(p.address)}</div>` : ''}
        ${p.schedule ? `<div class="map-balloon__row">${this.escapeHTML(p.schedule)}</div>` : ''}
        ${p.phone ? `<div class="map-balloon__row">${this.escapeHTML(p.phone)}</div>` : ''}
        ${p.desc ? `<div class="map-balloon__row">${this.escapeHTML(p.desc)}</div>` : ''}
      </div>
      <div class="map-balloon__arrow"></div>
    `.trim()

    el.addEventListener('click', e => {
      const t = e.target as HTMLElement
      if (t.matches('[data-map-balloon-close]')) this.closeBalloon()
    })

    return el
  }

  private openBalloon(data: { id: string; coords: any; props?: any }): void {
    const coords = this.normalizeCoords(data.coords)
    const content = this.renderBalloonContent({ id: data.id, props: data.props })

    if (this.balloonMarker) {
      try {
        this.map.removeChild(this.balloonMarker)
      } catch {}
      this.balloonMarker = null
    }

    this.balloonMarker = new ymaps3.YMapMarker({ coordinates: coords, zIndex: 9999 }, content)
    this.map.addChild(this.balloonMarker)
  }

  private closeBalloon(): void {
    if (!this.balloonMarker) return
    try {
      this.map.removeChild(this.balloonMarker)
    } catch {}
    this.balloonMarker = null
  }

  public async focusOnMarker(data: { id: string; coords: any }) {
    const center = this.normalizeCoords(data.coords)

    this.map.update({
      location: {
        center,
        zoom: Math.max((this.map as any).zoom, 13),
        duration: 300
      }
    })

    this.setActiveButton(data.id)

    setTimeout(() => {
      const marker = this.markerRefs[data.id]
      if (marker) {
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

    const root: ParentNode =
      ((this.map as any)?.container?.closest?.('.map-container') as Element) ?? document
    const buttons = root.querySelectorAll<HTMLButtonElement>('[data-id-button]')

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id-button')
        const coordsAttr = btn.closest('li')?.getAttribute('data-coords')
        if (!id || !coordsAttr) return

        const coords = this.normalizeCoords(coordsAttr)
        const props = this.pointsById[id]

        this.setActiveButton(id)
        this.focusOnMarker({ id, coords })
        this.openBalloon({ id, coords, props })
      })
    })
  }
}

export { MapComponent }
