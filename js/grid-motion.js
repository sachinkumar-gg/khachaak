/**
 * GridMotion Background for Khachaak
 * Animated tilted grid of photography frames using GSAP
 * Optimized with lightweight WebP images (~10KB each) for fast loading on low bandwidth
 */

(function () {
  // 28 highly-optimized, lightweight WebP thumbnails (~280 KB total vs 4.5 MB original)
  const GALLERY_ITEMS = Array.from({ length: 28 }, (_, i) => `/assets/photowalk-bg/${i + 1}.webp`);

  function initGridMotion(options = {}) {
    const items = (options.items && options.items.length > 0) ? options.items : GALLERY_ITEMS;
    const gradientColor = options.gradientColor || 'black';

    const container = document.getElementById('grid-motion-root');
    if (!container) return;

    // Render HTML structure
    container.className = 'noscroll loading';
    container.innerHTML = `
      <section class="intro" style="background: radial-gradient(circle, ${gradientColor} 0%, transparent 100%)">
        <div class="gridMotion-container" id="gridMotionContainer">
          ${[0, 1, 2, 3].map(rowIndex => `
            <div class="row" data-row="${rowIndex}">
              ${[0, 1, 2, 3, 4, 5, 6].map(colIndex => {
                const itemIndex = rowIndex * 7 + colIndex;
                const content = items[itemIndex % items.length];
                const isImage = typeof content === 'string' && (content.startsWith('/') || content.startsWith('http'));
                return `
                  <div class="row__item">
                    <div class="row__item-inner" style="background-color: #111;">
                      ${isImage
                        ? `<img class="row__item-img" src="${content}" loading="lazy" decoding="async" alt="Khachaak Gallery Photo ${itemIndex + 1}" />`
                        : `<div class="row__item-content">${content}</div>`
                      }
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `).join('')}
        </div>
        <div class="fullview"></div>
      </section>
    `;

    if (typeof gsap === 'undefined') {
      console.warn('GSAP library not found, animations disabled.');
      return;
    }

    gsap.ticker.lagSmoothing(0);

    const rowElements = Array.from(container.querySelectorAll('.row'));
    let mouseX = window.innerWidth / 2;
    let targetX = mouseX;
    let idleAngle = 0;

    const handleMouseMove = (e) => {
      targetX = e.clientX;
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        targetX = e.touches[0].clientX;
      }
    };

    const updateMotion = () => {
      idleAngle += 0.015;
      // Smooth interpolation
      mouseX += (targetX - mouseX) * 0.07;

      // Subtle organic ambient sway when cursor is idle or over the form iframe
      const ambientSway = Math.sin(idleAngle) * 40;
      const effectiveX = mouseX + ambientSway;

      const maxMoveAmount = 300;
      const baseDuration = 0.8;
      const inertiaFactors = [0.6, 0.4, 0.3, 0.2];

      rowElements.forEach((row, index) => {
        if (row) {
          const direction = index % 2 === 0 ? 1 : -1;
          const moveAmount = ((effectiveX / window.innerWidth) * maxMoveAmount - maxMoveAmount / 2) * direction;

          gsap.to(row, {
            x: moveAmount,
            duration: baseDuration + inertiaFactors[index % inertiaFactors.length],
            ease: 'power3.out',
            overwrite: 'auto'
          });
        }
      });
    };

    const removeAnimationLoop = gsap.ticker.add(updateMotion);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      removeAnimationLoop();
    };
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initGridMotion());
  } else {
    initGridMotion();
  }

  window.initGridMotion = initGridMotion;
  window.GALLERY_ITEMS = GALLERY_ITEMS;
})();
