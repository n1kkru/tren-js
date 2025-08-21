// MapClusterer.ts
export async function createClusterer(
  map: any,
  markerData: any[],
  options: {
    onMarkerCreated?: (id: string, marker: ymaps3.YMapMarker) => void
    onMarkerClick?: (data: { id: string; coords: [number, number]; props?: any }) => void
    resetActiveMarkers?: () => void
  } = {}
) {
  await ymaps3.ready

  const { YMapClusterer, clusterByGrid } = await ymaps3.import('@yandex/ymaps3-clusterer@0.0.1')

  // GeoJSON-like features
  const features = markerData.map((m, idx) => ({
    type: 'Feature',
    id: m.id ?? idx,
    geometry: { type: 'Point', coordinates: parseCoords(m.coords) as [number, number] },
    properties: m
  }))

  function createMarkerElem(onClick?: () => void) {
    const el = document.createElement('div')
    el.className = 'map__marker'
    el.innerHTML = `
      <svg class="map__marker-icon" width="36" height="44" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 44C18 44 36 26.6 36 14C36 6.26801 27.9411 0 18 0C8.05887 0 0 6.26801 0 14C0 26.6 18 44 18 44Z" fill="currentColor"/>
        <circle cx="18" cy="14" r="6" fill="white"/>
      </svg>
    `
    el.dataset.mapMarker = ''
    if (onClick) el.addEventListener('click', onClick)
    return el
  }

  function marker(feature: any) {
    const dataItem = feature.properties
    const id = String(dataItem.id ?? feature.id)
    const coords = feature.geometry.coordinates as [number, number]

    const markerElement = createMarkerElem(() => {
      options.resetActiveMarkers?.()
      markerElement.classList.add('map__marker--active')
      options.onMarkerClick?.({ id, coords, props: dataItem })
    })

    const markerInstance = new ymaps3.YMapMarker(
      {
        coordinates: coords,
        // смещать не обязательно, если центруешь svg/элемент через CSS
        // offset: [-18, -44],
        zIndex: 1000
      },
      markerElement
    )

    options.onMarkerCreated?.(id, markerInstance)
    return markerInstance
  }

  function createClusterElem(count: number) {
    const div = document.createElement('div')
    div.className = 'map__cluster'
    div.innerHTML = `<span class="map__cluster-count">${count}</span>`
    return div
  }

  function cluster(coords: [number, number], featuresInCluster: any[]) {
    const el = createClusterElem(featuresInCluster.length)
    return new ymaps3.YMapMarker(
      {
        coordinates: coords,
        onClick: () => {
          const bounds = getBounds(featuresInCluster.map(f => f.geometry.coordinates))
          const center: [number, number] = [
            (bounds[0][0] + bounds[1][0]) / 2,
            (bounds[0][1] + bounds[1][1]) / 2
          ]
          map.update({
            location: { center, zoom: map.zoom + 2, duration: 500 }
          })
        },
        zIndex: 900
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

function getBounds(coords: [number, number][]) {
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
  ] as [[number, number], [number, number]]
}

export function parseCoords(strOrArr: string | [number, number]): [number, number] {
  if (Array.isArray(strOrArr)) return strOrArr
  return String(strOrArr)
    .split(',')
    .map(s => Number(s.trim())) as [number, number]
}
