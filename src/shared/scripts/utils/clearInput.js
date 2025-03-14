export const clearInputs = () => {
  const myClearButtons = document.querySelectorAll('[data-input-clear]')

  console.log(myClearButtons)

  if (!myClearButtons.length) return

  myClearButtons.forEach(button => {
    button.addEventListener('click', clearInput)
  })
}

function clearInput() {
  console.log(this)
}
