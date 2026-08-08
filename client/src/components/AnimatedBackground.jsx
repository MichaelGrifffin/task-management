import React, { useEffect, useRef, useState } from 'react';

export default function AnimatedBackground({
  theme = 'midnight',
  bgColor = null,
  enableCursorFx = true,
  bgAnimMode = 'griffin', // 'griffin' | 'particles' | 'hybrid'
  griffinTheme = 'golden', // 'golden' | 'silver' | 'crimson' | 'void' | 'emerald'
  griffinSize = 1.0, // 0.7 to 1.5 multiplier
  griffinSpeed = 1.0, // 0.6 to 1.8 multiplier
  enableFeatherSparks = true
}) {
  const canvasRef = useRef(null);
  const clickRingsRef = useRef([]);
  const featherParticlesRef = useRef([]);

  // State for SVG Griffin position & physics
  const [griffinTransform, setGriffinTransform] = useState({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 300,
    angle: 0,
    rollAngle: 0,
    wingAngle: 0
  });

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

    const griffin = {
      x: width / 2,
      y: height / 2,
      vx: 0,
      vy: 0,
      angle: 0,
      rollAngle: 0,
      wingCycle: 0
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

      // Spawn interactive sky sunbeam ring on click
      clickRingsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 5,
        maxRadius: 220,
        alpha: 1.0,
        color: getGriffinPalette(griffinTheme).featherGlow
      });

      // Spawn realistic falling golden feathers & stardust on click
      if (enableFeatherSparks && (bgAnimMode === 'griffin' || bgAnimMode === 'hybrid')) {
        for (let i = 0; i < 24; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 6.5 + 2;
          featherParticlesRef.current.push({
            x: griffin.x,
            y: griffin.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 6 + 3,
            length: Math.random() * 12 + 8,
            rotation: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.1,
            alpha: 1.0,
            decay: Math.random() * 0.025 + 0.012,
            color: Math.random() > 0.4 ? getGriffinPalette(griffinTheme).featherGlow : getGriffinPalette(griffinTheme).eaglePrimary
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

    // UI Theme Backgrounds
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

    // Background particle system
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
      const griffinPal = getGriffinPalette(griffinTheme);
      const effectiveBg = bgColor || themePal.bg;

      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;

      ctx.clearRect(0, 0, width, height);

      // Base background
      ctx.fillStyle = effectiveBg;
      ctx.fillRect(0, 0, width, height);

      // Radial background glows
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

      // Draw click sunbeams
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
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      }

      // Update Griffin Flight Physics
      if (bgAnimMode === 'griffin' || bgAnimMode === 'hybrid') {
        const dx = mouse.x - griffin.x;
        const dy = mouse.y - griffin.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const targetAngle = Math.atan2(dy, dx);
        let angleDiff = targetAngle - griffin.angle;

        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

        const turnSpeed = 0.08 * griffinSpeed;
        griffin.angle += angleDiff * turnSpeed;

        const targetRoll = Math.max(-0.35, Math.min(0.35, angleDiff * 1.2));
        griffin.rollAngle += (targetRoll - griffin.rollAngle) * 0.1;

        const targetSpeed = Math.min(dist * 0.075, 11) * griffinSpeed;
        griffin.vx += (Math.cos(griffin.angle) * targetSpeed - griffin.vx) * 0.12;
        griffin.vy += (Math.sin(griffin.angle) * targetSpeed - griffin.vy) * 0.12;

        griffin.x += griffin.vx;
        griffin.y += griffin.vy;

        const flightVelocity = Math.sqrt(griffin.vx * griffin.vx + griffin.vy * griffin.vy);
        griffin.wingCycle += (0.065 + flightVelocity * 0.014) * griffinSpeed;

        // Spawn falling golden feathers & stardust while gliding
        if (enableFeatherSparks && (enableCursorFx || mouse.isClicking)) {
          if (mouse.isClicking || (dist > 60 && Math.random() < 0.35)) {
            featherParticlesRef.current.push({
              x: griffin.x - Math.cos(griffin.angle) * 40,
              y: griffin.y - Math.sin(griffin.angle) * 40,
              vx: (Math.random() - 0.5) * 2.2,
              vy: (Math.random() - 0.5) * 2.2,
              size: Math.random() * 4 + 2,
              length: Math.random() * 10 + 6,
              rotation: Math.random() * Math.PI * 2,
              vRot: (Math.random() - 0.5) * 0.08,
              alpha: 1.0,
              decay: Math.random() * 0.03 + 0.015,
              color: griffinPal.featherGlow
            });
          }
        }

        // Sync SVG Transform
        setGriffinTransform({
          x: griffin.x,
          y: griffin.y,
          angle: (griffin.angle * 180) / Math.PI,
          rollAngle: (griffin.rollAngle * 180) / Math.PI,
          wingAngle: Math.sin(griffin.wingCycle) * 16
        });
      }

      // Draw Falling Feathers
      for (let i = featherParticlesRef.current.length - 1; i >= 0; i--) {
        const p = featherParticlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          featherParticlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        ctx.beginPath();
        ctx.moveTo(0, -p.length / 2);
        ctx.quadraticCurveTo(p.size, 0, 0, p.length / 2);
        ctx.quadraticCurveTo(-p.size, 0, 0, -p.length / 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(0, -p.length / 2);
        ctx.lineTo(0, p.length / 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.globalAlpha = 1.0;
        ctx.restore();
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
    griffinTheme,
    griffinSize,
    griffinSpeed,
    enableFeatherSparks
  ]);

  const pal = getGriffinPalette(griffinTheme);
  const scale = griffinSize * 0.85;

  return (
    <>
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

      {/* HIGH-RESOLUTION SVG VECTOR GRIFFIN ENGINE (MATCHING IMAGE 2 EXACTLY) */}
      {(bgAnimMode === 'griffin' || bgAnimMode === 'hybrid') && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: 0,
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 320,
              height: 320,
              transform: `translate3d(${griffinTransform.x - 160}px, ${
                griffinTransform.y - 160
              }px, 0px) scale(${scale}) rotate(${
                griffinTransform.angle + griffinTransform.rollAngle * 0.4
              }deg)`,
              transformOrigin: '160px 160px',
              willChange: 'transform',
              filter: `drop-shadow(0 0 16px ${pal.featherGlow})`
            }}
          >
            <svg
              width="320"
              height="320"
              viewBox="0 0 320 320"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="beakGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={pal.beak} />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={pal.eaglePrimary} />
                  <stop offset="60%" stopColor={pal.lionBody} />
                  <stop offset="100%" stopColor={pal.lionShade} />
                </linearGradient>
                <linearGradient id="wingGradNear" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={pal.featherGlow} />
                  <stop offset="50%" stopColor={pal.eaglePrimary} />
                  <stop offset="100%" stopColor={pal.eagleSecondary} />
                </linearGradient>
                <linearGradient id="wingGradFar" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={pal.eaglePrimary} />
                  <stop offset="70%" stopColor={pal.eagleSecondary} />
                  <stop offset="100%" stopColor={pal.lionShade} />
                </linearGradient>
              </defs>

              {/* 1. FAR WING (BEHIND BODY) */}
              <g
                style={{
                  transform: `rotate(${-griffinTransform.wingAngle - 10}deg)`,
                  transformOrigin: '130px 140px',
                  transition: 'transform 0.05s linear'
                }}
              >
                {/* Upper Primary Feathers */}
                <path
                  d="M130 140 C110 80, 60 40, 20 20 C40 60, 70 100, 100 130 Z"
                  fill="url(#wingGradFar)"
                />
                <path
                  d="M130 140 C100 70, 50 30, 10 15 C30 55, 65 95, 95 125 Z"
                  fill={pal.wingQuills}
                  opacity="0.8"
                />
                {/* Layered Wing Feather Lines */}
                <path d="M40 35 Q70 70 110 120" stroke={pal.eagleSecondary} strokeWidth="2.5" />
                <path d="M55 50 Q80 80 118 125" stroke={pal.eagleSecondary} strokeWidth="2" />
                <path d="M70 65 Q90 90 125 130" stroke={pal.eagleSecondary} strokeWidth="2" />
              </g>

              {/* 2. LION TAIL (S-CURVE WITH BUSHY TIP) */}
              <path
                d="M100 170 C70 185, 40 160, 30 190 C20 220, 55 240, 45 260"
                stroke={pal.lionBody}
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />
              {/* Tail Tuft */}
              <path
                d="M45 260 C35 270, 20 275, 10 265 C15 250, 30 245, 45 260 Z"
                fill={pal.eaglePrimary}
              />
              <path d="M45 260 L20 270 M45 260 L25 258" stroke={pal.eagleSecondary} strokeWidth="2" />

              {/* 3. LION REAR LEGS & THIGHS */}
              <path
                d="M95 160 C75 165, 65 190, 80 215 C85 225, 100 220, 105 200 C110 180, 110 165, 95 160 Z"
                fill={pal.lionShade}
              />
              {/* Rear Lion Paw */}
              <path d="M80 215 Q70 225 60 220" stroke={pal.lionShade} strokeWidth="6" strokeLinecap="round" />

              {/* 4. MAIN GRIFFIN TORSO & EAGLE CHEST */}
              <path
                d="M90 150 C110 140, 150 135, 180 145 C200 155, 210 175, 190 195 C160 205, 110 200, 90 180 C80 170, 80 155, 90 150 Z"
                fill="url(#bodyGrad)"
              />

              {/* Neck & Chest Hackle Feathers */}
              <path
                d="M170 142 C160 155, 165 175, 185 185 M160 140 C150 155, 155 170, 175 180 M150 140 C140 152, 145 165, 165 175"
                stroke={pal.eagleSecondary}
                strokeWidth="3"
                fill="none"
              />

              {/* 5. FRONT EAGLE LEGS & OBSIDIAN TALONS */}
              {/* Front Right Leg */}
              <path d="M185 180 L205 220 L220 230" stroke={pal.talons} strokeWidth="8" strokeLinecap="round" fill="none" />
              {/* Front Left Leg */}
              <path d="M175 185 L190 230 L205 242" stroke={pal.talons} strokeWidth="8" strokeLinecap="round" fill="none" />

              {/* Sharp Obsidian Claws */}
              <path d="M220 230 L235 228 M220 230 L234 236 M220 230 L226 242" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
              <path d="M205 242 L220 240 M205 242 L218 248 M205 242 L210 252" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />

              {/* 6. NOBLE EAGLE HEAD & HOOKED GOLDEN BEAK */}
              {/* Eagle Crown Feather Crest */}
              <path
                d="M185 130 C165 110, 140 100, 120 95 C145 115, 170 125, 190 135 Z"
                fill={pal.eagleSecondary}
              />
              <path
                d="M190 128 C175 112, 155 105, 135 102 C155 120, 175 128, 195 136 Z"
                fill={pal.eaglePrimary}
              />

              {/* Eagle Head Contour */}
              <path
                d="M180 140 C190 120, 220 115, 240 130 C250 140, 245 155, 220 165 C195 170, 175 160, 180 140 Z"
                fill={pal.eaglePrimary}
              />

              {/* Hooked Golden Eagle Beak */}
              <path
                d="M235 130 Q270 135 275 155 Q245 165 230 155 Z"
                fill="url(#beakGrad)"
              />
              <path d="M235 145 L268 147" stroke="#78350f" strokeWidth="2.5" />
              {/* Nostril Slit */}
              <ellipse cx="245" cy="138" rx="3" ry="1.5" fill="#78350f" transform="rotate(-10 245 138)" />

              {/* Fierce Eagle Eye & Brow */}
              <path d="M210 128 L230 130" stroke={pal.eagleSecondary} strokeWidth="3.5" />
              <circle cx="222" cy="138" r="7" fill={pal.eyes} />
              <circle cx="223" cy="138" r="3.5" fill="#0f172a" />
              <circle cx="225" cy="136" r="1.5" fill="#ffffff" />

              {/* 7. NEAR FOREGROUND WING (IN FRONT OF BODY - MATCHING IMAGE 2) */}
              <g
                style={{
                  transform: `rotate(${griffinTransform.wingAngle}deg)`,
                  transformOrigin: '145px 145px',
                  transition: 'transform 0.05s linear'
                }}
              >
                {/* Main Soaring Wing Blade */}
                <path
                  d="M145 145 C120 70, 60 20, 10 0 C40 50, 85 100, 125 135 Z"
                  fill="url(#wingGradNear)"
                />
                <path
                  d="M145 145 C115 60, 55 15, 5 0 C30 45, 75 90, 118 130 Z"
                  fill={pal.wingQuills}
                  opacity="0.85"
                />

                {/* Primary Feather Lines & Quills */}
                <path d="M30 20 Q65 60 115 115" stroke={pal.eagleSecondary} strokeWidth="3" />
                <path d="M45 35 Q80 75 125 125" stroke={pal.eagleSecondary} strokeWidth="2.5" />
                <path d="M65 55 Q95 90 135 132" stroke={pal.eagleSecondary} strokeWidth="2" />
                <path d="M85 75 Q110 105 140 138" stroke={pal.eagleSecondary} strokeWidth="2" />

                {/* Outer Feather Tip Teeth */}
                <path
                  d="M10 0 L25 15 M25 10 L40 25 M40 20 L55 38 M55 33 L70 52 M70 47 L85 68"
                  stroke={pal.eaglePrimary}
                  strokeWidth="2.5"
                />
              </g>
            </svg>
          </div>
        </div>
      )}
    </>
  );
}

