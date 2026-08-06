import React from 'react';
import { X, Palette, Sparkles, Check, Pipette, MousePointer } from 'lucide-react';

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
  setEnableCursorRing
}) {
  if (!isOpen) return null;

  const themesList = [
    {
      id: 'midnight',
      name: 'Midnight Neon',
      primary: '#6366f1',
      secondary: '#a855f7',
      bg: '#0b0f19'
    },
    {
      id: 'emerald',
      name: 'Emerald Matrix',
      primary: '#10b981',
      secondary: '#06b6d4',
      bg: '#06120e'
    },
    {
      id: 'sunset',
      name: 'Sunset Glow',
      primary: '#f43f5e',
      secondary: '#fb923c',
      bg: '#140b12'
    },
    {
      id: 'crimson',
      name: 'Crimson Cyber',
      primary: '#ef4444',
      secondary: '#b91c1c',
      bg: '#070709'
    },
    {
      id: 'nebula',
      name: 'Nebula Purple',
      primary: '#d946ef',
      secondary: '#8b5cf6',
      bg: '#0f0a1c'
    },
    {
      id: 'ocean',
      name: 'Deep Ocean',
      primary: '#0284c7',
      secondary: '#06b6d4',
      bg: '#051329'
    },
    {
      id: 'amber',
      name: 'Solar Amber',
      primary: '#f59e0b',
      secondary: '#ef4444',
      bg: '#171008'
    },
    {
      id: 'noir',
      name: 'Cyber Noir',
      primary: '#e4e4e7',
      secondary: '#a1a1aa',
      bg: '#000000'
    }
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
          borderRadius: 'var(--radius-lg)',
          padding: '24px'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)'
            }}>
              <Palette size={20} color="#ffffff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Theme & Appearance</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Customize color scheme, background colors, and cursor animations
              </p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Section 1: Themes Selection */}
        <div style={{ marginBottom: '24px' }}>
          <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <Sparkles size={15} color="var(--primary)" /> Select Color Theme
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(115px, 1fr))',
            gap: '10px'
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
                    padding: '10px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    position: 'relative',
                    boxShadow: isSelected ? `0 0 12px ${t.primary}50` : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {/* Color Swatch Dots */}
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: t.primary }} />
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: t.secondary }} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#ffffff', textAlign: 'center' }}>
                    {t.name}
                  </span>
                  {isSelected && (
                    <div style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      background: t.primary,
                      borderRadius: '50%',
                      width: '16px',
                      height: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Check size={10} color="#fff" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Background Colour Choice */}
        <div style={{ marginBottom: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
          <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <Pipette size={15} color="var(--primary)" /> Background Colour & Style
          </label>

          {/* Preset Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
            {bgPresets.map((preset) => {
              const isSelected = bgColorMode === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => setBgColorMode(preset.id)}
                  className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                  style={{
                    fontSize: '0.78rem',
                    padding: '6px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {preset.color && (
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: preset.color, border: '1px solid rgba(255,255,255,0.4)' }} />
                  )}
                  {preset.label}
                </button>
              );
            })}
            <button
              onClick={() => setBgColorMode('custom')}
              className={`btn ${bgColorMode === 'custom' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.78rem', padding: '6px 12px' }}
            >
              Custom Color
            </button>
          </div>

          {/* Custom Color Picker (when Custom is selected) */}
          {bgColorMode === 'custom' && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              background: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}>
              <input
                type="color"
                value={customBgColor}
                onChange={(e) => setCustomBgColor(e.target.value)}
                style={{
                  width: '36px',
                  height: '36px',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  background: 'transparent'
                }}
              />
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>Pick Custom Hex</span>
                <input
                  type="text"
                  value={customBgColor}
                  onChange={(e) => setCustomBgColor(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-main)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    outline: 'none',
                    width: '100%'
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Cursor Based Animation Controls */}
        <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
          <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <MousePointer size={15} color="var(--primary)" /> Cursor-Based Animations
          </label>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Toggle Cursor Mesh Connection & Spotlight */}
            <label style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer'
            }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                Interactive Cursor Background Particle Mesh & Spotlight
              </span>
              <input
                type="checkbox"
                checked={enableCursorFx}
                onChange={(e) => setEnableCursorFx(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
            </label>

            {/* Toggle Cursor Ring Follower */}
            <label style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer'
            }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                Glowing Cursor Ring Follower
              </span>
              <input
                type="checkbox"
                checked={enableCursorRing}
                onChange={(e) => setEnableCursorRing(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
            </label>
          </div>
        </div>

        {/* Action Close Button */}
        <div style={{ marginTop: '24px', textAlign: 'right' }}>
          <button className="btn btn-primary" onClick={onClose} style={{ width: '100%', padding: '10px' }}>
            Apply Appearance
          </button>
        </div>

      </div>
    </div>
  );
}
