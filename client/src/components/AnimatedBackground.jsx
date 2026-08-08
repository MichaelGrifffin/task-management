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

      // Spawn interactive sky sunbeam ring on click
      clickRingsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 5,
        maxRadius: 200,
        alpha: 1.0,
        color: getGriffinPalette(griffinTheme).featherGlow
      });

      // Spawn realistic falling feathers & stardust on click
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

    // Realistic Griffin Color Palettes
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

    // -------------------------------------------------------------
    // REALISTIC GRIFFIN STATE & TAIL KINEMATICS
    // -------------------------------------------------------------
    const griffinScale = griffinSize;
    const griffin = {
      x: width / 2,
      y: height / 2,
      vx: 0,
      vy: 0,
      angle: 0,
      rollAngle: 0,
      wingCycle: 0,
      tailNodes: []
    };

    const numTailNodes = 10;
    for (let i = 0; i < numTailNodes; i++) {
      griffin.tailNodes.push({
        x: width / 2 - i * 12 * griffinScale,
        y: height / 2,
        angle: 0
      });
    }

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

    // -------------------------------------------------------------
    // MAIN CANVAS RENDER LOOP
    // -------------------------------------------------------------
    const draw = () => {
      const themePal = getThemeColors(theme);
      const griffinPal = getGriffinPalette(griffinTheme);
      const effectiveBg = bgColor || themePal.bg;

      // Smooth lerp mouse target
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

      // Particle mesh background (if enabled)
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

      // Draw click sunbeam shockwave rings
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
        ctx.shadowColor = ring.color;
        ctx.shadowBlur = 20;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      }

      // -------------------------------------------------------------
      // UPDATE & RENDER REALISTIC GRIFFIN BEAST
      // -------------------------------------------------------------
      if (bgAnimMode === 'griffin' || bgAnimMode === 'hybrid') {
        const dx = mouse.x - griffin.x;
        const dy = mouse.y - griffin.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Steering Heading Angle towards Mouse Cursor
        const targetAngle = Math.atan2(dy, dx);
        let angleDiff = targetAngle - griffin.angle;

        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

        const turnSpeed = 0.08 * griffinSpeed;
        griffin.angle += angleDiff * turnSpeed;

        // Dynamic Banking / Roll Angle during turns
        const targetRoll = Math.max(-0.35, Math.min(0.35, angleDiff * 1.2));
        griffin.rollAngle += (targetRoll - griffin.rollAngle) * 0.1;

        // Target flight velocity & acceleration
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
            const wingSpan = 85 * griffinScale;
            const wingX = griffin.x + Math.cos(griffin.angle - Math.PI / 2) * wingSpan * 0.7;
            const wingY = griffin.y + Math.sin(griffin.angle - Math.PI / 2) * wingSpan * 0.7;

            featherParticlesRef.current.push({
              x: wingX,
              y: wingY,
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

        // Update Inverse Kinematics Lion Tail
        griffin.tailNodes[0].x = griffin.x - Math.cos(griffin.angle) * 38 * griffinScale;
        griffin.tailNodes[0].y = griffin.y - Math.sin(griffin.angle) * 38 * griffinScale;
        griffin.tailNodes[0].angle = griffin.angle;

        for (let i = 1; i < griffin.tailNodes.length; i++) {
          const prev = griffin.tailNodes[i - 1];
          const curr = griffin.tailNodes[i];
          const segDx = prev.x - curr.x;
          const segDy = prev.y - curr.y;
          curr.angle = Math.atan2(segDy, segDx);
          const dLen = Math.sqrt(segDx * segDx + segDy * segDy);
          const targetDist = 10 * griffinScale;
          if (dLen > 0) {
            curr.x = prev.x - (segDx / dLen) * targetDist;
            curr.y = prev.y - (segDy / dLen) * targetDist;
          }
        }

        // -------------------------------------------------------------
        // RENDER REALISTIC GRIFFIN VECTOR GRAPHICS
        // -------------------------------------------------------------

        // 1. RENDER FLEXIBLE LION TAIL WITH DETAILED BUSHY TUFT
        for (let i = griffin.tailNodes.length - 1; i >= 0; i--) {
          const tNode = griffin.tailNodes[i];
          const tRadius = Math.max(2, (1 - (i / griffin.tailNodes.length) * 0.65) * 6 * griffinScale);

          ctx.save();
          ctx.translate(tNode.x, tNode.y);
          ctx.rotate(tNode.angle);

          // Tail Shaft Segment
          ctx.beginPath();
          ctx.arc(0, 0, tRadius, 0, Math.PI * 2);
          ctx.fillStyle = griffinPal.lionBody;
          ctx.fill();

          // Bushy Lion Tail Tip Tuft (at the end)
          if (i === griffin.tailNodes.length - 1) {
            ctx.shadowColor = griffinPal.featherGlow;
            ctx.shadowBlur = 14;

            ctx.beginPath();
            ctx.ellipse(-6 * griffinScale, 0, 14 * griffinScale, 8 * griffinScale, 0, 0, Math.PI * 2);
            ctx.fillStyle = griffinPal.eaglePrimary;
            ctx.fill();

            // Tuft strands
            ctx.beginPath();
            ctx.moveTo(-16 * griffinScale, -6 * griffinScale);
            ctx.lineTo(-24 * griffinScale, -10 * griffinScale);
            ctx.moveTo(-18 * griffinScale, 0);
            ctx.lineTo(-26 * griffinScale, 0);
            ctx.moveTo(-16 * griffinScale, 6 * griffinScale);
            ctx.lineTo(-24 * griffinScale, 10 * griffinScale);
            ctx.strokeStyle = griffinPal.eagleSecondary;
            ctx.lineWidth = 1.8 * griffinScale;
            ctx.stroke();

            ctx.shadowBlur = 0;
          }
          ctx.restore();
        }

        // MAIN GRIFFIN TORSO & POSE
        ctx.save();
        ctx.translate(griffin.x, griffin.y);
        ctx.rotate(griffin.angle);
        ctx.rotate(griffin.rollAngle * 0.5); // Add roll banking

        ctx.shadowColor = griffinPal.featherGlow;
        ctx.shadowBlur = 18;

        // 2. MUSCULAR LION REAR & HIND LEGS
        // Hind Legs
        ctx.beginPath();
        ctx.ellipse(-26 * griffinScale, -14 * griffinScale, 12 * griffinScale, 7 * griffinScale, -Math.PI * 0.25, 0, Math.PI * 2);
        ctx.ellipse(-26 * griffinScale, 14 * griffinScale, 12 * griffinScale, 7 * griffinScale, Math.PI * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = griffinPal.lionShade;
        ctx.fill();

        // Lion Muscular Rear Body
        ctx.beginPath();
        ctx.ellipse(-18 * griffinScale, 0, 24 * griffinScale, 19 * griffinScale, 0, 0, Math.PI * 2);
        ctx.fillStyle = griffinPal.lionBody;
        ctx.fill();

        // 3. REGAL EAGLE CHEST & SHOULDERS
        ctx.beginPath();
        ctx.ellipse(10 * griffinScale, 0, 26 * griffinScale, 21 * griffinScale, 0, 0, Math.PI * 2);
        ctx.fillStyle = griffinPal.eaglePrimary;
        ctx.fill();

        // Feathered Hackle Neck Mantle Lines
        for (let r = 0; r < 4; r++) {
          ctx.beginPath();
          ctx.arc(8 * griffinScale - r * 4, 0, (14 - r * 2) * griffinScale, -Math.PI * 0.65, Math.PI * 0.65);
          ctx.strokeStyle = griffinPal.eagleSecondary;
          ctx.lineWidth = 2 * griffinScale;
          ctx.stroke();
        }

        ctx.shadowBlur = 0;

        // 4. EAGLE FRONT LEGS & SHARP TALONS (Opening towards cursor)
        const talonReach = (Math.sin(griffin.wingCycle) * 3 + (dist < 180 ? 24 : 16)) * griffinScale;

        // Left Eagle Talon
        ctx.save();
        ctx.translate(16 * griffinScale, -14 * griffinScale);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(14 * griffinScale, -6 * griffinScale - talonReach * 0.4);
        ctx.strokeStyle = griffinPal.talons;
        ctx.lineWidth = 4 * griffinScale;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Left Claws (3 toes)
        ctx.beginPath();
        ctx.moveTo(14 * griffinScale, -6 * griffinScale - talonReach * 0.4);
        ctx.lineTo(24 * griffinScale, -12 * griffinScale - talonReach * 0.5);
        ctx.moveTo(14 * griffinScale, -6 * griffinScale - talonReach * 0.4);
        ctx.lineTo(26 * griffinScale, -6 * griffinScale - talonReach * 0.4);
        ctx.moveTo(14 * griffinScale, -6 * griffinScale - talonReach * 0.4);
        ctx.lineTo(22 * griffinScale, 0 - talonReach * 0.3);
        ctx.strokeStyle = '#1e293b'; // Sharp obsidian claws
        ctx.lineWidth = 2.5 * griffinScale;
        ctx.stroke();
        ctx.restore();

        // Right Eagle Talon
        ctx.save();
        ctx.translate(16 * griffinScale, 14 * griffinScale);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(14 * griffinScale, 6 * griffinScale + talonReach * 0.4);
        ctx.strokeStyle = griffinPal.talons;
        ctx.lineWidth = 4 * griffinScale;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Right Claws
        ctx.beginPath();
        ctx.moveTo(14 * griffinScale, 6 * griffinScale + talonReach * 0.4);
        ctx.lineTo(24 * griffinScale, 12 * griffinScale + talonReach * 0.5);
        ctx.moveTo(14 * griffinScale, 6 * griffinScale + talonReach * 0.4);
        ctx.lineTo(26 * griffinScale, 6 * griffinScale + talonReach * 0.4);
        ctx.moveTo(14 * griffinScale, 6 * griffinScale + talonReach * 0.4);
        ctx.lineTo(22 * griffinScale, 0 + talonReach * 0.3);
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2.5 * griffinScale;
        ctx.stroke();
        ctx.restore();

        // 5. LAYERED REALISTIC EAGLE WINGS (3 Ranks: Primary, Secondary, Shoulder)
        const wingFlap = Math.sin(griffin.wingCycle) * 0.48 + 0.1;
        const wingSpan = (90 + Math.sin(griffin.wingCycle) * 18) * griffinScale;

        // LEFT WING
        ctx.save();
        ctx.translate(4 * griffinScale, -12 * griffinScale);
        ctx.rotate(-wingFlap - Math.PI / 2);
        ctx.shadowColor = griffinPal.featherGlow;
        ctx.shadowBlur = 20;

        // Shoulder Covert Base
        ctx.beginPath();
        ctx.ellipse(-20 * griffinScale, 0, 24 * griffinScale, 16 * griffinScale, -0.3, 0, Math.PI * 2);
        ctx.fillStyle = griffinPal.eagleSecondary;
        ctx.fill();

        // Mid-wing Secondary Coverts
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-wingSpan * 0.4, -wingSpan * 0.3, -wingSpan * 0.65, -wingSpan * 0.08);
        ctx.quadraticCurveTo(-wingSpan * 0.35, wingSpan * 0.25, 0, 0);
        ctx.fillStyle = griffinPal.eaglePrimary;
        ctx.fill();

        // Primary Outer Flight Feathers (7 individual quills fanning out)
        for (let q = 0; q < 7; q++) {
          const qAngle = -0.2 + (q / 6) * 0.4;
          const qLen = wingSpan * (1.0 - (q / 6) * 0.22);
          ctx.save();
          ctx.rotate(qAngle);

          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(-qLen * 0.5, -12, -qLen, -4);
          ctx.quadraticCurveTo(-qLen * 0.5, 6, 0, 0);
          ctx.fillStyle = q % 2 === 0 ? griffinPal.wingQuills : griffinPal.eaglePrimary;
          ctx.strokeStyle = griffinPal.eagleSecondary;
          ctx.lineWidth = 1.2 * griffinScale;
          ctx.fill();
          ctx.stroke();

          ctx.restore();
        }
        ctx.restore();

        // RIGHT WING
        ctx.save();
        ctx.translate(4 * griffinScale, 12 * griffinScale);
        ctx.rotate(wingFlap + Math.PI / 2);
        ctx.shadowColor = griffinPal.featherGlow;
        ctx.shadowBlur = 20;

        // Shoulder Covert Base
        ctx.beginPath();
        ctx.ellipse(20 * griffinScale, 0, 24 * griffinScale, 16 * griffinScale, 0.3, 0, Math.PI * 2);
        ctx.fillStyle = griffinPal.eagleSecondary;
        ctx.fill();

        // Mid-wing Secondary Coverts
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(wingSpan * 0.4, -wingSpan * 0.3, wingSpan * 0.65, -wingSpan * 0.08);
        ctx.quadraticCurveTo(wingSpan * 0.35, wingSpan * 0.25, 0, 0);
        ctx.fillStyle = griffinPal.eaglePrimary;
        ctx.fill();

        // Primary Outer Flight Feathers
        for (let q = 0; q < 7; q++) {
          const qAngle = 0.2 - (q / 6) * 0.4;
          const qLen = wingSpan * (1.0 - (q / 6) * 0.22);
          ctx.save();
          ctx.rotate(qAngle);

          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(qLen * 0.5, -12, qLen, -4);
          ctx.quadraticCurveTo(qLen * 0.5, 6, 0, 0);
          ctx.fillStyle = q % 2 === 0 ? griffinPal.wingQuills : griffinPal.eaglePrimary;
          ctx.strokeStyle = griffinPal.eagleSecondary;
          ctx.lineWidth = 1.2 * griffinScale;
          ctx.fill();
          ctx.stroke();

          ctx.restore();
        }
        ctx.restore();

        // 6. NOBLE EAGLE HEAD & HOOKED METALLIC BEAK
        ctx.save();
        ctx.translate(26 * griffinScale, 0);

        ctx.shadowColor = griffinPal.featherGlow;
        ctx.shadowBlur = 22;

        // Crown Feather Crests (Windblown)
        for (let c = 0; c < 4; c++) {
          ctx.beginPath();
          ctx.moveTo(-12 * griffinScale, (-8 + c * 5) * griffinScale);
          ctx.quadraticCurveTo(-26 * griffinScale, (-14 + c * 8) * griffinScale, -32 * griffinScale, (-18 + c * 10) * griffinScale);
          ctx.lineTo(-10 * griffinScale, (-4 + c * 4) * griffinScale);
          ctx.fillStyle = griffinPal.eagleSecondary;
          ctx.fill();
        }

        // Eagle Head Contour
        ctx.beginPath();
        ctx.moveTo(-14 * griffinScale, -15 * griffinScale);
        ctx.quadraticCurveTo(10 * griffinScale, -16 * griffinScale, 20 * griffinScale, -10 * griffinScale);
        ctx.lineTo(28 * griffinScale, 0);
        ctx.lineTo(20 * griffinScale, 10 * griffinScale);
        ctx.quadraticCurveTo(10 * griffinScale, 16 * griffinScale, -14 * griffinScale, 15 * griffinScale);
        ctx.closePath();
        ctx.fillStyle = griffinPal.eaglePrimary;
        ctx.fill();

        // Hooked Eagle Beak (Upper & Lower Mandibles)
        ctx.beginPath();
        ctx.moveTo(18 * griffinScale, -10 * griffinScale);
        ctx.lineTo(38 * griffinScale, -4 * griffinScale);
        ctx.quadraticCurveTo(42 * griffinScale, 12 * griffinScale, 22 * griffinScale, 9 * griffinScale);
        ctx.closePath();

        const beakGrad = ctx.createLinearGradient(18, 0, 42, 0);
        beakGrad.addColorStop(0, griffinPal.beak);
        beakGrad.addColorStop(1, '#d97706');
        ctx.fillStyle = beakGrad;
        ctx.shadowColor = griffinPal.beak;
        ctx.shadowBlur = 14;
        ctx.fill();

        // Nostril Slit
        ctx.beginPath();
        ctx.ellipse(25 * griffinScale, -3 * griffinScale, 2.5 * griffinScale, 1 * griffinScale, -0.2, 0, Math.PI * 2);
        ctx.fillStyle = '#78350f';
        ctx.fill();

        // Glowing Fierce Eagle Eye
        ctx.beginPath();
        ctx.arc(10 * griffinScale, -7 * griffinScale, 4.5 * griffinScale, 0, Math.PI * 2);
        ctx.fillStyle = griffinPal.eyes;
        ctx.shadowColor = griffinPal.eyes;
        ctx.shadowBlur = 14;
        ctx.fill();

        // Eagle Eye Pupil & Reflection Dot
        ctx.beginPath();
        ctx.arc(11 * griffinScale, -7 * griffinScale, 2 * griffinScale, 0, Math.PI * 2);
        ctx.fillStyle = '#0f172a';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(12 * griffinScale, -8 * griffinScale, 0.8 * griffinScale, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.restore(); // Eagle Head
        ctx.restore(); // Main Griffin Pose
      }

      // RENDER FALLING FEATHERS & STARDUST PARTICLES
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

        // Realistic Feather Shape
        ctx.beginPath();
        ctx.moveTo(0, -p.length / 2);
        ctx.quadraticCurveTo(p.size, 0, 0, p.length / 2);
        ctx.quadraticCurveTo(-p.size, 0, 0, -p.length / 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();

        // Feather Shaft Line
        ctx.beginPath();
        ctx.moveTo(0, -p.length / 2);
        ctx.lineTo(0, p.length / 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.shadowBlur = 0;
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
