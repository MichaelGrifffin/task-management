import React, { useEffect, useRef } from 'react';

export default function AnimatedBackground({ theme = 'midnight', bgColor = null, enableCursorFx = true }) {
  const canvasRef = useRef(null);

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
      active: false,
      radius: 160
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;

      // Spawn interactive cursor trail spark
      if (enableCursorFx && Math.random() < 0.4) {
        trailSparks.push({
          x: e.clientX + (Math.random() - 0.5) * 8,
          y: e.clientY + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
          size: Math.random() * 2.5 + 1,
          alpha: 1.0,
          decay: Math.random() * 0.03 + 0.02
        });
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
        mouse.active = true;
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Theme Color Configuration map (8 Themes)
    const getThemeColors = (t) => {
      switch (t) {
        case 'emerald':
          return {
            bg: '#06120e',
            grad1: 'rgba(16, 185, 129, 0.22)',
            grad2: 'rgba(6, 182, 212, 0.18)',
            line: 'rgba(16, 185, 129, 0.3)',
            particle: 'rgba(52, 211, 153, 0.9)',
            glow: '#10b981',
            cursorGlow: 'rgba(16, 185, 129, 0.28)'
          };
        case 'sunset':
          return {
            bg: '#140b12',
            grad1: 'rgba(244, 63, 94, 0.22)',
            grad2: 'rgba(251, 146, 60, 0.18)',
            line: 'rgba(244, 63, 94, 0.3)',
            particle: 'rgba(251, 113, 133, 0.9)',
            glow: '#f43f5e',
            cursorGlow: 'rgba(244, 63, 94, 0.28)'
          };
        case 'crimson':
          return {
            bg: '#070709',
            grad1: 'rgba(239, 68, 68, 0.22)',
            grad2: 'rgba(153, 27, 27, 0.18)',
            line: 'rgba(239, 68, 68, 0.3)',
            particle: 'rgba(255, 60, 80, 0.9)',
            glow: '#ef4444',
            cursorGlow: 'rgba(239, 68, 68, 0.28)'
          };
        case 'nebula':
          return {
            bg: '#0f0a1c',
            grad1: 'rgba(217, 70, 239, 0.22)',
            grad2: 'rgba(139, 92, 246, 0.2)',
            line: 'rgba(217, 70, 239, 0.3)',
            particle: 'rgba(232, 121, 249, 0.9)',
            glow: '#d946ef',
            cursorGlow: 'rgba(217, 70, 239, 0.28)'
          };
        case 'ocean':
          return {
            bg: '#051329',
            grad1: 'rgba(14, 165, 233, 0.22)',
            grad2: 'rgba(59, 130, 246, 0.2)',
            line: 'rgba(14, 165, 233, 0.3)',
            particle: 'rgba(125, 211, 252, 0.9)',
            glow: '#0284c7',
            cursorGlow: 'rgba(14, 165, 233, 0.28)'
          };
        case 'amber':
          return {
            bg: '#171008',
            grad1: 'rgba(245, 158, 11, 0.22)',
            grad2: 'rgba(239, 68, 68, 0.18)',
            line: 'rgba(245, 158, 11, 0.3)',
            particle: 'rgba(253, 224, 71, 0.9)',
            glow: '#f59e0b',
            cursorGlow: 'rgba(245, 158, 11, 0.28)'
          };
        case 'noir':
          return {
            bg: '#000000',
            grad1: 'rgba(255, 255, 255, 0.15)',
            grad2: 'rgba(161, 161, 170, 0.12)',
            line: 'rgba(255, 255, 255, 0.25)',
            particle: 'rgba(255, 255, 255, 0.9)',
            glow: '#ffffff',
            cursorGlow: 'rgba(255, 255, 255, 0.2)'
          };
        case 'midnight':
        default:
          return {
            bg: '#0b0f19',
            grad1: 'rgba(99, 102, 241, 0.22)',
            grad2: 'rgba(168, 85, 247, 0.2)',
            line: 'rgba(99, 102, 241, 0.3)',
            particle: 'rgba(129, 140, 248, 0.9)',
            glow: '#6366f1',
            cursorGlow: 'rgba(99, 102, 241, 0.28)'
          };
      }
    };

    // Particle system creation
    const numParticles = Math.min(Math.floor(width * 0.048), 70);
    const particles = [];

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2.2 + 1,
        alpha: Math.random() * 0.5 + 0.4,
        baseVx: (Math.random() - 0.5) * 0.5,
        baseVy: (Math.random() - 0.5) * 0.5
      });
    }

    // Cursor interactive trail sparks array
    const trailSparks = [];

    const draw = () => {
      const palette = getThemeColors(theme);
      const effectiveBg = bgColor || palette.bg;

      // Smooth lerp mouse position
      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw base background overlay
      ctx.fillStyle = effectiveBg;
      ctx.fillRect(0, 0, width, height);

      // 2. Original glowing radial gradient pulses in opposite corners
      const g1 = ctx.createRadialGradient(width * 0.2, height * 0.25, 0, width * 0.2, height * 0.25, width * 0.45);
      g1.addColorStop(0, palette.grad1);
      g1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      const g2 = ctx.createRadialGradient(width * 0.8, height * 0.75, 0, width * 0.8, height * 0.75, width * 0.45);
      g2.addColorStop(0, palette.grad2);
      g2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);

      // 3. CURSOR SPOTLIGHT ANIMATION (Interactive cursor glow)
      if (enableCursorFx && mouse.active) {
        const cursorSpot = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 220);
        cursorSpot.addColorStop(0, palette.cursorGlow);
        cursorSpot.addColorStop(0.5, palette.cursorGlow.replace('0.28', '0.08'));
        cursorSpot.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = cursorSpot;
        ctx.fillRect(0, 0, width, height);
      }

      // 4. Connect particles with subtle lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = palette.line.replace('0.3', (0.28 * (1 - dist / 130)).toString());
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // 5. INTERACTIVE CURSOR TO PARTICLE MESH CONNECTIONS & REPULSION
      particles.forEach((p) => {
        // Cursor proximity check
        if (enableCursorFx && mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            // Draw interactive beam line between cursor and nearby particle
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(p.x, p.y);
            const lineAlpha = (1 - dist / mouse.radius) * 0.45;
            ctx.strokeStyle = palette.particle.replace('0.9', lineAlpha.toString());
            ctx.lineWidth = 1.2;
            ctx.stroke();

            // Gentle physical magnetic reaction: push particle away slightly from cursor
            const angle = Math.atan2(dy, dx);
            const force = (mouse.radius - dist) / mouse.radius;
            p.x -= Math.cos(angle) * force * 1.5;
            p.y -= Math.sin(angle) * force * 1.5;
          }
        }

        // Particle physics update & bouncing
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = palette.particle;
        ctx.shadowColor = palette.glow;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 6. CURSOR TRAIL SPARKS ANIMATION
      if (enableCursorFx && trailSparks.length > 0) {
        for (let i = trailSparks.length - 1; i >= 0; i--) {
          const s = trailSparks[i];
          s.x += s.vx;
          s.y += s.vy;
          s.alpha -= s.decay;

          if (s.alpha <= 0) {
            trailSparks.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fillStyle = palette.glow;
          ctx.globalAlpha = s.alpha;
          ctx.shadowColor = palette.glow;
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1.0;
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, bgColor, enableCursorFx]);

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
