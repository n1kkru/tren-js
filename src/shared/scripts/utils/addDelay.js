export const addDelay = (item, initialDelay) => {
  item.forEach(link => {
    link.style.transitionDelay = `${initialDelay}s`
    initialDelay += 0.1
  })
}
