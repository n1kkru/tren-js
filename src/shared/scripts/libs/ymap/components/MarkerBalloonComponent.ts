import mapMarkerSVG from '@shared/assets/images/svg/checkbox-check.svg'
import type { YMap, YMapMarker } from '@yandex/ymaps3-types'

export interface IContactItem {
  href: string
  target?: string
  children?: {
    icon?: string
    text: string
  }
}

export interface IMarkerData {
  id?: string
  coords: string
  title?: string
  subtitle?: string
  address?: string
  contacts?: IContactItem[]
  regions?: string
}

const parseCoords = (coordsStr: string): [number, number] => {
  const arr = coordsStr.split(',').map(v => parseFloat(v.trim()))
  return arr.length === 2 ? [arr[0], arr[1]] : [0, 0]
}

/**
 * Класс PopupMarkerComponent
 * - Принимает массив "markerData"
 * - Для каждого элемента создаёт YMapMarker
 * - В balloon.content подставляет HTML из шаблона <template>, заполняя поля
 */
class PopupMarkerComponent {
  private map: YMap
  private markerData: IMarkerData[]
  private markers: any[] = []
  private currentOpenBalloon: HTMLElement | null = null
  private markerMap: Map<string, any> = new Map()

  /**
   * @param map экземпляр YMap
   * @param markerData массив данных о маркерах
   * @param balloonTemplateSelector селектор <template>, например "#balloonTmpl", "[data-map-template]" и т.д.
   */
  constructor(map: YMap, markerData: IMarkerData[]) {
    this.map = map
    this.markerData = markerData

    this.init()
  }

  /**
   * Инициализируем маркеры: создаём YMapMarker для каждого item.
   */
  private init(): void {
    this.template = document.querySelector('[data-map-template]')

    this.markerData.forEach(dataItem => {
      const marker = this.createMarker(dataItem)
      this.map.addChild(marker)
      this.markers.push(marker)
    })
  }

  /**
   * Создаём YMapMarker с balloon.content = HTML, полученным из шаблона.
   */
  private createMarker(dataItem: IMarkerData): any {
    const coords = parseCoords(dataItem.coords)
    if (!coords.length) return
    const markerElement = document.createElement('div')

    markerElement.innerHTML = mapMarkerSVG
    markerElement.classList.add('map__marker')
    markerElement.querySelector('svg')?.classList.add('initial')
    markerElement.dataset.mapMarker = ''

    // Создаем маркер
    const marker = new ymaps3.YMapMarker({ coordinates: coords }, markerElement)

    // 🔥 Привязка клика
    if (dataItem.id) {
      const id = String(dataItem.id)

      this.markerMap.set(String(dataItem.id), {
        marker,
        coords
      })

      markerElement.addEventListener('click', () => {
        this.resetActiveMarkers()
        marker.element?.classList.add('map__marker--active')

        // Найдём соответствующий DOM-элемент
        const target = document.querySelector(`[data-list-placemark-id="${id}"]`)
        if (target) {
          // Убираем активность у всех
          document
            .querySelectorAll('[data-list-placemark-id]')
            .forEach(el => el.classList.remove('is-active'))

          target.classList.add('is-active')

          // Скроллим до него
          target.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }

        // Центруем карту (опц.)
        this.map.update({
          location: {
            center: coords,
            zoom: this.map.zoom,
            duration: 300
          }
        })
      })
    }

    return marker
  }

  /**
   * Центрирует карту на выбранном маркере и выделяет его визуально.
   * Используется при клике на элемент списка.
   *
   * @param id - ID маркера (соответствует dataItem.id из markerData)
   */
  public focusOnMarker(id: string): void {
    const found = this.markerMap.get(String(id))
    if (!found) {
      return
    }

    const { marker, coords } = found

    this.map.update({
      location: {
        center: coords,
        zoom: 13,
        duration: 200
      }
    })

    this.resetActiveMarkers()
    marker.element?.classList.add('map__marker--active')
  }

  /**
   * Сбрасывает визуальную активность всех маркеров на карте.
   * Удаляет класс `map__marker--active` у каждого маркерного элемента.
   * Полезно вызывать перед активацией нового маркера.
   */
  public resetActiveMarkers(): void {
    for (const marker of this.markerMap.values()) {
      marker.element?.classList.remove('map__marker--active')
    }
  }
}

export { PopupMarkerComponent }
