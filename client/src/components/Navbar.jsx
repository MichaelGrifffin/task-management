import React from 'react';
import { 
  CheckSquare, 
  LayoutGrid, 
  List, 
  Plus, 
  Search, 
  Palette,
  Flower,
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
    <header className="glass-panel navbar">
      <div className="nav-container">
        {/* Brand Logo & Name */}
        <div className="nav-brand">
          <div className="logo-icon">
            <CheckSquare size={22} color="#ffffff" />
          </div>
          <span className="brand-name">TaskMaster<span className="brand-badge">PRO</span></span>
        </div>

        {/* Search & Filtering Bar (Only visible when logged in) */}
        {user && (
          <div className="nav-search-bar">
            {/* Search Input */}
            <div className="search-input-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search tasks by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            {/* Filter Dropdown: Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Completed</option>
            </select>

            {/* Filter Dropdown: Priority */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        )}

        {/* View Switcher & Action Controls */}
        <div className="nav-actions">
          {user && (
            <>
              {/* View Switcher: Kanban vs List */}
              <div className="view-toggle-group">
                <button
                  className={`btn-icon ${activeView === 'kanban' ? 'active' : ''}`}
                  onClick={() => setActiveView('kanban')}
                  title="Kanban Board View"
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  className={`btn-icon ${activeView === 'list' ? 'active' : ''}`}
                  onClick={() => setActiveView('list')}
                  title="List View"
                >
                  <List size={18} />
                </button>
              </div>

              {/* Add New Task Button */}
              <button className="btn btn-primary" onClick={onOpenNewTask}>
                <Plus size={16} />
                <span>New Task</span>
              </button>
            </>
          )}

          {/* Theme & Background Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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

            {/* Interactive Customizable Background & Flower FX Button */}
            <button
              className="btn btn-primary"
              onClick={onOpenThemeModal}
              title="Customize Cursor Flower Animation, Petals & Background FX"
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
              <Flower size={15} color="#ffffff" style={{ filter: 'drop-shadow(0 0 4px #ec4899)' }} />
              <span className="nav-theme-label" style={{ fontWeight: 700 }}>Flowers & FX</span>
            </button>

            {/* Live WS Status Dot */}
            <div className="ws-indicator" style={{ padding: '4px 10px' }} title={wsConnected ? 'WebSocket Connected' : 'Offline'}>
              <span className={`dot ${wsConnected ? 'dot-connected' : ''}`}></span>
              {wsConnected ? <Wifi size={12} color="#10b981" /> : <WifiOff size={12} color="#ef4444" />}
            </div>

            {/* User Auth / Logout */}
            {user ? (
              <div className="user-profile-badge">
                <div className="avatar">
                  <User size={14} color="var(--primary)" />
                </div>
                <span className="username">{user.username}</span>
                <button className="btn-icon logout-btn" onClick={onLogout} title="Logout">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button className="btn btn-secondary" onClick={onOpenAuth}>
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
