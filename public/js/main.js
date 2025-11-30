/**
 * JORTFOLIO - Main JavaScript
 * Author: Jheel Johari
 * Version: 1.0.0
 */

;(() => {
  // ============================================
  // THEME MANAGEMENT
  // ============================================
  const ThemeManager = {
    init() {
      this.toggle = document.getElementById("theme-toggle")
      this.html = document.documentElement

      // Load saved theme or default to dark
      const savedTheme = localStorage.getItem("theme") || "dark"
      this.setTheme(savedTheme)

      // Bind toggle event
      if (this.toggle) {
        this.toggle.addEventListener("click", () => this.toggleTheme())
      }
    },

    setTheme(theme) {
      this.html.setAttribute("data-theme", theme)
      localStorage.setItem("theme", theme)
    },

    toggleTheme() {
      const currentTheme = this.html.getAttribute("data-theme")
      const newTheme = currentTheme === "dark" ? "light" : "dark"
      this.setTheme(newTheme)
    },
  }

  // ============================================
  // HEADER SCROLL EFFECT
  // ============================================
  const HeaderManager = {
    init() {
      this.header = document.getElementById("site-header")
      this.lastScroll = 0

      if (this.header) {
        window.addEventListener("scroll", () => this.handleScroll(), { passive: true })
        this.handleScroll() // Initial check
      }
    },

    handleScroll() {
      const currentScroll = window.pageYOffset

      if (currentScroll > 50) {
        this.header.classList.add("scrolled")
      } else {
        this.header.classList.remove("scrolled")
      }

      this.lastScroll = currentScroll
    },
  }

  // ============================================
  // MOBILE NAVIGATION
  // ============================================
  const MobileNav = {
    init() {
      this.toggle = document.getElementById("menu-toggle")
      this.nav = document.getElementById("mobile-nav")
      this.links = document.querySelectorAll(".mobile-nav-link")

      if (this.toggle && this.nav) {
        this.toggle.addEventListener("click", () => this.toggleMenu())

        // Close menu when clicking a link
        this.links.forEach((link) => {
          link.addEventListener("click", () => this.closeMenu())
        })

        // Close menu on escape key
        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape" && this.isOpen()) {
            this.closeMenu()
          }
        })
      }
    },

    toggleMenu() {
      const isExpanded = this.toggle.getAttribute("aria-expanded") === "true"
      this.toggle.setAttribute("aria-expanded", !isExpanded)
      this.nav.classList.toggle("active")
      document.body.style.overflow = isExpanded ? "" : "hidden"
    },

    closeMenu() {
      this.toggle.setAttribute("aria-expanded", "false")
      this.nav.classList.remove("active")
      document.body.style.overflow = ""
    },

    isOpen() {
      return this.nav.classList.contains("active")
    },
  }

  // ============================================
  // CURSOR GLOW EFFECT
  // ============================================
  const CursorGlow = {
    init() {
      this.glow = document.querySelector(".cursor-glow")

      if (this.glow && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        document.addEventListener("mousemove", (e) => this.updatePosition(e), { passive: true })
      }
    },

    updatePosition(e) {
      requestAnimationFrame(() => {
        this.glow.style.left = e.clientX + "px"
        this.glow.style.top = e.clientY + "px"
      })
    },
  }

  // ============================================
  // REVEAL ON SCROLL ANIMATIONS
  // ============================================
  const RevealAnimations = {
    init() {
      this.elements = document.querySelectorAll(".reveal-up, .reveal-text, .reveal-image")

      if (this.elements.length > 0) {
        this.observer = new IntersectionObserver((entries) => this.handleIntersection(entries), {
          threshold: 0.1,
          rootMargin: "0px 0px -50px 0px",
        })

        this.elements.forEach((el) => this.observer.observe(el))
      }
    },

    handleIntersection(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed")
          this.observer.unobserve(entry.target)
        }
      })
    },
  }

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  const SmoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => this.handleClick(e, anchor))
      })
    },

    handleClick(e, anchor) {
      const href = anchor.getAttribute("href")
      if (href === "#") return

      const target = document.querySelector(href)
      if (target) {
        e.preventDefault()
        const headerHeight = document.getElementById("site-header")?.offsetHeight || 0
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    },
  }

  // ============================================
  // PAGE TRANSITIONS
  // ============================================
  const PageTransitions = {
    init() {
      this.overlay = document.querySelector(".page-transition")

      // Handle internal link clicks
      document.querySelectorAll("a").forEach((link) => {
        if (this.isInternalLink(link)) {
          link.addEventListener("click", (e) => this.handleLinkClick(e, link))
        }
      })

      // Fade in on page load
      window.addEventListener("load", () => {
        document.body.classList.add("loaded")
      })
    },

    isInternalLink(link) {
      return (
        link.hostname === window.location.hostname &&
        !link.getAttribute("href").startsWith("#") &&
        !link.hasAttribute("target")
      )
    },

    handleLinkClick(e, link) {
      e.preventDefault()
      const href = link.getAttribute("href")

      this.overlay.classList.add("active")

      setTimeout(() => {
        window.location.href = href
      }, 300)
    },
  }

  // ============================================
  // LAZY LOADING IMAGES
  // ============================================
  const LazyLoad = {
    init() {
      if ("loading" in HTMLImageElement.prototype) {
        // Native lazy loading supported
        document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
          img.src = img.dataset.src || img.src
        })
      } else {
        // Fallback for older browsers
        this.observer = new IntersectionObserver((entries) => this.handleIntersection(entries), { rootMargin: "50px" })

        document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
          this.observer.observe(img)
        })
      }
    },

    handleIntersection(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src || img.src
          this.observer.unobserve(img)
        }
      })
    },
  }

  // ============================================
  // FORM VALIDATION
  // ============================================
  const FormValidation = {
    init() {
      const forms = document.querySelectorAll("form")

      forms.forEach((form) => {
        form.addEventListener("submit", (e) => this.handleSubmit(e, form))

        // Real-time validation
        form.querySelectorAll("input, textarea").forEach((input) => {
          input.addEventListener("blur", () => this.validateField(input))
          input.addEventListener("input", () => this.clearError(input))
        })
      })
    },

    handleSubmit(e, form) {
      let isValid = true

      form.querySelectorAll("[required]").forEach((field) => {
        if (!this.validateField(field)) {
          isValid = false
        }
      })

      if (!isValid) {
        e.preventDefault()
      }
    },

    validateField(field) {
      const value = field.value.trim()
      let isValid = true

      if (field.hasAttribute("required") && !value) {
        isValid = false
      }

      if (field.type === "email" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        isValid = emailRegex.test(value)
      }

      if (!isValid) {
        field.classList.add("error")
      } else {
        field.classList.remove("error")
      }

      return isValid
    },

    clearError(field) {
      field.classList.remove("error")
    },
  }

  // ============================================
  // INITIALIZE ALL MODULES
  // ============================================
  document.addEventListener("DOMContentLoaded", () => {
    ThemeManager.init()
    HeaderManager.init()
    MobileNav.init()
    CursorGlow.init()
    RevealAnimations.init()
    SmoothScroll.init()
    PageTransitions.init()
    LazyLoad.init()
    FormValidation.init()
  })
})()
