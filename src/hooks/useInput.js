import { onMounted } from 'vue'

export const useInput = () => {
  onMounted(() => {
    const page = document.querySelector('.page')
    const originH = window.innerHeight
    let offset = 0

    document.addEventListener('click', handleFocus, true)
    document.addEventListener('touchend', handleFocus, true)

    function handleFocus(e) {
      const el = e.target
      if (!el.matches('input,textarea')) return

      setTimeout(() => {
        const rect = el.getBoundingClientRect()
        const keyboardTop = window.innerHeight - 100
        const needScroll = rect.bottom - keyboardTop
        if (needScroll > 0) {
          offset = needScroll + 10
          page.style.transform = `translateY(-${offset}px)`
        } else {
          page.style.transform = ''
          offset = 0
        }
      }, 300)
    }

    let checkTimer = null
    window.addEventListener('resize', () => {
      clearTimeout(checkTimer)
      checkTimer = setTimeout(() => {
        if (window.innerHeight >= originH - 10) {
          page.style.transform = ''
          offset = 0
        }
      }, 100)
    })
  })
}
