import React, { useEffect, useState } from 'react';

export default function CursorFollower({ enabled = true }) {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let animFrameId;

    const onMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Check if mouse is hovering over interactive element
      const target = e.target;
      const isInteractive = target && (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('.glass-panel') ||
        target.closest('button') ||
        target.closest('.task-card') ||
        target.getAttribute('role') === 'button'
      );
      setIsHovered(!!isInteractive);
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);

    // Smooth spring interpolation loop
    const animate = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      setPos({ x: currentX, y: currentY });
      animFrameId = requestAnimationFrame(animate);
    };

    animFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animFrameId);
    };
  }, [enabled, isVisible]);

  if (!enabled || !isVisible) return null;

  const size = isClicking ? 28 : isHovered ? 48 : 36;
  const dotSize = isClicking ? 4 : isHovered ? 8 : 6;

  return (
    <>
      {/* Outer Glowing Ring */}
      <div
        style={{
          position: 'fixed',
          top: pos.y,
          left: pos.x,
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          border: '1.5px solid var(--primary)',
          boxShadow: isHovered ? '0 0 20px var(--primary)' : '0 0 10px rgba(99, 102, 241, 0.4)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 9999,
          transition: 'width 0.2s ease-out, height 0.2s ease-out, background-color 0.2s ease-out',
          background: isHovered ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
          backdropFilter: isHovered ? 'blur(1px)' : 'none',
          opacity: 0.85
        }}
      />
      {/* Inner Precision Pointer Dot */}
      <div
        style={{
          position: 'fixed',
          top: pos.y,
          left: pos.x,
          width: `${dotSize}px`,
          height: `${dotSize}px`,
          borderRadius: '50%',
          backgroundColor: 'var(--primary)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 10000,
          boxShadow: '0 0 8px var(--primary)',
          transition: 'width 0.15s ease-out, height 0.15s ease-out'
        }}
      />
    </>
  );
}