// Color Palettes
function getGriffinPalette(gt) {
  switch (gt) {
    case 'silver':
      return {
        eaglePrimary: '#f1f5f9',
        eagleSecondary: '#cbd5e1',
        lionBody: '#94a3b8',
        lionShade: '#64748b',
        beak: '#fbbf24',
        eyes: '#38bdf8',
        featherGlow: '#7dd3fc',
        wingQuills: '#ffffff',
        talons: '#e2e8f0'
      };
    case 'crimson':
      return {
        eaglePrimary: '#dc2626',
        eagleSecondary: '#991b1b',
        lionBody: '#ea580c',
        lionShade: '#c2410c',
        beak: '#facc15',
        eyes: '#fef08a',
        featherGlow: '#f87171',
        wingQuills: '#ef4444',
        talons: '#fbbf24'
      };
    case 'void':
      return {
        eaglePrimary: '#9333ea',
        eagleSecondary: '#6b21a8',
        lionBody: '#334155',
        lionShade: '#1e293b',
        beak: '#06b6d4',
        eyes: '#f0abfc',
        featherGlow: '#e879f9',
        wingQuills: '#c084fc',
        talons: '#38bdf8'
      };
    case 'emerald':
      return {
        eaglePrimary: '#059669',
        eagleSecondary: '#047857',
        lionBody: '#b45309',
        lionShade: '#78350f',
        beak: '#fbbf24',
        eyes: '#34d399',
        featherGlow: '#6ee7b7',
        wingQuills: '#10b981',
        talons: '#f59e0b'
      };
    case 'golden':
    default:
      return {
        eaglePrimary: '#f59e0b',
        eagleSecondary: '#d97706',
        lionBody: '#d97706',
        lionShade: '#92400e',
        beak: '#fbbf24',
        eyes: '#ef4444',
        featherGlow: '#fde047',
        wingQuills: '#fef08a',
        talons: '#fbbf24'
      };
  }
}
