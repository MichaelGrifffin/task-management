import React from 'react';
import { X, Palette, Sparkles, Check, Pipette, MousePointer, Flame, Zap, Sliders } from 'lucide-react';

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
  bgAnimMode = 'dragon',
  setBgAnimMode,
  dragonTheme = 'inferno',
  setDragonTheme,
  dragonSize = 1.0,
  setDragonSize,
  dragonSpeed = 1.0,
  setDragonSpeed,
  enableFireBreath = true,
  setEnableFireBreath
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

  const dragonElements = [
    { id: 'inferno', name: '🔥 Inferno Crimson', primary: '#ef4444', secondary: '#fb923c' },
    { id: 'jade', name: '🐉 Jade Wyrm', primary: '#10b981', secondary: '#34d399' },
    { id: 'void', name: '🌌 Void Nebula', primary: '#c084fc', secondary: '#f472b6' },
    { id: 'solar', name: '☀️ Solar Gold', primary: '#f59e0b', secondary: '#fde047' },
    { id: 'frost', name: '❄️ Frost Silver', primary: '#38bdf8', secondary: '#bae6fd' }
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
          maxWidth: '580px',
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
              <Flame size={22} color="#ffffff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Background & Dragon Customizer</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Control dragon animations, element styles, background colors, and cursor FX
              </p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Section 1: Background Animation Mode */}
        <div style={{ marginBottom: '20px' }}>
          <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <Zap size={15} color="var(--primary)" /> Canvas Background Mode
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <button
              onClick={() => setBgAnimMode && setBgAnimMode('dragon')}
              className={`btn ${bgAnimMode === 'dragon' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '10px 8px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
            >
              <span style={{ fontSize: '1.2rem' }}>🐉</span>
              <span>Dragon Only</span>
            </button>
            <button
              onClick={() => setBgAnimMode && setBgAnimMode('hybrid')}
              className={`btn ${bgAnimMode === 'hybrid' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '10px 8px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
            >
              <span style={{ fontSize: '1.2rem' }}>🔥</span>
              <span>Hybrid Dragon</span>
            </button>
            <button
              onClick={() => setBgAnimMode && setBgAnimMode('particles')}
              className={`btn ${bgAnimMode === 'particles' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '10px 8px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
            >
              <span style={{ fontSize: '1.2rem' }}>🌌</span>
              <span>Particle Mesh</span>
            </button>
          </div>
        </div>

        {/* Section 2: Dragon Customization (when Dragon or Hybrid mode active) */}
        {(bgAnimMode === 'dragon' || bgAnimMode === 'hybrid') && (
          <div style={{
            marginBottom: '20px',
            padding: '14px',
            background: 'rgba(99, 102, 241, 0.06)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(99, 102, 241, 0.2)'
          }}>
            <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <Flame size={15} color="var(--primary)" /> Dragon Element & Color Style
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(105px, 1fr))', gap: '8px', marginBottom: '14px' }}>
              {dragonElements.map((el) => {
                const isSel = dragonTheme === el.id;
                return (
                  <button
                    key={el.id}
                    onClick={() => setDragonTheme && setDragonTheme(el.id)}
                    style={{
                      background: isSel ? 'rgba(99, 102, 241, 0.25)' : 'var(--bg-surface)',
                      border: isSel ? `2px solid ${el.primary}` : '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '8px 6px',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--text-main)',
                      textAlign: 'center',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {el.name}
                  </button>
                );
              })}
            </div>

            {/* Sliders for Dragon Size & Speed */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px', fontWeight: 600 }}>
                  <span>Dragon Scale / Size</span>
                  <span style={{ color: 'var(--primary)' }}>{Math.round(dragonSize * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.7"
                  max="1.5"
                  step="0.1"
                  value={dragonSize}
                  onChange={(e) => setDragonSize && setDragonSize(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px', fontWeight: 600 }}>
                  <span>Dragon Speed & Agility</span>
                  <span style={{ color: 'var(--primary)' }}>{Math.round(dragonSpeed * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="1.8"
                  step="0.1"
                  value={dragonSpeed}
                  onChange={(e) => setDragonSpeed && setDragonSpeed(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
              </div>

              {/* Toggle Fire Breath Embers */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginTop: '4px',
                cursor: 'pointer'
              }}>
                <span>Breathing Fire Embers on Movement & Click</span>
                <input
                  type="checkbox"
                  checked={enableFireBreath}
                  onChange={(e) => setEnableFireBreath && setEnableFireBreath(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
              </label>
            </div>
          </div>
        )}

        {/* Section 3: UI Color Themes */}
        <div style={{ marginBottom: '20px', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
          <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <Sparkles size={15} color="var(--primary)" /> UI Accent Theme
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(115px, 1fr))',
            gap: '8px'
          }}>
            {themesList.map((t) => {
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  style={{
                    background: t.bg,
                    border: isSelected ? `2px solid ${t.primary}` : '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    position: 'relative',
                    boxShadow: isSelected ? `0 0 10px ${t.primary}50` : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: t.primary }} />
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: t.secondary }} />
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#ffffff' }}>
                    {t.name}
                  </span>
                  {isSelected && (
                    <div style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      background: t.primary,
                      borderRadius: '50%',
                      width: '14px',
                      height: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Check size={8} color="#fff" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: Background Colour Choice */}
        <div style={{ marginBottom: '20px', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
          <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <Pipette size={15} color="var(--primary)" /> Background Color
          </label>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
            {bgPresets.map((preset) => {
              const isSelected = bgColorMode === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => setBgColorMode(preset.id)}
                  className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                  style={{
                    fontSize: '0.75rem',
                    padding: '5px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {preset.color && (
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: preset.color, border: '1px solid rgba(255,255,255,0.4)' }} />
                  )}
                  {preset.label}
                </button>
              );
            })}
            <button
              onClick={() => setBgColorMode('custom')}
              className={`btn ${bgColorMode === 'custom' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.75rem', padding: '5px 10px' }}
            >
              Custom Hex
            </button>
          </div>

          {bgColorMode === 'custom' && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              background: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}>
              <input
                type="color"
                value={customBgColor}
                onChange={(e) => setCustomBgColor(e.target.value)}
                style={{
                  width: '32px',
                  height: '32px',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  background: 'transparent'
                }}
              />
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Pick Hex Color</span>
                <input
                  type="text"
                  value={customBgColor}
                  onChange={(e) => setCustomBgColor(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-main)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    outline: 'none',
                    width: '100%'
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 5: Cursor Ring Controls */}
        <div style={{ paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
          <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <MousePointer size={15} color="var(--primary)" /> Precision Cursor Follower Ring
          </label>

          <label style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            cursor: 'pointer'
          }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>
              Enable Glowing Cursor Ring Follower
            </span>
            <input
              type="checkbox"
              checked={enableCursorRing}
              onChange={(e) => setEnableCursorRing(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
          </label>
        </div>

        {/* Action Close Button */}
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button className="btn btn-primary" onClick={onClose} style={{ width: '100%', padding: '10px', fontSize: '0.9rem' }}>
            Save & Apply Background
          </button>
        </div>

      </div>
    </div>
  );
}
