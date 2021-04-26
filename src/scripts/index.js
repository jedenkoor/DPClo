// import Swiper from 'swiper/swiper-bundle.js'
import 'swiper/swiper-bundle.css'
import IMask from 'imask'

import ScrollMagic from 'scrollmagic'
import { gsap, TweenMax } from 'gsap'
import { ScrollToPlugin } from 'gsap/all'
gsap.registerPlugin(ScrollToPlugin)

class Init {
  constructor() {
    this.init()

    // Init smothscroll
    this.controller = new ScrollMagic.Controller()
    this.controller.scrollTo(function (newpos) {
      TweenMax.to(window, 0.6, { scrollTo: { y: newpos } })
    })
  }

  init() {
    this.events()

    this.actions().initPhoneMask()

    setTimeout(() => {
      this.actions().showBody()
      this.actions().scrollToBlockOnLoading()
    }, 300)
  }

  events() {
    const _this = this

    window.ap(document).on('click', '.header-list__link, .footer-list__link', function (e) {
      e.preventDefault()
      _this.actions().scrollToBlock(this)
    })

    window.ap(document).on('input', '[data-type="textarea"]', function () {
      _this.actions().autoGrowTextarea(this)
    })

    window.ap(document).on('click', '.tabs__btn', function (e) {
      e.preventDefault()
      _this.actions().tabChange(this)
    })
  }

  actions() {
    const _this = this

    return {
      scrollToBlockOnLoading() {
        if (localStorage.getItem('idBLock')) {
          const element = document.querySelector(`#${localStorage.getItem('idBLock')}`)
          const topPos = element.getBoundingClientRect().top + window.pageYOffset
          window.scrollTo({
            top: topPos
          })
          localStorage.removeItem('idBLock')
        }
      },
      scrollToBlock(el) {
        const id = el.getAttribute('href').split('#')[1] || ''
        const linkPathname = el.getAttribute('href').split('#')[0]
        const currentPathname = location.pathname
        if (id.length > 0 && currentPathname === linkPathname) {
          _this.controller.scrollTo(`#${id}`)
        }
        if (currentPathname !== linkPathname) {
          localStorage.setItem('idBLock', id)
          location.href = linkPathname
        }
      },
      initPhoneMask() {
        document.querySelectorAll('[data-type="tel"]').forEach((item) => {
          const telMask = IMask(item, {
            mask: '+{7} 000 000 00 00'
          })
          let flagInput = true
          item.addEventListener('input', (e) => {
            if ((e.target.value === '+7 8' || e.target.value === '+7') && flagInput === true) {
              e.target.value = '+7'
              telMask.masked.reset()
              telMask.value = '+7'
              flagInput = false
            } else if (e.target.value === '') {
              flagInput = true
            }
          })
          telMask.on('accept', function () {
            item.classList.remove('input-border')
          })
          telMask.on('complete', function () {
            item.classList.add('input-border')
          })
        })
      },
      showBody() {
        document.querySelector('body').style.opacity = 1
      },
      autoGrowTextarea(el) {
        el.style.height = '2px'
        el.style.height = el.scrollHeight + 'px'
      },
      tabChange(el) {
        const tabDataAttr = el.getAttribute('data-tab')
        const tabContainers = el.closest('.tabs').querySelectorAll('.tabs__container')
        const tabNavigationItem = el.closest('.tabs').querySelectorAll('.tabs__btn')

        tabContainers.forEach((item) => {
          item.classList.remove('tabs__container--active')
          if (item.getAttribute('data-tab') === tabDataAttr) {
            item.classList.add('tabs__container--active')
            if (document.documentElement.clientWidth < 768) {
              window.scrollTo(0, item.offsetTop - 170)
            }
          }
        })

        tabNavigationItem.forEach((item) => {
          if (item.getAttribute('data-tab') !== tabDataAttr) {
            item.classList.remove('tabs__btn--active')
          }
        })

        el.classList.add('tabs__btn--active')
      }
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.controller = new Init()
})
