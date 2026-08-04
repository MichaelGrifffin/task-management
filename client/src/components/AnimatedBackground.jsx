import React, { useEffect, useRef } from 'react';

export default function AnimatedBackground({ theme = 'midnight' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Color theme configs
    const getThemeColors = (t) => {
      switch (t) {
        case 'emerald':
          return {
            bg: '#06120e',
            grad1: 'rgba(16, 185, 129, 0.2)',
            grad2: 'rgba(6, 182, 212, 0.18)',
            line: 'rgba(16, 185, 129, 0.3)',
            particle: 'rgba(52, 211, 153, 0.9)',
            glow: '#10b981'
          };
        case 'sunset':
          return {
            bg: '#140b12',
            grad1: 'rgba(244, 63, 94, 0.22)',
            grad2: 'rgba(251, 146, 60, 0.18)',
            line: 'rgba(244, 63, 94, 0.3)',
            particle: 'rgba(251, 113, 133, 0.9)',
            glow: '#f43f5e'
          };
        case 'crimson':
          return {
            bg: '#070709',
            grad1: 'rgba(239, 68, 68, 0.22)',
            grad2: 'rgba(153, 27, 27, 0.18)',
            line: 'rgba(239, 68, 68, 0.3)',
            particle: 'rgba(255, 60, 80, 0.9)',
            glow: '#ef4444'
          };
        case 'midnight':
        default:
          return {
            bg: '#0b0f19',
            grad1: 'rgba(99, 102, 241, 0.22)',
            grad2: 'rgba(168, 85, 247, 0.2)',
            line: 'rgba(99, 102, 241, 0.3)',
            particle: 'rgba(129, 140, 248, 0.9)',
            glow: '#6366f1'
          };
      }
    };

    // Particle system
    const numParticles = Math.min(Math.floor(width * 0.045), 65);
    const particles = [];

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2.2 + 1,
        alpha: Math.random() * 0.5 + 0.4
      });
    }

    const draw = () => {
      const palette = getThemeColors(theme);

      ctx.clearRect(0, 0, width, height);

      // Draw background overlay
      ctx.fillStyle = palette.bg;
      ctx.fillRect(0, 0, width, height);

      // Draw glowing radial gradient pulses in opposite corners
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

      // Connect particles with subtle lines
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

      // Render & update particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = palette.particle;
        ctx.shadowColor = palette.glow;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

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
