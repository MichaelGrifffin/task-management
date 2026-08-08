import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import DashboardStats from './components/DashboardStats';
import KanbanBoard from './components/KanbanBoard';
import ListView from './components/ListView';
import TaskModal from './components/TaskModal';
import AuthModal from './components/AuthModal';
import AnimatedBackground from './components/AnimatedBackground';
import CursorFollower from './components/CursorFollower';
import ThemeSelectorModal from './components/ThemeSelectorModal';
import { Sparkles, CheckCircle2, Loader2, Plus, Flame } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  
  // UI State
  const [activeView, setActiveView] = useState('kanban'); // 'kanban' | 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  
  // Theme & Background Dragon State
  const [theme, setTheme] = useState(localStorage.getItem('app-theme') || 'midnight');
  const [bgColorMode, setBgColorMode] = useState(localStorage.getItem('app-bg-mode') || 'theme');
  const [customBgColor, setCustomBgColor] = useState(localStorage.getItem('app-custom-bg') || '#0b0f19');
  const [enableCursorFx, setEnableCursorFx] = useState(
    localStorage.getItem('app-cursor-fx') !== 'false'
  );
  const [enableCursorRing, setEnableCursorRing] = useState(
    localStorage.getItem('app-cursor-ring') !== 'false'
  );

  // Dragon Customizer State
  const [bgAnimMode, setBgAnimMode] = useState(localStorage.getItem('app-bg-anim-mode') || 'dragon');
  const [dragonTheme, setDragonTheme] = useState(localStorage.getItem('app-dragon-theme') || 'inferno');
  const [dragonSize, setDragonSize] = useState(
    parseFloat(localStorage.getItem('app-dragon-size')) || 1.0
  );
  const [dragonSpeed, setDragonSpeed] = useState(
    parseFloat(localStorage.getItem('app-dragon-speed')) || 1.0
  );
  const [enableFireBreath, setEnableFireBreath] = useState(
    localStorage.getItem('app-fire-breath') !== 'false'
  );

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Determine effective background color
  const getEffectiveBgColor = () => {
    if (bgColorMode === 'theme') return null;
    if (bgColorMode === 'pitch') return '#000000';
    if (bgColorMode === 'slate') return '#0b1120';
    if (bgColorMode === 'violet') return '#0c0716';
    if (bgColorMode === 'charcoal') return '#12141a';
    if (bgColorMode === 'custom') return customBgColor;
    return null;
  };

  // Sync theme & background attributes & localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  useEffect(() => {
    const effectiveBg = getEffectiveBgColor();
    if (effectiveBg) {
      document.body.style.backgroundColor = effectiveBg;
      document.documentElement.style.setProperty('--bg-dark', effectiveBg);
    } else {
      document.body.style.backgroundColor = '';
      document.documentElement.style.removeProperty('--bg-dark');
    }
    localStorage.setItem('app-bg-mode', bgColorMode);
    localStorage.setItem('app-custom-bg', customBgColor);
  }, [bgColorMode, customBgColor, theme]);

  useEffect(() => {
    localStorage.setItem('app-cursor-fx', enableCursorFx.toString());
  }, [enableCursorFx]);

  useEffect(() => {
    localStorage.setItem('app-cursor-ring', enableCursorRing.toString());
  }, [enableCursorRing]);

  useEffect(() => {
    localStorage.setItem('app-bg-anim-mode', bgAnimMode);
  }, [bgAnimMode]);

  useEffect(() => {
    localStorage.setItem('app-dragon-theme', dragonTheme);
  }, [dragonTheme]);

  useEffect(() => {
    localStorage.setItem('app-dragon-size', dragonSize.toString());
  }, [dragonSize]);

  useEffect(() => {
    localStorage.setItem('app-dragon-speed', dragonSpeed.toString());
  }, [dragonSpeed]);

  useEffect(() => {
    localStorage.setItem('app-fire-breath', enableFireBreath.toString());
  }, [enableFireBreath]);

  // Check auth user on mount
  useEffect(() => {
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setUser(data.user);
          } else {
            logout();
          }
        })
        .catch(() => logout());
    }
  }, [token]);

  // Fetch tasks API
  const fetchTasks = useCallback(async () => {
    if (!token) {
      setTasks([]);
      return;
    }

    setLoadingTasks(true);

    let url = `/api/tasks?status=${statusFilter}&priority=${priorityFilter}`;
    if (searchQuery.trim()) {
      url += `&search=${encodeURIComponent(searchQuery.trim())}`;
    }

    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks || []);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoadingTasks(false);
    }
  }, [token, statusFilter, priorityFilter, searchQuery]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // WebSocket Live Synchronization
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    const isDev = window.location.port === '3000';
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = isDev ? `${window.location.hostname}:5000` : window.location.host;
    const wsUrl = `${protocol}//${wsHost}`;
    
    let ws = null;
    try {
      ws = new WebSocket(wsUrl);

      ws.onopen = () => setWsConnected(true);
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'TASK_CREATED' || data.type === 'TASK_UPDATED' || data.type === 'TASK_DELETED') {
            fetchTasks();
          }
        } catch (e) {
          console.error('WS Parse error', e);
        }
      };

      ws.onclose = () => setWsConnected(false);
      ws.onerror = () => setWsConnected(false);
    } catch (e) {
      console.error('WebSocket Error:', e);
    }

    return () => {
      if (ws) ws.close();
    };
  }, [fetchTasks]);

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [defaultTaskStatus, setDefaultTaskStatus] = useState('todo');

  // Auth actions
  const handleAuthSuccess = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('token');
    setTasks([]);
  };

  // Task Actions
  const handleSaveTask = async (taskData) => {
    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }

    const isEdit = !!taskData.id;
    const url = isEdit ? `/api/tasks/${taskData.id}` : '/api/tasks';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
      });

      if (res.ok) {
        fetchTasks();
      }
    } catch (err) {
      console.error('Error saving task:', err);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchTasks();
      }
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!token) return;
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchTasks();
      }
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const openNewTaskModal = (colStatus = 'todo') => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setTaskToEdit(null);
    setDefaultTaskStatus(colStatus);
    setIsTaskModalOpen(true);
  };

  const openEditTaskModal = (task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  return (
    <>
      {/* Animated Canvas Background with Cursor Dragon Animation */}
      <AnimatedBackground
        theme={theme}
        bgColor={getEffectiveBgColor()}
        enableCursorFx={enableCursorFx}
        bgAnimMode={bgAnimMode}
        dragonTheme={dragonTheme}
        dragonSize={dragonSize}
        dragonSpeed={dragonSpeed}
        enableFireBreath={enableFireBreath}
      />

      {/* Sleek Precision Cursor Follower Ring */}
      <CursorFollower enabled={enableCursorRing} />

      <div className="app-container">
        {/* Top Navbar */}
        <Navbar
          user={user}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onLogout={logout}
          onOpenNewTask={() => openNewTaskModal('todo')}
          onOpenThemeModal={() => setIsThemeModalOpen(true)}
          activeView={activeView}
          setActiveView={setActiveView}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          wsConnected={wsConnected}
          theme={theme}
          setTheme={setTheme}
        />

        {/* Main Body */}
        {user ? (
          <main>
            {/* Dashboard Stats Banner */}
            <DashboardStats tasks={tasks} />

            {/* Loading Indicator Spinner */}
            {loadingTasks && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', color: 'var(--primary)', fontWeight: 600 }}>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Syncing tasks...</span>
              </div>
            )}

            {/* View Container: Kanban or List */}
            {activeView === 'kanban' ? (
              <KanbanBoard
                tasks={tasks}
                onEdit={openEditTaskModal}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
                onOpenNewTask={openNewTaskModal}
              />
            ) : (
              <ListView
                tasks={tasks}
                onEdit={openEditTaskModal}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            )}
          </main>
        ) : (
          /* Welcome Guest Banner */
          <div className="glass-panel animate-fade" style={{
            padding: '40px 24px',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
            maxWidth: '680px',
            margin: '20px auto'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              boxShadow: 'var(--shadow-glow)'
            }}>
              <Sparkles size={28} color="#ffffff" />
            </div>

            <h2 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Welcome to TaskMaster</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Full-stack Task Management Web Application with cursor-based Dragon Background animation and real-time WebSockets.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => setIsAuthModalOpen(true)} style={{ padding: '10px 24px', fontSize: '0.95rem' }}>
                Sign In or Register
              </button>
              <button className="btn btn-secondary" onClick={() => setIsThemeModalOpen(true)} style={{ padding: '10px 24px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Flame size={16} color="var(--primary)" /> Customize Dragon & Background
              </button>
            </div>

            {/* Key Features Overview Pills */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginTop: '32px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={15} color="var(--primary)" /> Interactive Dragon Animation
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={15} color="var(--primary)" /> Real-time WebSockets
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={15} color="var(--primary)" /> Customizable Background & Themes
              </div>
            </div>
          </div>
        )}

        {/* Floating Quick-Access Customizable Background Button */}
        <button
          onClick={() => setIsThemeModalOpen(true)}
          className="glass-panel"
          title="Quick Customize Dragon & Background"
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '24px',
            zIndex: 900,
            borderRadius: '30px',
            padding: '10px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            border: '1.5px solid var(--primary)',
            background: 'var(--bg-glass)',
            boxShadow: 'var(--shadow-glow)',
            color: 'var(--text-main)',
            fontWeight: 700,
            fontSize: '0.82rem',
            transition: 'all 0.25 ease'
          }}
        >
          <Flame size={18} color="var(--primary)" style={{ filter: 'drop-shadow(0 0 6px var(--primary))' }} />
          <span>Background & Dragon</span>
        </button>

        {/* Mobile Floating Action Button (FAB) for logged-in users */}
        {user && (
          <button className="mobile-fab" onClick={() => openNewTaskModal('todo')} title="Create New Task">
            <Plus size={28} />
          </button>
        )}

        {/* Task Modal */}
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onSave={handleSaveTask}
          taskToEdit={taskToEdit}
          defaultStatus={defaultTaskStatus}
        />

        {/* Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={handleAuthSuccess}
        />

        {/* Theme & Background Dragon Selector Modal */}
        <ThemeSelectorModal
          isOpen={isThemeModalOpen}
          onClose={() => setIsThemeModalOpen(false)}
          theme={theme}
          setTheme={setTheme}
          bgColorMode={bgColorMode}
          setBgColorMode={setBgColorMode}
          customBgColor={customBgColor}
          setCustomBgColor={setCustomBgColor}
          enableCursorFx={enableCursorFx}
          setEnableCursorFx={setEnableCursorFx}
          enableCursorRing={enableCursorRing}
          setEnableCursorRing={setEnableCursorRing}
          bgAnimMode={bgAnimMode}
          setBgAnimMode={setBgAnimMode}
          dragonTheme={dragonTheme}
          setDragonTheme={setDragonTheme}
          dragonSize={dragonSize}
          setDragonSize={setDragonSize}
          dragonSpeed={dragonSpeed}
          setDragonSpeed={setDragonSpeed}
          enableFireBreath={enableFireBreath}
          setEnableFireBreath={setEnableFireBreath}
        />
      </div>
    </>
  );
}
