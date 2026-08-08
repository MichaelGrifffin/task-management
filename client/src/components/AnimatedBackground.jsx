import React, { useEffect, useRef } from 'react';

export default function AnimatedBackground({
  theme = 'midnight',
  bgColor = null,
  enableCursorFx = true,
  bgAnimMode = 'particles' // 'particles' | 'none'
}) {
  const canvasRef = useRef(null);
  const clickRingsRef = useRef([]);

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
      targetY: height / 2
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleMouseDown = (e) => {
      if (!enableCursorFx) return;
      clickRingsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 5,
        maxRadius: 180,
        alpha: 1.0
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);

    // UI Theme Color Definitions
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

    // Particle Mesh Grid System
    const numParticles = Math.min(Math.floor(width * 0.045), 55);
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

    // MAIN CANVAS RENDER LOOP
    const draw = () => {
      const themePal = getThemeColors(theme);
      const effectiveBg = bgColor || themePal.bg;

      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;

      ctx.clearRect(0, 0, width, height);

      // Base background fill
      ctx.fillStyle = effectiveBg;
      ctx.fillRect(0, 0, width, height);

      // Radial ambient background glow
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
      if (bgAnimMode !== 'none') {
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
        ctx.strokeStyle = themePal.glow;
        ctx.globalAlpha = ring.alpha;
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, bgColor, enableCursorFx, bgAnimMode]);

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
