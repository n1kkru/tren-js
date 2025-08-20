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
    markerElement.className = 'map__marker'
    markerElement.innerHTML = `
      <svg class="map__marker-icon" width="36" height="44" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 44C18 44 36 26.6 36 14C36 6.26801 27.9411 0 18 0C8.05887 0 0 6.26801 0 14C0 26.6 18 44 18 44Z" fill="currentColor"/>
        <circle cx="18" cy="14" r="6" fill="white"/>
      </svg>
    `
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

  function createClusterElem(count: number) {
    const div = document.createElement('div')
    div.className = 'map__cluster'
    div.innerHTML = `<span class="map__cluster-count">${count}</span>`
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
