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
    <header className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', marginBottom: '24px', padding: '16px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand Logo & View Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)'
            }}>
              <CheckSquare size={24} color="#ffffff" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.4rem', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                TaskMaster
              </h1>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>INTERN WORKFLOW</span>
            </div>
          </div>

          {/* View Switcher Tabs */}
          <div style={{ display: 'flex', background: 'var(--bg-surface)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <button 
              className={`btn ${activeView === 'kanban' ? 'btn-primary' : ''}`} 
              onClick={() => setActiveView('kanban')}
              style={{ padding: '6px 14px', fontSize: '0.85rem', background: activeView === 'kanban' ? undefined : 'transparent', color: activeView === 'kanban' ? undefined : 'var(--text-muted)' }}
            >
              <LayoutGrid size={16} /> Board
            </button>
            <button 
              className={`btn ${activeView === 'list' ? 'btn-primary' : ''}`} 
              onClick={() => setActiveView('list')}
              style={{ padding: '6px 14px', fontSize: '0.85rem', background: activeView === 'list' ? undefined : 'transparent', color: activeView === 'list' ? undefined : 'var(--text-muted)' }}
            >
              <List size={16} /> List
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, maxWidth: '540px' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="input-field"
              placeholder="Search tasks by title or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '38px', paddingRight: '12px', height: '40px', fontSize: '0.85rem' }}
            />
          </div>

          {/* Priority Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={16} style={{ color: 'var(--text-muted)' }} />
            <select
              className="select-field"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              style={{ height: '40px', padding: '0 12px', fontSize: '0.85rem', width: '130px' }}
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {/* Status Filter */}
          <select
            className="select-field"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ height: '40px', padding: '0 12px', fontSize: '0.85rem', width: '130px' }}
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* User Actions & Color Theme Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Theme Palette Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-surface)', padding: '4px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <Palette size={16} color="var(--primary)" />
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              style={{ background: 'transparent', color: 'var(--text-main)', border: 'none', fontSize: '0.82rem', fontWeight: 600, outline: 'none', cursor: 'pointer' }}
            >
              <option value="midnight" style={{ background: '#0b0f19', color: '#818cf8' }}>🌌 Electric Midnight</option>
              <option value="emerald" style={{ background: '#06120e', color: '#34d399' }}>🟢 Cyber Emerald</option>
              <option value="sunset" style={{ background: '#140b12', color: '#fb7185' }}>🌅 Sunset Nebula</option>
              <option value="crimson" style={{ background: '#070709', color: '#ff1e42' }}>🔴 Crimson Cyber</option>
            </select>
          </div>

          {/* WebSocket Status Indicator */}
          <div className="ws-indicator" title={wsConnected ? 'Connected to WebSocket Real-time sync' : 'WebSocket Disconnected'}>
            <span className={`dot ${wsConnected ? 'dot-connected' : ''}`}></span>
            {wsConnected ? <Wifi size={14} color="#10b981" /> : <WifiOff size={14} color="#ef4444" />}
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: wsConnected ? '#10b981' : 'var(--text-muted)' }}>
              {wsConnected ? 'Live Sync' : 'Offline'}
            </span>
          </div>

          {/* Add Task Button */}
          <button className="btn btn-primary" onClick={onOpenNewTask}>
            <Plus size={18} /> <span>New Task</span>
          </button>

          {/* User Auth Section */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '8px', borderLeft: '1px solid var(--border-color)' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                color: '#fff',
                fontSize: '0.9rem'
              }}>
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.2 }}>{user.username}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user.email}</span>
              </div>
              <button className="btn-icon" onClick={onLogout} title="Logout">
                <LogOut size={18} color="#ef4444" />
              </button>
            </div>
          ) : (
            <button className="btn btn-secondary" onClick={onOpenAuth}>
              <User size={16} /> Sign In
            </button>
          )}

        </div>
      </div>
    </header>
  );
}
