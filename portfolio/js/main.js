/* ==========================================================================
   MASTER INTERACTION & ANIMATION SCRIPT — PORTFOLIO
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Initialize Smooth Scrolling (Lenis)
  const lenis = initSmoothScroll();

  // Initialize Navigation Controls
  initNavigation(lenis);

  // Initialize GSAP Parallax & Zoom Animations
  initAnimations();
});

/**
 * Initializes Lenis smooth scrolling and pairs it with GSAP ticker.
 */
function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple-like easing curve
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // Connect Lenis scroll to ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  // Connect GSAP ticker to Lenis
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  // Turn off lag smoothing for crisp scroll synchronization
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

/**
 * Handles Hamburger Menu toggle and overlay animations.
 * Also synchronizes menu link clicks with smooth scroll targets.
 */
function initNavigation(lenis) {
  const menuBtn = document.getElementById('menu-btn');
  const navOverlay = document.getElementById('nav-overlay');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let isMenuOpen = false;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    
    // Toggle state attributes
    menuBtn.setAttribute('aria-expanded', isMenuOpen);
    navOverlay.setAttribute('aria-hidden', !isMenuOpen);
    
    // Toggle CSS classes
    navOverlay.classList.toggle('active');
    
    if (isMenuOpen) {
      // Prevent page scroll behind overlay
      lenis.stop();
      
      // GSAP slide-in links stagger
      gsap.fromTo('.nav-link', 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.15 }
      );
      
      gsap.fromTo('.nav-footer',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out', delay: 0.5 }
      );
    } else {
      // Re-enable page scroll
      lenis.start();
    }
  }

  // Hamburger button click
  menuBtn.addEventListener('click', toggleMenu);

  // Close menu and scroll to section on clicking links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      // Close menu first
      if (isMenuOpen) toggleMenu();
      
      // Smooth scroll to element via Lenis
      if (targetElement) {
        // Delay scroll slightly to allow menu overlay fade-out transition to begin
        setTimeout(() => {
          lenis.scrollTo(targetElement, {
            offset: 0,
            duration: 1.5,
            immediate: false
          });
        }, 150);
      }
    });
  });

  // Also hook page scroll links on primary buttons (e.g. Hero Section CTA buttons)
  const ctaLinks = document.querySelectorAll('.hero-actions .btn, .scroll-indicator a');
  ctaLinks.forEach(cta => {
    cta.addEventListener('click', (e) => {
      const targetId = cta.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          lenis.scrollTo(targetElement, { offset: 0, duration: 1.5 });
        }
      }
    });
  });
}

/**
 * Builds all ScrollTrigger animations for sections and cards.
 */
function initAnimations() {
  
  // 1. HERO ANIMATIONS (Parallax zoom-out on scroll)
  gsap.to('.hero-content', {
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    },
    scale: 1.15,
    opacity: 0,
    y: 120,
    ease: 'none'
  });

  // 2. ABOUT ANIMATIONS
  // Subtle Zoom on the Photo
  gsap.to('.photo-wrapper', {
    scrollTrigger: {
      trigger: '#about',
      start: 'top 80%',
      end: 'bottom top',
      scrub: true
    },
    scale: 1.08,
    y: -20,
    ease: 'none'
  });

  // Fade-in About Text info
  gsap.from('#about .about-info', {
    scrollTrigger: {
      trigger: '#about',
      start: 'top 75%',
      toggleActions: 'play none none reverse'
    },
    opacity: 0,
    x: 40,
    duration: 1,
    ease: 'power3.out'
  });

  // 3. SKILLS GRID ANIMATION (Staggered scroll trigger)
  gsap.from('.skill-card', {
    scrollTrigger: {
      trigger: '#skills',
      start: 'top 75%',
      toggleActions: 'play none none reverse'
    },
    opacity: 0,
    y: 50,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
  });

  // 4. PROJECTS PARALLAX & STAGGER ANIMATIONS
  // Stagger project cards fade in
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 80,
      duration: 1,
      ease: 'power3.out'
    });

    // Create subtle parallax movement on the background graphic inside each card
    const parallaxBg = card.querySelector('.project-parallax-bg');
    if (parallaxBg) {
      gsap.to(parallaxBg, {
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        },
        y: '10%',
        ease: 'none'
      });
    }
  });

  // 5. EDUCATION TIMELINE ANIMATION
  // Grow vertical progress line down with scroll
  gsap.to('.timeline-line-progress', {
    scrollTrigger: {
      trigger: '.timeline-wrapper',
      start: 'top 40%',
      end: 'bottom 50%',
      scrub: true
    },
    height: '100%',
    ease: 'none'
  });

  // Slide items in and activate timeline dots
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach((item, index) => {
    const isLeft = item.classList.contains('left');
    const xOffset = isLeft ? -80 : 80;

    gsap.from(item.querySelector('.timeline-content'), {
      scrollTrigger: {
        trigger: item,
        start: 'top 75%',
        // Toggles dot active state class based on scroll overlap
        onEnter: () => item.classList.add('active'),
        onLeaveBack: () => item.classList.remove('active'),
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      x: xOffset,
      duration: 0.9,
      ease: 'power3.out'
    });
  });

  // 6. CONTACT CARDS ENTRANCE
  gsap.from('.contact-card', {
    scrollTrigger: {
      trigger: '#contact',
      start: 'top 75%',
      toggleActions: 'play none none reverse'
    },
    opacity: 0,
    scale: 0.96,
    y: 40,
    duration: 1.2,
    ease: 'power3.out'
  });
}
