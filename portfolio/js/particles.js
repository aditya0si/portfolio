/* ==========================================================================
   INTERACTIVE CANVAS PARTICLE STAR FIELD — PORTFOLIO BACKGROUND
   ========================================================================== */

class ParticleField {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animationFrameId = null;
    this.scrollY = 0;
    
    // Configurable parameters
    this.maxParticles = window.innerWidth < 768 ? 40 : 100;
    this.connectionDistance = 110;
    this.baseSpeedX = 0.15;
    this.baseSpeedY = 0.15;
    
    // Theme colors matching CSS
    this.colors = [
      'rgba(124, 77, 255, ',  /* accent-primary (indigo) */
      'rgba(0, 229, 255, ',   /* accent-secondary (cyan) */
      'rgba(240, 240, 245, '   /* text-primary (white/off-white) */
    ];
    
    this.init();
  }
  
  init() {
    this.resizeCanvas();
    this.createParticles();
    this.setupListeners();
    this.animate();
  }
  
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.maxParticles = window.innerWidth < 768 ? 45 : 110;
  }
  
  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      const radius = Math.random() * 2 + 0.5; // size between 0.5px and 2.5px
      const colorIndex = Math.floor(Math.random() * this.colors.length);
      const colorBase = this.colors[colorIndex];
      const alpha = Math.random() * 0.4 + 0.15; // opacity between 0.15 and 0.55
      
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: radius,
        vx: (Math.random() - 0.5) * this.baseSpeedX,
        vy: (Math.random() - 0.5) * this.baseSpeedY,
        colorBase: colorBase,
        alpha: alpha,
        baseAlpha: alpha
      });
    }
  }
  
  setupListeners() {
    // Window Resize with Debounce/Throttle
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const prevWidth = this.canvas.width;
        this.resizeCanvas();
        // If size changed drastically, recreate particles
        if (Math.abs(window.innerWidth - prevWidth) > 50) {
          this.createParticles();
        }
      }, 150);
    });
    
    // Listen to Scroll event to introduce scroll-based vertical offset
    window.addEventListener('scroll', () => {
      this.scrollY = window.scrollY || window.pageYOffset;
    }, { passive: true });
  }
  
  drawConstellations() {
    const len = this.particles.length;
    for (let i = 0; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];
        
        // Calculate scroll vertical offset adjustments
        // Apply vertical shift proportional to scroll position for layered depth
        const y1 = p1.y - this.scrollY * (p1.radius * 0.12);
        const y2 = p2.y - this.scrollY * (p2.radius * 0.12);
        
        const dx = p1.x - p2.x;
        const dy = y1 - y2;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < this.connectionDistance) {
          // Opacity fades as distance approaches threshold
          const alpha = (1 - dist / this.connectionDistance) * 0.12 * Math.min(p1.alpha, p2.alpha);
          
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(124, 77, 255, ${alpha})`;
          this.ctx.lineWidth = 0.45;
          this.ctx.moveTo(p1.x, y1);
          this.ctx.lineTo(p2.x, y2);
          this.ctx.stroke();
        }
      }
    }
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw all particles
    const len = this.particles.length;
    for (let i = 0; i < len; i++) {
      const p = this.particles[i];
      
      // Slow particle drift
      p.x += p.vx;
      p.y += p.vy;
      
      // Screen edge boundary wrapping
      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;
      
      // Calculate visual y-coordinate with scroll-parallax
      // Bigger particles move faster upwards when scrolling (creates foreground depth)
      const visualY = p.y - this.scrollY * (p.radius * 0.12);
      
      // Wrap coordinates visually as well so they don't disappear forever
      let wrappedVisualY = visualY % this.canvas.height;
      if (wrappedVisualY < 0) {
        wrappedVisualY += this.canvas.height;
      }
      
      // Opacity fades out if the particle rises close to top or bottom borders of viewport
      let edgeFade = 1;
      if (wrappedVisualY < 80) {
        edgeFade = wrappedVisualY / 80;
      } else if (wrappedVisualY > this.canvas.height - 80) {
        edgeFade = (this.canvas.height - wrappedVisualY) / 80;
      }
      
      // Draw particle circle
      this.ctx.beginPath();
      this.ctx.arc(p.x, wrappedVisualY, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.colorBase + (p.alpha * edgeFade) + ')';
      this.ctx.fill();
    }
    
    // Draw interconnecting constellation lines
    this.drawConstellations();
    
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }
}

// Initialize canvas on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
  new ParticleField('particle-canvas');
});
