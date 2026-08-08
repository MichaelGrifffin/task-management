import React from 'react';
import { 
  CheckSquare, 
  LayoutGrid, 
  List, 
  Plus, 
  Search, 
  Palette,
  Flame,
  LogOut, 
  User, 
  Wifi, 
  WifiOff 
} from 'lucide-react';

export default function Navbar({
  user,
  onOpenAuth,
  onLogout,
  onOpenNewTask,
  onOpenThemeModal,
  activeView,
  setActiveView,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  wsConnected,
  theme,
  setTheme
}) {
  return (
    <header className="glass-panel navbar-header" style={{ borderRadius: 'var(--radius-lg)', marginBottom: '16px', padding: '16px 20px', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
        
        {/* Row 1: Logo, Search (Desktop center), and Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '16px', flexWrap: 'wrap' }}>
          
          {/* Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)',
              flexShrink: 0
            }}>
              <CheckSquare size={20} color="#ffffff" />
            </div>
            <div>
              <h1 className="brand-title" style={{ fontSize: '1.25rem', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.1 }}>
                TaskMaster
              </h1>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', letterSpacing: '0.05em' }}>WORKSPACE</span>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div style={{ flex: '1 1 300px', maxWidth: '500px', position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="input-field"
              placeholder="Search tasks by title or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '36px', height: '38px', fontSize: '0.85rem', width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          {/* Top Actions: Theme, Background Customizer Modal, WS, User */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>
            
            {/* Quick Theme Selector Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--bg-surface)', padding: '4px 8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <Palette size={14} color="var(--primary)" />
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                style={{ background: 'transparent', color: 'var(--text-main)', border: 'none', fontSize: '0.78rem', fontWeight: 600, outline: 'none', cursor: 'pointer' }}
              >
                <option value="midnight" style={{ background: '#0b0f19', color: '#818cf8' }}>Midnight</option>
                <option value="emerald" style={{ background: '#06120e', color: '#34d399' }}>Emerald</option>
                <option value="sunset" style={{ background: '#140b12', color: '#fb7185' }}>Sunset</option>
                <option value="crimson" style={{ background: '#070709', color: '#ff1e42' }}>Crimson</option>
                <option value="nebula" style={{ background: '#0f0a1c', color: '#e879f9' }}>Nebula</option>
                <option value="ocean" style={{ background: '#051329', color: '#38bdf8' }}>Ocean</option>
                <option value="amber" style={{ background: '#171008', color: '#fbbf24' }}>Amber</option>
                <option value="noir" style={{ background: '#000000', color: '#ffffff' }}>Noir</option>
              </select>
            </div>

            {/* Interactive Customizable Background & Dragon FX Button */}
            <button
              className="btn btn-primary"
              onClick={onOpenThemeModal}
              title="Customize Dragon Animation, Colors & Background FX"
              style={{
                padding: '6px 14px',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--gradient-primary)',
                boxShadow: '0 0 14px rgba(99, 102, 241, 0.4)'
              }}
            >
              <Flame size={15} color="#ffffff" style={{ filter: 'drop-shadow(0 0 4px #ff5500)' }} />
              <span className="nav-theme-label" style={{ fontWeight: 700 }}>Background FX</span>
            </button>

            {/* Live WS Status Dot */}
            <div className="ws-indicator" style={{ padding: '4px 10px' }} title={wsConnected ? 'WebSocket Connected' : 'Offline'}>
              <span className={`dot ${wsConnected ? 'dot-connected' : ''}`}></span>
              {wsConnected ? <Wifi size={12} color="#10b981" /> : <WifiOff size={12} color="#ef4444" />}
            </div>

            {/* User Auth / Logout */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  color: '#fff',
                  fontSize: '0.85rem'
                }}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <button className="btn-icon" onClick={onLogout} title="Logout" style={{ padding: '6px' }}>
                  <LogOut size={16} color="#ef4444" />
                </button>
              </div>
            ) : (
              <button className="btn btn-secondary" onClick={onOpenAuth} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                <User size={14} /> Sign In
              </button>
            )}

          </div>
        </div>

        {/* Row 2: View Switcher, Filters & Desktop New Task */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '12px', flexWrap: 'wrap' }}>
          
          {/* View Switcher */}
          <div style={{ display: 'flex', background: 'var(--bg-surface)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', minWidth: '220px' }}>
            <button 
              className={`btn ${activeView === 'kanban' ? 'btn-primary' : ''}`} 
              onClick={() => setActiveView('kanban')}
              style={{ flex: 1, padding: '6px 12px', fontSize: '0.8rem', background: activeView === 'kanban' ? undefined : 'transparent', color: activeView === 'kanban' ? undefined : 'var(--text-muted)' }}
            >
              <LayoutGrid size={14} /> Board View
            </button>
            <button 
              className={`btn ${activeView === 'list' ? 'btn-primary' : ''}`} 
              onClick={() => setActiveView('list')}
              style={{ flex: 1, padding: '6px 12px', fontSize: '0.8rem', background: activeView === 'list' ? undefined : 'transparent', color: activeView === 'list' ? undefined : 'var(--text-muted)' }}
            >
              <List size={14} /> List View
            </button>
          </div>

          {/* Priority & Status Filters */}
          <div style={{ display: 'flex', gap: '8px', flex: '1 1 auto', maxWidth: '400px' }}>
            <select
              className="select-field"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              style={{ height: '36px', padding: '0 10px', fontSize: '0.8rem', flex: 1, boxSizing: 'border-box' }}
            >
              <option value="all">All Priorities</option>
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="urgent">Urgent Only</option>
            </select>

            <select
              className="select-field"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ height: '36px', padding: '0 10px', fontSize: '0.8rem', flex: 1, boxSizing: 'border-box' }}
            >
              <option value="all">All Status</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* New Task Button (Desktop) */}
          <button className="btn btn-primary nav-task-btn" onClick={onOpenNewTask} style={{ padding: '8px 16px', fontSize: '0.85rem', whiteSpace: 'nowrap', flexShrink: 0 }}>
            <Plus size={16} /> + Task
          </button>
        </div>

      </div>
    </header>
  );
}
