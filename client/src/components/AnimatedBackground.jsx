import React, { useEffect, useRef } from 'react';

export default function AnimatedBackground({
  theme = 'midnight',
  bgColor = null,
  enableCursorFx = true,
  bgAnimMode = 'flowers', // 'flowers' | 'particles' | 'hybrid' | 'none'
  flowerTheme = 'sakura', // 'sakura' | 'rose' | 'sunflower' | 'lotus' | 'emerald'
  flowerSize = 1.0, // 0.7 to 1.5 multiplier
  flowerDensity = 1.0, // 0.6 to 1.8 multiplier
  enablePetalSparks = true
}) {
  const canvasRef = useRef(null);
  const clickRingsRef = useRef([]);
  const bloomingFlowersRef = useRef([]);
  const driftingPetalsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse & Touch Tracking State
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      lastX: width / 2,
      lastY: height / 2,
      isClicking: false
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
      }
    };

    const handleMouseDown = (e) => {
      mouse.isClicking = true;
      const flowerPal = getFlowerPalette(flowerTheme);

      // Spawn interactive floral shockwave ring on click
      if (enableCursorFx) {
        clickRingsRef.current.push({
          x: e.clientX,
          y: e.clientY,
          radius: 5,
          maxRadius: 220,
          alpha: 1.0,
          color: flowerPal.glow
        });
      }

      // Massive Floral Bloom Burst on Click
      if (bgAnimMode === 'flowers' || bgAnimMode === 'hybrid') {
        // Spawn 3 central blooming flowers
        for (let b = 0; b < 3; b++) {
          bloomingFlowersRef.current.push({
            x: e.clientX + (Math.random() - 0.5) * 30,
            y: e.clientY + (Math.random() - 0.5) * 30,
            radius: 0,
            maxRadius: (Math.random() * 16 + 22) * flowerSize,
            rotation: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.04,
            petalCount: Math.floor(Math.random() * 3) + 5,
            alpha: 1.0,
            decay: Math.random() * 0.008 + 0.006,
            color: flowerPal.primary,
            secondaryColor: flowerPal.secondary,
            pistilColor: flowerPal.pistil
          });
        }

        // Burst of 28 swirling petals & pollen sparks
        if (enablePetalSparks) {
          for (let i = 0; i < 28; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 7 + 2.5;
            driftingPetalsRef.current.push({
              x: e.clientX,
              y: e.clientY,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed - 0.5,
              size: Math.random() * 6 + 4,
              length: Math.random() * 14 + 8,
              rotation: Math.random() * Math.PI * 2,
              vRot: (Math.random() - 0.5) * 0.1,
              alpha: 1.0,
              decay: Math.random() * 0.02 + 0.01,
              color: Math.random() > 0.3 ? flowerPal.petal : flowerPal.glow
            });
          }
        }
      }
    };

    const handleMouseUp = () => {
      mouse.isClicking = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // UI Theme Background Colors
    const getThemeColors = (t) => {
      switch (t) {
        case 'emerald':
          return { bg: '#06120e', grad1: 'rgba(16, 185, 129, 0.22)', grad2: 'rgba(6, 182, 212, 0.18)', line: 'rgba(16, 185, 129, 0.3)', particle: 'rgba(52, 211, 153, 0.9)', glow: '#10b981' };
        case 'sunset':
          return { bg: '#140b12', grad1: 'rgba(244, 63, 94, 0.22)', grad2: 'rgba(251, 146, 60, 0.18)', line: 'rgba(244, 63, 94, 0.3)', particle: 'rgba(251, 113, 133, 0.9)', glow: '#f43f5e' };
        case 'crimson':
          return { bg: '#070709', grad1: 'rgba(239, 68, 68, 0.22)', grad2: 'rgba(153, 27, 27, 0.18)', line: 'rgba(239, 68, 68, 0.3)', particle: 'rgba(255, 60, 80, 0.9)', glow: '#ef4444' };
        case 'nebula':
          return { bg: '#0f0a1c', grad1: 'rgba(217, 70, 239, 0.22)', grad2: 'rgba(139, 92, 246, 0.2)', line: 'rgba(217, 70, 239, 0.3)', particle: 'rgba(232, 121, 249, 0.9)', glow: '#d946ef' };
        case 'ocean':
          return { bg: '#051329', grad1: 'rgba(14, 165, 233, 0.22)', grad2: 'rgba(59, 130, 246, 0.2)', line: 'rgba(14, 165, 233, 0.3)', particle: 'rgba(125, 211, 252, 0.9)', glow: '#0284c7' };
        case 'amber':
          return { bg: '#171008', grad1: 'rgba(245, 158, 11, 0.22)', grad2: 'rgba(239, 68, 68, 0.18)', line: 'rgba(245, 158, 11, 0.3)', particle: 'rgba(253, 224, 71, 0.9)', glow: '#f59e0b' };
        case 'noir':
          return { bg: '#000000', grad1: 'rgba(255, 255, 255, 0.15)', grad2: 'rgba(161, 161, 170, 0.12)', line: 'rgba(255, 255, 255, 0.25)', particle: 'rgba(255, 255, 255, 0.9)', glow: '#ffffff' };
        case 'midnight':
        default:
          return { bg: '#0b0f19', grad1: 'rgba(99, 102, 241, 0.22)', grad2: 'rgba(168, 85, 247, 0.2)', line: 'rgba(99, 102, 241, 0.3)', particle: 'rgba(129, 140, 248, 0.9)', glow: '#6366f1' };
      }
    };

    // Particle mesh background
    const numParticles = Math.min(Math.floor(width * 0.045), 50);
    const particles = [];
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2.2 + 1,
        alpha: Math.random() * 0.5 + 0.4
      });
    }

    // MAIN RENDER LOOP
    const draw = () => {
      const themePal = getThemeColors(theme);
      const flowerPal = getFlowerPalette(flowerTheme);
      const effectiveBg = bgColor || themePal.bg;

      // Smooth cursor lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.18;
      mouse.y += (mouse.targetY - mouse.y) * 0.18;

      const mouseDist = Math.sqrt(
        (mouse.x - mouse.lastX) * (mouse.x - mouse.lastX) +
          (mouse.y - mouse.lastY) * (mouse.y - mouse.lastY)
      );

      ctx.clearRect(0, 0, width, height);

      // Base fill
      ctx.fillStyle = effectiveBg;
      ctx.fillRect(0, 0, width, height);

      // Ambient radial space glow
      const g1 = ctx.createRadialGradient(width * 0.3, height * 0.3, 0, width * 0.3, height * 0.3, width * 0.55);
      g1.addColorStop(0, themePal.grad1);
      g1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      const g2 = ctx.createRadialGradient(width * 0.7, height * 0.7, 0, width * 0.7, height * 0.7, width * 0.55);
      g2.addColorStop(0, themePal.grad2);
      g2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);

      // Particle mesh background
      if (bgAnimMode === 'particles' || bgAnimMode === 'hybrid') {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = themePal.line.replace('0.3', (0.2 * (1 - dist / 120)).toString());
              ctx.lineWidth = 0.7;
              ctx.stroke();
            }
          }
        }

        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = themePal.particle;
          ctx.shadowColor = themePal.glow;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }

      // Draw click shockwaves
      for (let i = clickRingsRef.current.length - 1; i >= 0; i--) {
        const ring = clickRingsRef.current[i];
        ring.radius += 7.5;
        ring.alpha -= 0.032;

        if (ring.alpha <= 0 || ring.radius >= ring.maxRadius) {
          clickRingsRef.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
        ctx.strokeStyle = ring.color;
        ctx.globalAlpha = ring.alpha;
        ctx.lineWidth = 2.8;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      }

      // SPAWN CURSOR FLOWER TRAIL ACCORDING TO MOUSE MOVEMENT
      if ((bgAnimMode === 'flowers' || bgAnimMode === 'hybrid') && mouseDist > 12 / flowerDensity) {
        bloomingFlowersRef.current.push({
          x: mouse.x,
          y: mouse.y,
          radius: 0,
          maxRadius: (Math.random() * 14 + 16) * flowerSize,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.03,
          petalCount: Math.floor(Math.random() * 3) + 5,
          alpha: 1.0,
          decay: Math.random() * 0.012 + 0.008,
          color: flowerPal.primary,
          secondaryColor: flowerPal.secondary,
          pistilColor: flowerPal.pistil
        });

        // Spawn drifting petal sparks along cursor path
        if (enablePetalSparks && Math.random() < 0.6) {
          driftingPetalsRef.current.push({
            x: mouse.x,
            y: mouse.y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2 - 0.5,
            size: Math.random() * 5 + 3,
            length: Math.random() * 10 + 6,
            rotation: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.08,
            alpha: 1.0,
            decay: Math.random() * 0.02 + 0.012,
            color: Math.random() > 0.4 ? flowerPal.petal : flowerPal.glow
          });
        }

        mouse.lastX = mouse.x;
        mouse.lastY = mouse.y;
      }

      // -------------------------------------------------------------
      // RENDER BLOOMING FLOWERS TRAIL
      // -------------------------------------------------------------
      if (bgAnimMode === 'flowers' || bgAnimMode === 'hybrid') {
        for (let i = bloomingFlowersRef.current.length - 1; i >= 0; i--) {
          const fl = bloomingFlowersRef.current[i];

          // Grow radius & rotate
          fl.radius += (fl.maxRadius - fl.radius) * 0.12;
          fl.rotation += fl.vRot;
          fl.alpha -= fl.decay;

          if (fl.alpha <= 0) {
            bloomingFlowersRef.current.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.translate(fl.x, fl.y);
          ctx.rotate(fl.rotation);
          ctx.globalAlpha = fl.alpha;

          // Draw Flower Petals (5 to 8 layered petals)
          const angleStep = (Math.PI * 2) / fl.petalCount;
          for (let p = 0; p < fl.petalCount; p++) {
            ctx.save();
            ctx.rotate(p * angleStep);

            // Outer Petal Curve
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(-fl.radius * 0.5, -fl.radius * 0.8, 0, -fl.radius);
            ctx.quadraticCurveTo(fl.radius * 0.5, -fl.radius * 0.8, 0, 0);
            ctx.fillStyle = fl.color;
            ctx.fill();

            // Inner Petal Layer Highlight
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(-fl.radius * 0.3, -fl.radius * 0.5, 0, -fl.radius * 0.65);
            ctx.quadraticCurveTo(fl.radius * 0.3, -fl.radius * 0.5, 0, 0);
            ctx.fillStyle = fl.secondaryColor;
            ctx.fill();

            ctx.restore();
          }

          // Center Pistil / Stamen
          ctx.beginPath();
          ctx.arc(0, 0, fl.radius * 0.28, 0, Math.PI * 2);
          ctx.fillStyle = fl.pistilColor;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(0, 0, fl.radius * 0.15, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();

          ctx.globalAlpha = 1.0;
          ctx.restore();
        }

        // -------------------------------------------------------------
        // RENDER SWIRLING PETALS & POLLEN PARTICLES
        // -------------------------------------------------------------
        for (let i = driftingPetalsRef.current.length - 1; i >= 0; i--) {
          const pt = driftingPetalsRef.current[i];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.rotation += pt.vRot;
          pt.alpha -= pt.decay;

          if (pt.alpha <= 0) {
            driftingPetalsRef.current.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.translate(pt.x, pt.y);
          ctx.rotate(pt.rotation);
          ctx.globalAlpha = pt.alpha;

          // Petal Curve
          ctx.beginPath();
          ctx.moveTo(0, -pt.length / 2);
          ctx.quadraticCurveTo(pt.size, 0, 0, pt.length / 2);
          ctx.quadraticCurveTo(-pt.size, 0, 0, -pt.length / 2);
          ctx.fillStyle = pt.color;
          ctx.fill();

          // Petal Center Vein
          ctx.beginPath();
          ctx.moveTo(0, -pt.length / 2);
          ctx.lineTo(0, pt.length / 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 0.8;
          ctx.stroke();

          ctx.globalAlpha = 1.0;
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    theme,
    bgColor,
    enableCursorFx,
    bgAnimMode,
    flowerTheme,
    flowerSize,
    flowerDensity,
    enablePetalSparks
  ]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
}

// Flower Color Palettes
function getFlowerPalette(ft) {
  switch (ft) {
    case 'rose':
      return {
        primary: '#ef4444',
        secondary: '#dc2626',
        pistil: '#facc15',
        glow: '#f87171',
        petal: '#f87171'
      };
    case 'sunflower':
      return {
        primary: '#fbbf24',
        secondary: '#f59e0b',
        pistil: '#78350f',
        glow: '#fde047',
        petal: '#fbbf24'
      };
    case 'lotus':
      return {
        primary: '#c084fc',
        secondary: '#9333ea',
        pistil: '#38bdf8',
        glow: '#e879f9',
        petal: '#c084fc'
      };
    case 'emerald':
      return {
        primary: '#34d399',
        secondary: '#10b981',
        pistil: '#fde047',
        glow: '#6ee7b7',
        petal: '#34d399'
      };
    case 'sakura':
    default:
      return {
        primary: '#f472b6',
        secondary: '#ec4899',
        pistil: '#fef08a',
        glow: '#fbcfe8',
        petal: '#f472b6'
      };
  }
}
