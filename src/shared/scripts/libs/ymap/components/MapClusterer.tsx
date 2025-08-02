export async function createClusterer(map: any, markerData: any, options = {}) {
  window.map = null

  await ymaps3.ready

  const { YMapClusterer, clusterByGrid } = await ymaps3.import('@yandex/ymaps3-clusterer@0.0.1')

  // Преобразуем данные к geojson-фичам
  const features = markerData.map((m, idx) => ({
    type: 'Feature',
    id: m.id ?? idx,
    geometry: { type: 'Point', coordinates: parseCoords(m.coords) },
    properties: m
  }))

  function createMarkerElem(onClick?) {
    const markerElement = document.createElement('div')
    markerElement.innerHTML = `<svg class=initial width="60" height="66" viewBox="0 0 60 66" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_621_69682)">
        <path d="M0 49.7143L70.8857 49.7143V59.3185C65.1885 59.7376 58.1668 60.4841 50.5333 61.8488C44.4427 62.9378 39.3173 64.1786 35.1509 65.3553C32.2104 66.1865 28.3721 66.2164 25.3606 65.4307C20.3874 64.1325 14.3541 62.7858 7.26945 61.6166C4.77488 61.205 2.34563 60.8477 0 60.537L0 49.7143Z" fill="#02B3E3"/>
        </g>
        <rect width="60" height="60" transform="matrix(0 -1 -1 0 60 60)" fill="#02B3E3"/>
        <defs>
        <clipPath id="clip0_621_69682">
        <rect width="6" height="60" fill="white" transform="matrix(0 -1 1 0 0 66)"/>
        </clipPath>
        </defs>
      </svg>`

    markerElement.classList.add('map__marker')
    markerElement.dataset.mapMarker = ''

    if (onClick) markerElement.addEventListener('click', onClick)
    return markerElement
  }

  function marker(feature) {
    const dataItem = feature.properties

    const id = dataItem.id
    const coords = dataItem.coords

    const markerElement = createMarkerElem(() => {
      options.resetActiveMarkers && options.resetActiveMarkers()
      markerElement.classList.add('map__marker--active')
      options.onMarkerClick && options.onMarkerClick({ id, coords })

      const container = document.querySelector('.pickup-points-modal__list')
      const target = document.querySelector(`[data-list-placemark-id="${id}"]`)
      if (target && container) {
        document
          .querySelectorAll('[data-list-placemark-id]')
          .forEach(el => el.classList.remove('is-active'))
        target.classList.add('is-active')

        // скролл списка на активный элемент
        const containerTop = container.getBoundingClientRect().top
        const targetTop = target.getBoundingClientRect().top
        const offset = targetTop - containerTop + container.scrollTop - 145

        container.scrollTo({ behavior: 'smooth', top: offset })
      }
      map.update({
        location: {
          center: feature.geometry.coordinates,
          zoom: map.zoom,
          duration: 300
        }
      })
    })
    const markerInstance = new ymaps3.YMapMarker(
      {
        coordinates: feature.geometry.coordinates,
        // @ts-ignore
        offset: [-25, -25]
      },
      markerElement
    )
    options.onMarkerCreated && options.onMarkerCreated(id, markerInstance)
    return markerInstance
  }

  function createClusterElem(count) {
    const div = document.createElement('div')
    div.innerHTML = `<svg class=initial width="60" height="66" viewBox="0 0 60 66" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_621_69682)">
        <path d="M0 49.7143L70.8857 49.7143V59.3185C65.1885 59.7376 58.1668 60.4841 50.5333 61.8488C44.4427 62.9378 39.3173 64.1786 35.1509 65.3553C32.2104 66.1865 28.3721 66.2164 25.3606 65.4307C20.3874 64.1325 14.3541 62.7858 7.26945 61.6166C4.77488 61.205 2.34563 60.8477 0 60.537L0 49.7143Z" fill="#02B3E3"/>
        </g>
        <rect width="60" height="60" transform="matrix(0 -1 -1 0 60 60)" fill="#02B3E3"/>
        <defs>
        <clipPath id="clip0_621_69682">
        <rect width="6" height="60" fill="white" transform="matrix(0 -1 1 0 0 66)"/>
        </clipPath>
        </defs>
      </svg>
      <span class='count'>${count}</span>`
    div.className = 'map__cluster'
    return div
  }

  function cluster(coords, features) {
    const el = createClusterElem(features.length)

    return new ymaps3.YMapMarker(
      {
        coordinates: coords,
        onClick: () => {
          const bounds = getBounds(features.map(f => f.geometry.coordinates))
          const center = [(bounds[0][0] + bounds[1][0]) / 2, (bounds[0][1] + bounds[1][1]) / 2]
          map.update({
            location: {
              center,
              zoom: map.zoom + 2,
              duration: 500
            }
          })
        }
      },
      el
    )
  }

  const clusterer = new YMapClusterer({
    method: clusterByGrid({ gridSize: 64 }),
    features,
    marker,
    cluster
  })

  map.addChild(clusterer)
  return clusterer
}

function getBounds(coords) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity
  coords.forEach(([x, y]) => {
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  })
  return [
    [minX, minY],
    [maxX, maxY]
  ]
}

export function parseCoords(str: string) {
  return str.split(',').map(s => Number(s.trim()))
}
