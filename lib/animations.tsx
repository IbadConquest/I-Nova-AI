import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { TextPlugin } from "gsap/TextPlugin"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, TextPlugin)
}

// Animation presets
export const animationPresets = {
  fadeInUp: {
    from: { opacity: 0, y: 30 },
    to: { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
  },
  fadeInLeft: {
    from: { opacity: 0, x: -30 },
    to: { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
  },
  fadeInRight: {
    from: { opacity: 0, x: 30 },
    to: { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
  },
  scaleIn: {
    from: { opacity: 0, scale: 0.8 },
    to: { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
  },
  slideInUp: {
    from: { opacity: 0, y: 50, rotateX: 15 },
    to: { opacity: 1, y: 0, rotateX: 0, duration: 1, ease: "power3.out" },
  },
}

// Page transition animations
export const pageTransitions = {
  enter: (element: HTMLElement) => {
    gsap.fromTo(element, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
  },
  exit: (element: HTMLElement) => {
    return gsap.to(element, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: "power2.in",
    })
  },
}

// Scroll-triggered animations
export const createScrollAnimation = (selector: string, animation: any, options: any = {}) => {
  const defaultOptions = {
    trigger: selector,
    start: "top 80%",
    toggleActions: "play none none reverse",
  }

  gsap.utils.toArray(selector).forEach((element: any) => {
    gsap.fromTo(element, animation.from, {
      ...animation.to,
      scrollTrigger: { ...defaultOptions, ...options, trigger: element },
    })
  })
}

// Stagger animations
export const createStaggerAnimation = (selector: string, animation: any, staggerDelay = 0.1) => {
  gsap.utils.toArray(selector).forEach((element: any, index) => {
    gsap.fromTo(element, animation.from, {
      ...animation.to,
      delay: index * staggerDelay,
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    })
  })
}

// Continuous animations
export const createFloatingAnimation = (selector: string) => {
  gsap.utils.toArray(selector).forEach((element: any) => {
    gsap.to(element, {
      y: -10,
      duration: 2 + Math.random() * 2,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
      delay: Math.random() * 2,
    })
  })
}

// Magnetic button effect
export const createMagneticEffect = (selector: string) => {
  gsap.utils.toArray(selector).forEach((button: any) => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2

      gsap.to(button, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: "power2.out",
      })
    }

    const handleMouseLeave = () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
      })
    }

    button.addEventListener("mousemove", handleMouseMove)
    button.addEventListener("mouseleave", handleMouseLeave)
  })
}

// Parallax scrolling
export const createParallaxEffect = (selector: string, speed = 0.5) => {
  gsap.utils.toArray(selector).forEach((element: any) => {
    gsap.to(element, {
      yPercent: -50 * speed,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    })
  })
}

// Text reveal animation
export const createTextRevealAnimation = (selector: string) => {
  gsap.utils.toArray(selector).forEach((element: any) => {
    const text = element.textContent
    element.innerHTML = text
      .split("")
      .map((char: string) => `<span class="char">${char}</span>`)
      .join("")

    gsap.fromTo(
      element.querySelectorAll(".char"),
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.05,
        stagger: 0.02,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      },
    )
  })
}

// Loading animations
export const createLoadingAnimation = () => {
  const tl = gsap.timeline()

  tl.to(".loading-bar", {
    width: "100%",
    duration: 2,
    ease: "power2.inOut",
  })
    .to(".loading-screen", {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
    })
    .to(".loading-screen", {
      display: "none",
    })

  return tl
}

// Hover animations
export const createHoverAnimations = () => {
  // Card hover effects
  gsap.utils.toArray(".hover-card").forEach((card: any) => {
    const handleMouseEnter = () => {
      gsap.to(card, {
        y: -5,
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
      })
    }

    const handleMouseLeave = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      })
    }

    card.addEventListener("mouseenter", handleMouseEnter)
    card.addEventListener("mouseleave", handleMouseLeave)
  })

  // Button hover effects
  gsap.utils.toArray(".hover-button").forEach((button: any) => {
    const handleMouseEnter = () => {
      gsap.to(button, {
        scale: 1.05,
        duration: 0.2,
        ease: "power2.out",
      })
    }

    const handleMouseLeave = () => {
      gsap.to(button, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      })
    }

    button.addEventListener("mouseenter", handleMouseEnter)
    button.addEventListener("mouseleave", handleMouseLeave)
  })
}
