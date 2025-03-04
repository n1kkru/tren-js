const dependentCrop = container => {
  const source = container.querySelector('[data-crop-text-source]'),
    text = container.querySelector('[data-crop-text-target]'),
    textMaxLineCount = +text.dataset.cropTextMaxLine,
    titleStyles = window.getComputedStyle(source),
    lineHeight = parseFloat(titleStyles.lineHeight),
    titleHeight = source.offsetHeight,
    titleLinesCount = Math.round(titleHeight / lineHeight),
    textLinesCount = textMaxLineCount - titleLinesCount + 1

  text.style['-webkit-line-clamp'] = textLinesCount
  text.style['line-clamp'] = textLinesCount
}

const cropText = () => {
  const containers = document.querySelectorAll('[data-crop-text]')

  for (const container of containers) {
    const type = container.dataset.cropText

    if (type === 'dependent') dependentCrop(container)
  }
}

export { cropText }
