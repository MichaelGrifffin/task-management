import React from 'react';
import { 
  CheckSquare, 
  LayoutGrid, 
  List, 
  Plus, 
  Search, 
  Palette,
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
    <header className="glass-panel navbar-header" style={{ borderRadius: 'var(--radius-lg)', marginBottom: '16px', padding: '14px 16px', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        
        {/* Row 1: Brand Logo & User Auth / Theme */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '10px' }}>
          
          {/* Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)',
              flexShrink: 0
            }}>
              <CheckSquare size={18} color="#ffffff" />
            </div>
            <div>
              <h1 className="brand-title" style={{ fontSize: '1.2rem', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.1 }}>
                TaskMaster
              </h1>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>INTERN WORKFLOW</span>
            </div>
          </div>

          {/* Top Actions: Theme, WS, User */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            
            {/* Theme Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--bg-surface)', padding: '3px 6px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <Palette size={14} color="var(--primary)" />
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                style={{ background: 'transparent', color: 'var(--text-main)', border: 'none', fontSize: '0.75rem', fontWeight: 600, outline: 'none', cursor: 'pointer' }}
              >
                <option value="midnight" style={{ background: '#0b0f19', color: '#818cf8' }}>Midnight</option>
                <option value="emerald" style={{ background: '#06120e', color: '#34d399' }}>Emerald</option>
                <option value="sunset" style={{ background: '#140b12', color: '#fb7185' }}>Sunset</option>
                <option value="crimson" style={{ background: '#070709', color: '#ff1e42' }}>Crimson</option>
              </select>
            </div>

            {/* Live WS Status Dot */}
            <div className="ws-indicator" style={{ padding: '3px 8px' }} title={wsConnected ? 'WebSocket Connected' : 'Offline'}>
              <span className={`dot ${wsConnected ? 'dot-connected' : ''}`}></span>
              {wsConnected ? <Wifi size={12} color="#10b981" /> : <WifiOff size={12} color="#ef4444" />}
            </div>

            {/* User Auth / Logout */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  color: '#fff',
                  fontSize: '0.8rem'
                }}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <button className="btn-icon" onClick={onLogout} title="Logout" style={{ padding: '4px' }}>
                  <LogOut size={16} color="#ef4444" />
                </button>
              </div>
            ) : (
              <button className="btn btn-secondary" onClick={onOpenAuth} style={{ padding: '5px 10px', fontSize: '0.78rem' }}>
                <User size={13} /> Sign In
              </button>
            )}

          </div>
        </div>

        {/* Row 2: Board vs List View Switcher & Desktop New Task */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '8px' }}>
          
          {/* View Switcher */}
          <div style={{ display: 'flex', background: 'var(--bg-surface)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', width: '100%' }}>
            <button 
              className={`btn ${activeView === 'kanban' ? 'btn-primary' : ''}`} 
              onClick={() => setActiveView('kanban')}
              style={{ flex: 1, padding: '6px 10px', fontSize: '0.8rem', background: activeView === 'kanban' ? undefined : 'transparent', color: activeView === 'kanban' ? undefined : 'var(--text-muted)' }}
            >
              <LayoutGrid size={14} /> Board View
            </button>
            <button 
              className={`btn ${activeView === 'list' ? 'btn-primary' : ''}`} 
              onClick={() => setActiveView('list')}
              style={{ flex: 1, padding: '6px 10px', fontSize: '0.8rem', background: activeView === 'list' ? undefined : 'transparent', color: activeView === 'list' ? undefined : 'var(--text-muted)' }}
            >
              <List size={14} /> List View
            </button>
          </div>

          {/* New Task Button */}
          <button className="btn btn-primary nav-task-btn" onClick={onOpenNewTask} style={{ padding: '6px 14px', fontSize: '0.8rem', whiteSpace: 'nowrap', flexShrink: 0 }}>
            <Plus size={15} /> + Task
          </button>
        </div>

        {/* Row 3: Full Width Search Input */}
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search tasks by title or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '34px', height: '36px', fontSize: '0.82rem', width: '100%', boxSizing: 'border-box' }}
          />
        </div>

        {/* Row 4: Priority & Status Filters (2-Column Grid) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', width: '100%' }}>
          <select
            className="select-field"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{ height: '36px', padding: '0 8px', fontSize: '0.78rem', width: '100%', boxSizing: 'border-box' }}
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
            style={{ height: '36px', padding: '0 8px', fontSize: '0.78rem', width: '100%', boxSizing: 'border-box' }}
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

      </div>
    </header>
  );
}
