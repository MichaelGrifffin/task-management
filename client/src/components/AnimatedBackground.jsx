import React, { useEffect, useRef } from 'react';

export default function AnimatedBackground({
  theme = 'midnight',
  bgColor = null,
  enableCursorFx = true,
  bgAnimMode = 'dragon', // 'dragon' | 'particles' | 'hybrid'
  dragonTheme = 'inferno', // 'inferno' | 'jade' | 'void' | 'solar' | 'frost'
  dragonSize = 1.0, // 0.7 to 1.5 multiplier
  dragonSpeed = 1.0, // 0.6 to 1.8 multiplier
  enableFireBreath = true
}) {
  const canvasRef = useRef(null);
  const clickRingsRef = useRef([]);
  const fireParticlesRef = useRef([]);

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
      isClicking: false
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
        mouse.active = true;
      }
    };

    const handleMouseDown = (e) => {
      mouse.isClicking = true;
      // Trigger interactive shockwave ring & fire breath explosion on click
      clickRingsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 5,
        maxRadius: 160,
        alpha: 1.0,
        color: getDragonPalette(dragonTheme).primary
      });

      // Spawn burst of fire embers towards click position
      if (enableFireBreath && (bgAnimMode === 'dragon' || bgAnimMode === 'hybrid')) {
        for (let i = 0; i < 18; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 6 + 2;
          fireParticlesRef.current.push({
            x: dragon.x,
            y: dragon.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 6 + 3,
            alpha: 1.0,
            decay: Math.random() * 0.03 + 0.015,
            color: getDragonPalette(dragonTheme).ember
          });
        }
      }
    };

    const handleMouseUp = () => {
      mouse.isClicking = false;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Color Palette Definitions for Theme Presets
    const getThemeColors = (t) => {
      switch (t) {
        case 'emerald':
          return {
            bg: '#06120e',
            grad1: 'rgba(16, 185, 129, 0.22)',
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
        case 'nebula':
          return {
            bg: '#0f0a1c',
            grad1: 'rgba(217, 70, 239, 0.22)',
            grad2: 'rgba(139, 92, 246, 0.2)',
            line: 'rgba(217, 70, 239, 0.3)',
            particle: 'rgba(232, 121, 249, 0.9)',
            glow: '#d946ef'
          };
        case 'ocean':
          return {
            bg: '#051329',
            grad1: 'rgba(14, 165, 233, 0.22)',
            grad2: 'rgba(59, 130, 246, 0.2)',
            line: 'rgba(14, 165, 233, 0.3)',
            particle: 'rgba(125, 211, 252, 0.9)',
            glow: '#0284c7'
          };
        case 'amber':
          return {
            bg: '#171008',
            grad1: 'rgba(245, 158, 11, 0.22)',
            grad2: 'rgba(239, 68, 68, 0.18)',
            line: 'rgba(245, 158, 11, 0.3)',
            particle: 'rgba(253, 224, 71, 0.9)',
            glow: '#f59e0b'
          };
        case 'noir':
          return {
            bg: '#000000',
            grad1: 'rgba(255, 255, 255, 0.15)',
            grad2: 'rgba(161, 161, 170, 0.12)',
            line: 'rgba(255, 255, 255, 0.25)',
            particle: 'rgba(255, 255, 255, 0.9)',
            glow: '#ffffff'
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

    // Dragon Element Color Palettes
    function getDragonPalette(dt) {
      switch (dt) {
        case 'jade':
          return {
            primary: '#10b981',
            secondary: '#059669',
            belly: '#a7f3d0',
            glow: '#34d399',
            eyes: '#fbbf24',
            ember: '#6ee7b7'
          };
        case 'void':
          return {
            primary: '#c084fc',
            secondary: '#7e22ce',
            belly: '#f0abfc',
            glow: '#e879f9',
            eyes: '#38bdf8',
            ember: '#f472b6'
          };
        case 'solar':
          return {
            primary: '#f59e0b',
            secondary: '#d97706',
            belly: '#fef08a',
            glow: '#fbbf24',
            eyes: '#ef4444',
            ember: '#fde047'
          };
        case 'frost':
          return {
            primary: '#38bdf8',
            secondary: '#0284c7',
            belly: '#e0f2fe',
            glow: '#7dd3fc',
            eyes: '#34d399',
            ember: '#bae6fd'
          };
        case 'inferno':
        default:
          return {
            primary: '#ef4444',
            secondary: '#b91c1c',
            belly: '#fca5a5',
            glow: '#f87171',
            eyes: '#facc15',
            ember: '#fb923c'
          };
      }
    }

    // -------------------------------------------------------------
    // DRAGON INVERSE KINEMATICS ENGINE STATE & NODES
    // -------------------------------------------------------------
    const numSegments = Math.round(20 * dragonSize);
    const baseSegDist = 16 * dragonSize;

    const dragon = {
      x: width / 2,
      y: height / 2,
      vx: 0,
      vy: 0,
      angle: 0,
      wingCycle: 0,
      segments: []
    };

    for (let i = 0; i < numSegments; i++) {
      dragon.segments.push({
        x: width / 2 - i * baseSegDist,
        y: height / 2,
        angle: 0,
        size: Math.max(3, (1 - (i / numSegments) * 0.72) * 16 * dragonSize)
      });
    }

    // Particle system creation (for background particles)
    const numParticles = Math.min(Math.floor(width * 0.045), 60);
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

    // -------------------------------------------------------------
    // MAIN CANVAS RENDER LOOP
    // -------------------------------------------------------------
    const draw = () => {
      const themePal = getThemeColors(theme);
      const dragonPal = getDragonPalette(dragonTheme);
      const effectiveBg = bgColor || themePal.bg;

      // 1. Smooth lerp mouse target
      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;

      ctx.clearRect(0, 0, width, height);

      // 2. Draw base background fill
      ctx.fillStyle = effectiveBg;
      ctx.fillRect(0, 0, width, height);

      // 3. Draw subtle corner radial gradients
      const g1 = ctx.createRadialGradient(width * 0.25, height * 0.25, 0, width * 0.25, height * 0.25, width * 0.5);
      g1.addColorStop(0, themePal.grad1);
      g1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      const g2 = ctx.createRadialGradient(width * 0.75, height * 0.75, 0, width * 0.75, height * 0.75, width * 0.5);
      g2.addColorStop(0, themePal.grad2);
      g2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);

      // 4. DRAW PARTICLE MESH (if mode is 'particles' or 'hybrid')
      if (bgAnimMode === 'particles' || bgAnimMode === 'hybrid') {
        // Connect particles with lines
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = themePal.line.replace('0.3', (0.22 * (1 - dist / 120)).toString());
              ctx.lineWidth = 0.7;
              ctx.stroke();
            }
          }
        }

        // Update & draw background particles
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

      // 5. UPDATE & DRAW CURSOR SHOCKWAVE CLICK RINGS
      for (let i = clickRingsRef.current.length - 1; i >= 0; i--) {
        const ring = clickRingsRef.current[i];
        ring.radius += 6;
        ring.alpha -= 0.035;

        if (ring.alpha <= 0 || ring.radius >= ring.maxRadius) {
          clickRingsRef.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
        ctx.strokeStyle = ring.color;
        ctx.globalAlpha = ring.alpha;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = ring.color;
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      }

      // 6. UPDATE & RENDER DRAGON ANIMATION (if mode is 'dragon' or 'hybrid')
      if (bgAnimMode === 'dragon' || bgAnimMode === 'hybrid') {
        const dx = mouse.x - dragon.x;
        const dy = mouse.y - dragon.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Target angle towards cursor
        const targetAngle = Math.atan2(dy, dx);
        let angleDiff = targetAngle - dragon.angle;

        // Wrap angle diff around [-PI, PI]
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

        // Steering lerp speed based on distance & user speed setting
        const turnSpeed = 0.08 * dragonSpeed;
        dragon.angle += angleDiff * turnSpeed;

        // Move head toward target with smooth acceleration
        const targetSpeed = Math.min(dist * 0.08, 12) * dragonSpeed;
        dragon.vx += (Math.cos(dragon.angle) * targetSpeed - dragon.vx) * 0.12;
        dragon.vy += (Math.sin(dragon.angle) * targetSpeed - dragon.vy) * 0.12;

        dragon.x += dragon.vx;
        dragon.y += dragon.vy;

        // Update wings flap rhythm
        const currentVelocity = Math.sqrt(dragon.vx * dragon.vx + dragon.vy * dragon.vy);
        dragon.wingCycle += (0.08 + currentVelocity * 0.015) * dragonSpeed;

        // Spawn fire breath embers from dragon head when moving fast or clicking
        if (enableFireBreath && (enableCursorFx || mouse.isClicking)) {
          const isFireActive = mouse.isClicking || (dist > 80 && Math.random() < 0.35);
          if (isFireActive) {
            const mouthDist = 24 * dragonSize;
            const mouthX = dragon.x + Math.cos(dragon.angle) * mouthDist;
            const mouthY = dragon.y + Math.sin(dragon.angle) * mouthDist;

            fireParticlesRef.current.push({
              x: mouthX + (Math.random() - 0.5) * 8,
              y: mouthY + (Math.random() - 0.5) * 8,
              vx: Math.cos(dragon.angle + (Math.random() - 0.5) * 0.5) * (Math.random() * 4 + 2),
              vy: Math.sin(dragon.angle + (Math.random() - 0.5) * 0.5) * (Math.random() * 4 + 2),
              size: Math.random() * 4 + 2,
              alpha: 1.0,
              decay: Math.random() * 0.04 + 0.02,
              color: dragonPal.ember
            });
          }
        }

        // Update articulated inverse kinematics body segments
        dragon.segments[0].x = dragon.x;
        dragon.segments[0].y = dragon.y;
        dragon.segments[0].angle = dragon.angle;

        for (let i = 1; i < dragon.segments.length; i++) {
          const prev = dragon.segments[i - 1];
          const curr = dragon.segments[i];

          const segDx = prev.x - curr.x;
          const segDy = prev.y - curr.y;
          curr.angle = Math.atan2(segDy, segDx);

          const dLen = Math.sqrt(segDx * segDx + segDy * segDy);
          const targetDist = baseSegDist;

          if (dLen > 0) {
            curr.x = prev.x - (segDx / dLen) * targetDist;
            curr.y = prev.y - (segDy / dLen) * targetDist;
          }
        }

        // DRAW DRAGON TAIL TO HEAD (Back-to-Front depth layering)
        for (let i = dragon.segments.length - 1; i >= 0; i--) {
          const seg = dragon.segments[i];
          const segRadius = seg.size;

          ctx.save();
          ctx.translate(seg.x, seg.y);
          ctx.rotate(seg.angle);

          // Render Back Dorsal Spines on segments
          if (i > 1 && i < dragon.segments.length - 2 && i % 2 === 0) {
            ctx.beginPath();
            ctx.moveTo(-segRadius * 0.5, 0);
            ctx.lineTo(0, -segRadius * 1.8);
            ctx.lineTo(segRadius * 0.5, 0);
            ctx.closePath();
            ctx.fillStyle = dragonPal.secondary;
            ctx.shadowColor = dragonPal.glow;
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
          }

          // Render Dragon Wings on Upper Torso (Segment index 3)
          if (i === 3) {
            const wingAngle = Math.sin(dragon.wingCycle) * 0.45 + 0.2;
            const wingSpan = (65 + Math.sin(dragon.wingCycle) * 15) * dragonSize;

            ctx.save();
            ctx.shadowColor = dragonPal.glow;
            ctx.shadowBlur = 16;

            // Left Wing
            ctx.save();
            ctx.rotate(-wingAngle - Math.PI / 2);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(-wingSpan * 0.6, -wingSpan * 0.4, -wingSpan, -wingSpan * 0.1);
            ctx.quadraticCurveTo(-wingSpan * 0.5, wingSpan * 0.3, 0, 0);
            ctx.fillStyle = dragonPal.primary;
            ctx.globalAlpha = 0.85;
            ctx.fill();
            ctx.strokeStyle = dragonPal.glow;
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();

            // Right Wing
            ctx.save();
            ctx.rotate(wingAngle + Math.PI / 2);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(wingSpan * 0.6, -wingSpan * 0.4, wingSpan, -wingSpan * 0.1);
            ctx.quadraticCurveTo(wingSpan * 0.5, wingSpan * 0.3, 0, 0);
            ctx.fillStyle = dragonPal.primary;
            ctx.globalAlpha = 0.85;
            ctx.fill();
            ctx.strokeStyle = dragonPal.glow;
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();

            ctx.restore();
          }

          // Segment Outer Glow Ring
          ctx.beginPath();
          ctx.arc(0, 0, segRadius, 0, Math.PI * 2);
          ctx.fillStyle = dragonPal.primary;
          ctx.shadowColor = dragonPal.glow;
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Segment Inner Belly Highlight
          ctx.beginPath();
          ctx.arc(0, 0, segRadius * 0.55, 0, Math.PI * 2);
          ctx.fillStyle = dragonPal.belly;
          ctx.fill();

          ctx.restore();
        }

        // DRAW DRAGON HEAD (Glowing Eyes, Horns, Snout, Jaw)
        const head = dragon.segments[0];
        ctx.save();
        ctx.translate(head.x, head.y);
        ctx.rotate(head.angle);

        ctx.shadowColor = dragonPal.glow;
        ctx.shadowBlur = 20;

        // Dragon Horns
        ctx.beginPath();
        ctx.moveTo(-10 * dragonSize, -6 * dragonSize);
        ctx.lineTo(-28 * dragonSize, -18 * dragonSize);
        ctx.lineTo(-6 * dragonSize, -2 * dragonSize);
        ctx.fillStyle = dragonPal.secondary;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-10 * dragonSize, 6 * dragonSize);
        ctx.lineTo(-28 * dragonSize, 18 * dragonSize);
        ctx.lineTo(-6 * dragonSize, 2 * dragonSize);
        ctx.fillStyle = dragonPal.secondary;
        ctx.fill();

        // Main Dragon Head Silhouette
        ctx.beginPath();
        ctx.moveTo(-14 * dragonSize, -12 * dragonSize);
        ctx.lineTo(22 * dragonSize, -6 * dragonSize);
        ctx.lineTo(26 * dragonSize, 0);
        ctx.lineTo(22 * dragonSize, 6 * dragonSize);
        ctx.lineTo(-14 * dragonSize, 12 * dragonSize);
        ctx.closePath();
        ctx.fillStyle = dragonPal.primary;
        ctx.fill();

        // Glowing Dragon Eyes
        ctx.beginPath();
        ctx.arc(8 * dragonSize, -6 * dragonSize, 3.5 * dragonSize, 0, Math.PI * 2);
        ctx.arc(8 * dragonSize, 6 * dragonSize, 3.5 * dragonSize, 0, Math.PI * 2);
        ctx.fillStyle = dragonPal.eyes;
        ctx.shadowColor = dragonPal.eyes;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.restore();
      }

      // 7. UPDATE & RENDER FIRE SPARKS / EMBERS
      for (let i = fireParticlesRef.current.length - 1; i >= 0; i--) {
        const p = fireParticlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          fireParticlesRef.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
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
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    theme,
    bgColor,
    enableCursorFx,
    bgAnimMode,
    dragonTheme,
    dragonSize,
    dragonSpeed,
    enableFireBreath
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
