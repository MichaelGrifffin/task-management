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
  WifiOff,
  X,
  Sparkles
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
    <header className="glass-panel navbar animate-fade">
      <div className="nav-container">
        {/* Brand Logo & Name */}
        <div className="nav-brand" onClick={() => window.location.reload()} title="TaskMaster PRO Dashboard" style={{ cursor: 'pointer' }}>
          <div className="logo-icon-wrapper">
            <CheckSquare size={22} color="#ffffff" className="logo-svg" />
            <Sparkles size={12} color="var(--primary)" className="logo-sparkle" />
          </div>
          <div className="brand-text-wrapper">
            <span className="brand-name">TaskMaster</span>
            <span className="brand-badge">PRO</span>
          </div>
        </div>

        {/* Search & Filtering Bar (Visible when user is logged in) */}
        {user && (
          <div className="nav-search-bar">
            {/* Search Input */}
            <div className="search-input-wrapper">
              <Search size={15} className="search-icon" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button 
                  className="search-clear-btn" 
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Filter Dropdown: Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
              title="Filter by Status"
            >
              <option value="all">All Status</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            {/* Filter Dropdown: Priority */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="filter-select"
              title="Filter by Priority"
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
                  className={`view-btn ${activeView === 'kanban' ? 'active' : ''}`}
                  onClick={() => setActiveView('kanban')}
                  title="Kanban Board View"
                >
                  <LayoutGrid size={15} />
                  <span className="view-btn-text">Board</span>
                </button>
                <button
                  className={`view-btn ${activeView === 'list' ? 'active' : ''}`}
                  onClick={() => setActiveView('list')}
                  title="List View"
                >
                  <List size={15} />
                  <span className="view-btn-text">List</span>
                </button>
              </div>

              {/* Add New Task Button */}
              <button className="btn btn-primary nav-task-btn" onClick={onOpenNewTask}>
                <Plus size={16} />
                <span>New Task</span>
              </button>
            </>
          )}

          {/* Theme & Background Controls */}
          <div className="nav-ctrl-group">
            {/* Quick Theme Selector Dropdown */}
            <div className="theme-select-wrapper">
              <Palette size={14} color="var(--primary)" />
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="theme-quick-select"
                title="Switch Visual Theme"
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

            {/* Interactive Background & Flower FX Button */}
            <button
              className="btn btn-fx-trigger"
              onClick={onOpenThemeModal}
              title="Customize Flowers, Petals & Background Animations"
            >
              <Flower size={15} className="flower-icon-glow" />
              <span className="nav-fx-label">Flowers & FX</span>
            </button>

            {/* Live WS Status Dot */}
            <div className="ws-indicator" title={wsConnected ? 'WebSocket Real-time Sync Active' : 'WebSocket Reconnecting...'}>
              <span className={`dot ${wsConnected ? 'dot-connected' : ''}`}></span>
              {wsConnected ? <Wifi size={12} color="#10b981" /> : <WifiOff size={12} color="#ef4444" />}
            </div>

            {/* User Auth / Profile Badge */}
            {user ? (
              <div className="user-profile-badge">
                <div className="avatar">
                  <User size={13} color="#ffffff" />
                </div>
                <span className="username">{user.username}</span>
                <button className="btn-icon logout-btn" onClick={onLogout} title="Logout of Account">
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <button className="btn btn-secondary nav-signin-btn" onClick={onOpenAuth}>
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

