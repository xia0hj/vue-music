export const addStyleClass = (el, className) => {
  // 避免重复添加class
  if (!el.classList.contains(className)) {
    el.classList.add(className)
  }
}

export const removeStyleClass = (el, className) => {
  el.classList.remove(className)
}
