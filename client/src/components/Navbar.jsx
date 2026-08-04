import React from 'react';
import { 
  CheckSquare, 
  LayoutGrid, 
  List, 
  Plus, 
  Search, 
  Filter, 
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
    <header className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', marginBottom: '20px', padding: '14px 20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        
        {/* Top Row: Brand Logo, Views, User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          
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
              <h1 className="brand-title" style={{ fontSize: '1.3rem', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.2 }}>
                TaskMaster
              </h1>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>INTERN WORKFLOW</span>
            </div>
          </div>

          {/* View Switcher Tabs */}
          <div style={{ display: 'flex', background: 'var(--bg-surface)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <button 
              className={`btn ${activeView === 'kanban' ? 'btn-primary' : ''}`} 
              onClick={() => setActiveView('kanban')}
              style={{ padding: '6px 12px', fontSize: '0.8rem', background: activeView === 'kanban' ? undefined : 'transparent', color: activeView === 'kanban' ? undefined : 'var(--text-muted)' }}
            >
              <LayoutGrid size={15} /> Board
            </button>
            <button 
              className={`btn ${activeView === 'list' ? 'btn-primary' : ''}`} 
              onClick={() => setActiveView('list')}
              style={{ padding: '6px 12px', fontSize: '0.8rem', background: activeView === 'list' ? undefined : 'transparent', color: activeView === 'list' ? undefined : 'var(--text-muted)' }}
            >
              <List size={15} /> List
            </button>
          </div>

          {/* Actions: Palette, WS, New Task, User */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            
            {/* Theme Palette Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--bg-surface)', padding: '3px 8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <Palette size={15} color="var(--primary)" />
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                style={{ background: 'transparent', color: 'var(--text-main)', border: 'none', fontSize: '0.78rem', fontWeight: 600, outline: 'none', cursor: 'pointer' }}
              >
                <option value="midnight" style={{ background: '#0b0f19', color: '#818cf8' }}>Midnight</option>
                <option value="emerald" style={{ background: '#06120e', color: '#34d399' }}>Emerald</option>
                <option value="sunset" style={{ background: '#140b12', color: '#fb7185' }}>Sunset</option>
                <option value="crimson" style={{ background: '#070709', color: '#ff1e42' }}>Crimson</option>
              </select>
            </div>

            {/* WebSocket Indicator */}
            <div className="ws-indicator" title={wsConnected ? 'WebSocket Connected' : 'Offline'}>
              <span className={`dot ${wsConnected ? 'dot-connected' : ''}`}></span>
              {wsConnected ? <Wifi size={13} color="#10b981" /> : <WifiOff size={13} color="#ef4444" />}
            </div>

            {/* User Auth Section */}
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
                <button className="btn-icon" onClick={onLogout} title="Logout">
                  <LogOut size={16} color="#ef4444" />
                </button>
              </div>
            ) : (
              <button className="btn btn-secondary" onClick={onOpenAuth} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                <User size={15} /> Sign In
              </button>
            )}

            {/* Desktop New Task Button */}
            <button className="btn btn-primary" onClick={onOpenNewTask} style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
              <Plus size={16} /> Task
            </button>
          </div>

        </div>

        {/* Bottom Row: Mobile Responsive Search & Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1 1 200px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="input-field"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '36px', height: '36px', fontSize: '0.82rem' }}
            />
          </div>

          {/* Priority & Status Filters Grid */}
          <div style={{ display: 'flex', gap: '8px', flex: '1 1 auto' }}>
            <select
              className="select-field"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              style={{ height: '36px', padding: '0 10px', fontSize: '0.8rem', flex: 1 }}
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>

            <select
              className="select-field"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ height: '36px', padding: '0 10px', fontSize: '0.8rem', flex: 1 }}
            >
              <option value="all">All Status</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

      </div>
    </header>
  );
}
