import React, { useEffect, useRef } from 'react';

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
      // Trigger interactive sunbeam shockwave ring on click
      clickRingsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 5,
        maxRadius: 180,
        alpha: 1.0,
        color: getGriffinPalette(griffinTheme).featherGlow
      });

      // Burst of glowing golden feather sparks on click
      if (enableFeatherSparks && (bgAnimMode === 'griffin' || bgAnimMode === 'hybrid')) {
        for (let i = 0; i < 22; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 7 + 2.5;
          featherParticlesRef.current.push({
            x: griffin.x,
            y: griffin.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 5 + 2.5,
            alpha: 1.0,
            decay: Math.random() * 0.03 + 0.015,
            color: Math.random() > 0.5 ? getGriffinPalette(griffinTheme).featherGlow : getGriffinPalette(griffinTheme).beak
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

    // Color Palette Definitions for UI Themes
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

    // Griffin Element Color Palettes (Eagle Feathers & Lion Fur)
    function getGriffinPalette(gt) {
      switch (gt) {
        case 'silver':
          return {
            eaglePrimary: '#e2e8f0', // Platinum Eagle feathers
            eagleSecondary: '#94a3b8',
            lionBody: '#cbd5e1', // Silver lion fur
            beak: '#f59e0b', // Golden Beak & Talons
            eyes: '#38bdf8', // Cyan glowing eagle eyes
            featherGlow: '#7dd3fc',
            wings: '#f8fafc'
          };
        case 'crimson':
          return {
            eaglePrimary: '#ef4444', // Ruby Phoenix Eagle feathers
            eagleSecondary: '#b91c1c',
            lionBody: '#f97316', // Golden lion body
            beak: '#facc15', // Amber Beak
            eyes: '#fef08a', // Fire yellow eyes
            featherGlow: '#f87171',
            wings: '#dc2626'
          };
        case 'void':
          return {
            eaglePrimary: '#c084fc', // Cosmic Violet Eagle
            eagleSecondary: '#7e22ce',
            lionBody: '#475569', // Dark Slate Lion Body
            beak: '#38bdf8', // Neon Cyan Beak
            eyes: '#f0abfc', // Glowing Magenta Eyes
            featherGlow: '#e879f9',
            wings: '#a855f7'
          };
        case 'emerald':
          return {
            eaglePrimary: '#10b981', // Jade Green Eagle Head & Wings
            eagleSecondary: '#047857',
            lionBody: '#d97706', // Bronze Lion Body
            beak: '#fbbf24', // Golden Beak
            eyes: '#6ee7b7', // Emerald Eyes
            featherGlow: '#34d399',
            wings: '#059669'
          };
        case 'golden':
        default:
          return {
            eaglePrimary: '#fbbf24', // Celestial Golden Eagle
            eagleSecondary: '#d97706',
            lionBody: '#eab308', // Warm Amber Lion Body
            beak: '#f59e0b', // Sharp Gold Beak
            eyes: '#ef4444', // Crimson Sapphire Eyes
            featherGlow: '#fde047',
            wings: '#f59e0b'
          };
      }
    }

    // -------------------------------------------------------------
    // GRIFFIN PHYSICS & INVERSE KINEMATICS NODES
    // -------------------------------------------------------------
    const griffinScale = griffinSize;
    const griffin = {
      x: width / 2,
      y: height / 2,
      vx: 0,
      vy: 0,
      angle: 0,
      wingCycle: 0,
      // Articulated Lion Body & Tail Segments
      tailNodes: []
    };

    const numTailNodes = 8;
    for (let i = 0; i < numTailNodes; i++) {
      griffin.tailNodes.push({
        x: width / 2 - i * 14 * griffinScale,
        y: height / 2,
        angle: 0
      });
    }

    // Background particle system
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

    // -------------------------------------------------------------
    // MAIN CANVAS RENDER LOOP
    // -------------------------------------------------------------
    const draw = () => {
      const themePal = getThemeColors(theme);
      const griffinPal = getGriffinPalette(griffinTheme);
      const effectiveBg = bgColor || themePal.bg;

      // 1. Smooth lerp mouse target
      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;

      ctx.clearRect(0, 0, width, height);

      // 2. Draw base background fill
      ctx.fillStyle = effectiveBg;
      ctx.fillRect(0, 0, width, height);

      // 3. Radial ambient background glow
      const g1 = ctx.createRadialGradient(width * 0.3, height * 0.3, 0, width * 0.3, height * 0.3, width * 0.5);
      g1.addColorStop(0, themePal.grad1);
      g1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      const g2 = ctx.createRadialGradient(width * 0.7, height * 0.7, 0, width * 0.7, height * 0.7, width * 0.5);
      g2.addColorStop(0, themePal.grad2);
      g2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);

      // 4. DRAW PARTICLE MESH (if mode is 'particles' or 'hybrid')
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
              ctx.strokeStyle = themePal.line.replace('0.3', (0.22 * (1 - dist / 120)).toString());
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

      // 5. DRAW SHOCKWAVE CLICK RINGS
      for (let i = clickRingsRef.current.length - 1; i >= 0; i--) {
        const ring = clickRingsRef.current[i];
        ring.radius += 7;
        ring.alpha -= 0.035;

        if (ring.alpha <= 0 || ring.radius >= ring.maxRadius) {
          clickRingsRef.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
        ctx.strokeStyle = ring.color;
        ctx.globalAlpha = ring.alpha;
        ctx.lineWidth = 2.8;
        ctx.shadowColor = ring.color;
        ctx.shadowBlur = 18;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      }

      // 6. UPDATE & RENDER GRIFFIN ANIMATION (if mode is 'griffin' or 'hybrid')
      if (bgAnimMode === 'griffin' || bgAnimMode === 'hybrid') {
        const dx = mouse.x - griffin.x;
        const dy = mouse.y - griffin.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Steering angle towards target
        const targetAngle = Math.atan2(dy, dx);
        let angleDiff = targetAngle - griffin.angle;

        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

        const turnSpeed = 0.085 * griffinSpeed;
        griffin.angle += angleDiff * turnSpeed;

        const targetSpeed = Math.min(dist * 0.08, 12) * griffinSpeed;
        griffin.vx += (Math.cos(griffin.angle) * targetSpeed - griffin.vx) * 0.12;
        griffin.vy += (Math.sin(griffin.angle) * targetSpeed - griffin.vy) * 0.12;

        griffin.x += griffin.vx;
        griffin.y += griffin.vy;

        const velocity = Math.sqrt(griffin.vx * griffin.vx + griffin.vy * griffin.vy);
        griffin.wingCycle += (0.075 + velocity * 0.015) * griffinSpeed;

        // Spawn golden feather sparks from wingtips & tail tip
        if (enableFeatherSparks && (enableCursorFx || mouse.isClicking)) {
          if (mouse.isClicking || (dist > 70 && Math.random() < 0.4)) {
            const wingSpan = 75 * griffinScale;
            // Left wingtip
            const leftWingX = griffin.x + Math.cos(griffin.angle - Math.PI / 2) * wingSpan;
            const leftWingY = griffin.y + Math.sin(griffin.angle - Math.PI / 2) * wingSpan;
            // Tail tip
            const tailTip = griffin.tailNodes[griffin.tailNodes.length - 1];

            featherParticlesRef.current.push({
              x: Math.random() > 0.5 ? leftWingX : tailTip.x,
              y: Math.random() > 0.5 ? leftWingY : tailTip.y,
              vx: (Math.random() - 0.5) * 2.5,
              vy: (Math.random() - 0.5) * 2.5,
              size: Math.random() * 3.5 + 1.5,
              alpha: 1.0,
              decay: Math.random() * 0.04 + 0.02,
              color: griffinPal.featherGlow
            });
          }
        }

        // Update Lion Tail Segment Kinematics
        griffin.tailNodes[0].x = griffin.x - Math.cos(griffin.angle) * 35 * griffinScale;
        griffin.tailNodes[0].y = griffin.y - Math.sin(griffin.angle) * 35 * griffinScale;
        griffin.tailNodes[0].angle = griffin.angle;

        for (let i = 1; i < griffin.tailNodes.length; i++) {
          const prev = griffin.tailNodes[i - 1];
          const curr = griffin.tailNodes[i];
          const segDx = prev.x - curr.x;
          const segDy = prev.y - curr.y;
          curr.angle = Math.atan2(segDy, segDx);
          const dLen = Math.sqrt(segDx * segDx + segDy * segDy);
          const targetDist = 12 * griffinScale;
          if (dLen > 0) {
            curr.x = prev.x - (segDx / dLen) * targetDist;
            curr.y = prev.y - (segDy / dLen) * targetDist;
          }
        }

        // ---------------------------------------------------------
        // RENDER GRIFFIN COMPONENTS (Tail -> Lion Body -> Eagle Head -> Wings -> Talons)
        // ---------------------------------------------------------

        // 1. RENDER LION TAIL WITH BUSHY TUFTED TIP
        for (let i = griffin.tailNodes.length - 1; i >= 0; i--) {
          const tNode = griffin.tailNodes[i];
          const tailWidth = (1 - (i / griffin.tailNodes.length) * 0.6) * 7 * griffinScale;

          ctx.save();
          ctx.translate(tNode.x, tNode.y);
          ctx.rotate(tNode.angle);

          // Lion Tail Segment Circle
          ctx.beginPath();
          ctx.arc(0, 0, Math.max(2, tailWidth), 0, Math.PI * 2);
          ctx.fillStyle = griffinPal.lionBody;
          ctx.fill();

          // Bushy Lion Tail Tip Tuft (on last node)
          if (i === griffin.tailNodes.length - 1) {
            ctx.beginPath();
            ctx.ellipse(-4 * griffinScale, 0, 10 * griffinScale, 6 * griffinScale, 0, 0, Math.PI * 2);
            ctx.fillStyle = griffinPal.eaglePrimary;
            ctx.shadowColor = griffinPal.featherGlow;
            ctx.shadowBlur = 12;
            ctx.fill();
            ctx.shadowBlur = 0;
          }

          ctx.restore();
        }

        // 2. RENDER GRIFFIN MAIN TORSO (Lion Body + Eagle Chest)
        ctx.save();
        ctx.translate(griffin.x, griffin.y);
        ctx.rotate(griffin.angle);

        ctx.shadowColor = griffinPal.featherGlow;
        ctx.shadowBlur = 16;

        // Lion Rear Hindquarters
        ctx.beginPath();
        ctx.ellipse(-20 * griffinScale, 0, 22 * griffinScale, 18 * griffinScale, 0, 0, Math.PI * 2);
        ctx.fillStyle = griffinPal.lionBody;
        ctx.fill();

        // Eagle Front Chest & Shoulders
        ctx.beginPath();
        ctx.ellipse(8 * griffinScale, 0, 24 * griffinScale, 20 * griffinScale, 0, 0, Math.PI * 2);
        ctx.fillStyle = griffinPal.eaglePrimary;
        ctx.fill();

        // Feathered Chest Texture Arc Lines
        ctx.beginPath();
        ctx.arc(10 * griffinScale, -5 * griffinScale, 12 * griffinScale, 0, Math.PI * 0.8);
        ctx.arc(10 * griffinScale, 5 * griffinScale, 12 * griffinScale, -Math.PI * 0.8, 0);
        ctx.strokeStyle = griffinPal.eagleSecondary;
        ctx.lineWidth = 2 * griffinScale;
        ctx.stroke();

        ctx.shadowBlur = 0;

        // 3. RENDER EAGLE FRONT TALON CLAWS
        const talonReach = (Math.sin(griffin.wingCycle) * 4 + 18) * griffinScale;
        // Left Talon Claw
        ctx.beginPath();
        ctx.moveTo(12 * griffinScale, -14 * griffinScale);
        ctx.lineTo(24 * griffinScale, -14 * griffinScale - talonReach * 0.4);
        ctx.lineTo(30 * griffinScale, -18 * griffinScale);
        ctx.strokeStyle = griffinPal.beak;
        ctx.lineWidth = 3.5 * griffinScale;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Right Talon Claw
        ctx.beginPath();
        ctx.moveTo(12 * griffinScale, 14 * griffinScale);
        ctx.lineTo(24 * griffinScale, 14 * griffinScale + talonReach * 0.4);
        ctx.lineTo(30 * griffinScale, 18 * griffinScale);
        ctx.strokeStyle = griffinPal.beak;
        ctx.lineWidth = 3.5 * griffinScale;
        ctx.lineCap = 'round';
        ctx.stroke();

        // 4. RENDER MAJESTIC FEATHERED EAGLE WINGS
        const wingFlap = Math.sin(griffin.wingCycle) * 0.42 + 0.15;
        const wingSpan = (82 + Math.sin(griffin.wingCycle) * 16) * griffinScale;

        // Left Wing
        ctx.save();
        ctx.rotate(-wingFlap - Math.PI / 2);
        ctx.shadowColor = griffinPal.featherGlow;
        ctx.shadowBlur = 18;

        // Main Wing Blade Shape
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-wingSpan * 0.65, -wingSpan * 0.45, -wingSpan, -wingSpan * 0.12);
        ctx.quadraticCurveTo(-wingSpan * 0.45, wingSpan * 0.35, 0, 0);
        ctx.fillStyle = griffinPal.wings;
        ctx.globalAlpha = 0.9;
        ctx.fill();

        // Layered Primary Eagle Feather Lines
        for (let f = 1; f <= 5; f++) {
          ctx.beginPath();
          ctx.moveTo(-wingSpan * 0.15 * f, 0);
          ctx.lineTo(-wingSpan * 0.18 * f - 10, -wingSpan * 0.2);
          ctx.strokeStyle = griffinPal.eagleSecondary;
          ctx.lineWidth = 1.8 * griffinScale;
          ctx.stroke();
        }
        ctx.restore();

        // Right Wing
        ctx.save();
        ctx.rotate(wingFlap + Math.PI / 2);
        ctx.shadowColor = griffinPal.featherGlow;
        ctx.shadowBlur = 18;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(wingSpan * 0.65, -wingSpan * 0.45, wingSpan, -wingSpan * 0.12);
        ctx.quadraticCurveTo(wingSpan * 0.45, wingSpan * 0.35, 0, 0);
        ctx.fillStyle = griffinPal.wings;
        ctx.globalAlpha = 0.9;
        ctx.fill();

        for (let f = 1; f <= 5; f++) {
          ctx.beginPath();
          ctx.moveTo(wingSpan * 0.15 * f, 0);
          ctx.lineTo(wingSpan * 0.18 * f + 10, -wingSpan * 0.2);
          ctx.strokeStyle = griffinPal.eagleSecondary;
          ctx.lineWidth = 1.8 * griffinScale;
          ctx.stroke();
        }
        ctx.restore();

        // 5. RENDER REGAL EAGLE HEAD & SHARP BEAK
        ctx.save();
        ctx.translate(22 * griffinScale, 0);

        ctx.shadowColor = griffinPal.featherGlow;
        ctx.shadowBlur = 18;

        // Feathered Head Crest / Crown
        ctx.beginPath();
        ctx.moveTo(-10 * griffinScale, -12 * griffinScale);
        ctx.lineTo(-24 * griffinScale, -16 * griffinScale);
        ctx.lineTo(-6 * griffinScale, -4 * griffinScale);
        ctx.fillStyle = griffinPal.eagleSecondary;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-10 * griffinScale, 12 * griffinScale);
        ctx.lineTo(-24 * griffinScale, 16 * griffinScale);
        ctx.lineTo(-6 * griffinScale, 4 * griffinScale);
        ctx.fillStyle = griffinPal.eagleSecondary;
        ctx.fill();

        // Eagle Head Contour
        ctx.beginPath();
        ctx.moveTo(-12 * griffinScale, -14 * griffinScale);
        ctx.lineTo(16 * griffinScale, -10 * griffinScale);
        ctx.lineTo(24 * griffinScale, 0);
        ctx.lineTo(16 * griffinScale, 10 * griffinScale);
        ctx.lineTo(-12 * griffinScale, 14 * griffinScale);
        ctx.closePath();
        ctx.fillStyle = griffinPal.eaglePrimary;
        ctx.fill();

        // Sharp Hooked Eagle Beak
        ctx.beginPath();
        ctx.moveTo(14 * griffinScale, -8 * griffinScale);
        ctx.lineTo(34 * griffinScale, -2 * griffinScale);
        ctx.quadraticCurveTo(36 * griffinScale, 10 * griffinScale, 20 * griffinScale, 8 * griffinScale);
        ctx.closePath();
        ctx.fillStyle = griffinPal.beak;
        ctx.shadowColor = griffinPal.beak;
        ctx.shadowBlur = 12;
        ctx.fill();

        // Glowing Eagle Eyes
        ctx.beginPath();
        ctx.arc(8 * griffinScale, -6 * griffinScale, 4 * griffinScale, 0, Math.PI * 2);
        ctx.arc(8 * griffinScale, 6 * griffinScale, 4 * griffinScale, 0, Math.PI * 2);
        ctx.fillStyle = griffinPal.eyes;
        ctx.shadowColor = griffinPal.eyes;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.restore(); // Head
        ctx.restore(); // Main Torso Body
      }

      // 7. RENDER STARDUST & FEATHER SPARK PARTICLES
      for (let i = featherParticlesRef.current.length - 1; i >= 0; i--) {
        const p = featherParticlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          featherParticlesRef.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
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
    griffinTheme,
    griffinSize,
    griffinSpeed,
    enableFeatherSparks
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
