import React from 'react';
import { X, Palette, Sparkles, Check, Pipette, MousePointer, Zap } from 'lucide-react';

export default function ThemeSelectorModal({
  isOpen,
  onClose,
  theme,
  setTheme,
  bgColorMode,
  setBgColorMode,
  customBgColor,
  setCustomBgColor,
  enableCursorFx,
  setEnableCursorFx,
  enableCursorRing,
  setEnableCursorRing,
  bgAnimMode = 'particles',
  setBgAnimMode
}) {
  if (!isOpen) return null;

  const themesList = [
    { id: 'midnight', name: 'Midnight Neon', primary: '#6366f1', secondary: '#a855f7', bg: '#0b0f19' },
    { id: 'emerald', name: 'Emerald Matrix', primary: '#10b981', secondary: '#06b6d4', bg: '#06120e' },
    { id: 'sunset', name: 'Sunset Glow', primary: '#f43f5e', secondary: '#fb923c', bg: '#140b12' },
    { id: 'crimson', name: 'Crimson Cyber', primary: '#ef4444', secondary: '#b91c1c', bg: '#070709' },
    { id: 'nebula', name: 'Nebula Purple', primary: '#d946ef', secondary: '#8b5cf6', bg: '#0f0a1c' },
    { id: 'ocean', name: 'Deep Ocean', primary: '#0284c7', secondary: '#06b6d4', bg: '#051329' },
    { id: 'amber', name: 'Solar Amber', primary: '#f59e0b', secondary: '#ef4444', bg: '#171008' },
    { id: 'noir', name: 'Cyber Noir', primary: '#e4e4e7', secondary: '#a1a1aa', bg: '#000000' }
  ];

  const bgPresets = [
    { id: 'theme', label: 'Theme Default', color: null },
    { id: 'pitch', label: 'Pitch Black', color: '#000000' },
    { id: 'slate', label: 'Dark Slate', color: '#0b1120' },
    { id: 'violet', label: 'Deep Violet', color: '#0c0716' },
    { id: 'charcoal', label: 'Dark Charcoal', color: '#12141a' }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel modal-card animate-fade"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '540px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: 'var(--radius-lg)',
          padding: '24px'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)'
            }}>
              <Sparkles size={22} color="#ffffff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Theme & Background Customizer</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Control UI color palettes, background FX, and cursor interaction
              </p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Section 1: Background FX Mode */}
        <div style={{ marginBottom: '20px' }}>
          <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <Zap size={15} color="var(--primary)" /> Background Animation Mode
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <button
              onClick={() => setBgAnimMode && setBgAnimMode('particles')}
              className={`btn ${bgAnimMode === 'particles' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '10px 8px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Sparkles size={16} />
              <span>Particle Mesh</span>
            </button>
            <button
              onClick={() => setBgAnimMode && setBgAnimMode('none')}
              className={`btn ${bgAnimMode === 'none' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '10px 8px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Palette size={16} />
              <span>Clean Theme (No Mesh)</span>
            </button>
          </div>
        </div>

        {/* Section 2: UI Color Themes */}
        <div style={{ marginBottom: '20px' }}>
          <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <Palette size={15} color="var(--primary)" /> UI Accent Theme
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '10px' }}>
            {themesList.map((t) => {
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 6px',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? `2px solid ${t.primary}` : '1px solid var(--border-color)',
                    background: isSelected ? 'var(--bg-glass-hover)' : 'var(--bg-surface)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: t.primary }} />
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: t.secondary }} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)' }}>{t.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Custom Background Colors */}
        <div style={{ marginBottom: '20px' }}>
          <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <Pipette size={15} color="var(--primary)" /> Custom Background Color
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
            {bgPresets.map((preset) => {
              const isSelected = bgColorMode === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => setBgColorMode(preset.id)}
                  className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setBgColorMode('custom')}
              className={`btn ${bgColorMode === 'custom' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
            >
              Custom Hex
            </button>
            {bgColorMode === 'custom' && (
              <input
                type="color"
                value={customBgColor}
                onChange={(e) => setCustomBgColor(e.target.value)}
                style={{ cursor: 'pointer', border: 'none', background: 'transparent', width: '32px', height: '32px' }}
              />
            )}
          </div>
        </div>

        {/* Section 4: Cursor Effects */}
        <div>
          <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <MousePointer size={15} color="var(--primary)" /> Cursor Effects
          </label>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setEnableCursorFx(!enableCursorFx)}
              className={`btn ${enableCursorFx ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px 14px', fontSize: '0.8rem' }}
            >
              <Check size={14} style={{ opacity: enableCursorFx ? 1 : 0 }} /> Click Shockwaves
            </button>

            <button
              onClick={() => setEnableCursorRing(!enableCursorRing)}
              className={`btn ${enableCursorRing ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px 14px', fontSize: '0.8rem' }}
            >
              <Check size={14} style={{ opacity: enableCursorRing ? 1 : 0 }} /> Precision Cursor Ring
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
