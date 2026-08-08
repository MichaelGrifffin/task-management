import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from './components/Navbar';
import DashboardStats from './components/DashboardStats';
import KanbanBoard from './components/KanbanBoard';
import ListView from './components/ListView';
import TaskModal from './components/TaskModal';
import AuthModal from './components/AuthModal';
import AnimatedBackground from './components/AnimatedBackground';
import CursorFollower from './components/CursorFollower';
import ThemeSelectorModal from './components/ThemeSelectorModal';
import { Sparkles, CheckCircle2, Loader2, Plus, Flower } from 'lucide-react';

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
  
  // Theme & Background State
  const [theme, setTheme] = useState(localStorage.getItem('app-theme') || 'midnight');
  const [bgColorMode, setBgColorMode] = useState(localStorage.getItem('app-bg-mode') || 'theme');
  const [customBgColor, setCustomBgColor] = useState(localStorage.getItem('app-custom-bg') || '#0b0f19');
  const [enableCursorFx, setEnableCursorFx] = useState(
    localStorage.getItem('app-cursor-fx') !== 'false'
  );
  const [enableCursorRing, setEnableCursorRing] = useState(
    localStorage.getItem('app-cursor-ring') !== 'false'
  );

  // Cursor Flower Customizer State
  const [bgAnimMode, setBgAnimMode] = useState(localStorage.getItem('app-bg-anim-mode') || 'flowers');
  const [flowerTheme, setFlowerTheme] = useState(localStorage.getItem('app-flower-theme') || 'sakura');
  const [flowerSize, setFlowerSize] = useState(
    parseFloat(localStorage.getItem('app-flower-size')) || 1.0
  );
  const [flowerDensity, setFlowerDensity] = useState(
    parseFloat(localStorage.getItem('app-flower-density')) || 1.0
  );
  const [enablePetalSparks, setEnablePetalSparks] = useState(
    localStorage.getItem('app-petal-sparks') !== 'false'
  );

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [defaultTaskStatus, setDefaultTaskStatus] = useState('todo');
  const [wsConnected, setWsConnected] = useState(false);

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
    localStorage.setItem('app-flower-theme', flowerTheme);
  }, [flowerTheme]);

  useEffect(() => {
    localStorage.setItem('app-flower-size', flowerSize.toString());
  }, [flowerSize]);

  useEffect(() => {
    localStorage.setItem('app-flower-density', flowerDensity.toString());
  }, [flowerDensity]);

  useEffect(() => {
    localStorage.setItem('app-petal-sparks', enablePetalSparks.toString());
  }, [enablePetalSparks]);

  // Auth User Check
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ id: payload.id, username: payload.username, email: payload.email });
      } catch (err) {
        console.error('Invalid token', err);
        logout();
      }
    }
  }, [token]);

  // Fetch Tasks API
  const fetchTasks = useCallback(async () => {
    if (!token) return;
    setLoadingTasks(true);
    try {
      const res = await fetch('/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(Array.isArray(data) ? data : (data.tasks || []));
      } else if (res.status === 401) {
        logout();
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoadingTasks(false);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, fetchTasks]);

  // WebSocket Connection
  useEffect(() => {
    if (!user || !token) return;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}?token=${token}`;
    let socket;

    try {
      socket = new WebSocket(wsUrl);
      socket.onopen = () => setWsConnected(true);
      socket.onclose = () => setWsConnected(false);
      socket.onerror = () => setWsConnected(false);
      socket.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'TASK_CREATED' || msg.type === 'TASK_UPDATED' || msg.type === 'TASK_DELETED') {
            fetchTasks();
          }
        } catch (e) {
          console.error('WS Error:', e);
        }
      };
    } catch (err) {
      console.error('WebSocket connection failed', err);
    }

    return () => {
      if (socket) socket.close();
    };
  }, [user, token, fetchTasks]);

  const handleAuthSuccess = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setTasks([]);
  };

  const handleSaveTask = async (taskData) => {
    try {
      const editId = taskToEdit ? (taskToEdit.id || taskToEdit._id) : null;
      const url = editId ? `/api/tasks/${editId}` : '/api/tasks';
      const method = editId ? 'PUT' : 'POST';

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
        setIsTaskModalOpen(false);
      }
    } catch (err) {
      console.error('Error saving task:', err);
    }
  };

  const handleMoveTask = async (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => ((t.id || t._id) === taskId || String(t.id || t._id) === String(taskId) ? { ...t, status: newStatus } : t))
    );

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) {
        fetchTasks();
      }
    } catch (err) {
      console.error('Error moving task:', err);
      fetchTasks();
    }
  };

  const handleDeleteTask = async (taskId) => {
    setTasks((prev) => prev.filter((t) => (t.id || t._id) !== taskId && String(t.id || t._id) !== String(taskId)));
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

  // Filter tasks with useMemo for fast instant updates
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q || (t.title && t.title.toLowerCase().includes(q)) || (t.description && t.description.toLowerCase().includes(q));
      const matchStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter;
      return matchQuery && matchStatus && matchPriority;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  return (
    <>
      {/* Animated Canvas Background with Cursor Flower Animation */}
      <AnimatedBackground
        theme={theme}
        bgColor={getEffectiveBgColor()}
        enableCursorFx={enableCursorFx}
        bgAnimMode={bgAnimMode}
        flowerTheme={flowerTheme}
        flowerSize={flowerSize}
        flowerDensity={flowerDensity}
        enablePetalSparks={enablePetalSparks}
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
                tasks={filteredTasks}
                onEdit={openEditTaskModal}
                onDelete={handleDeleteTask}
                onStatusChange={handleMoveTask}
                onOpenNewTask={openNewTaskModal}
              />
            ) : (
              <ListView
                tasks={filteredTasks}
                onEdit={openEditTaskModal}
                onDelete={handleDeleteTask}
                onStatusChange={handleMoveTask}
              />
            )}
          </main>
        ) : (
          /* Guest Hero Banner */
          <div className="glass-panel" style={{ maxWidth: '780px', margin: '60px auto', padding: '48px', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'inline-flex', padding: '12px', background: 'var(--bg-glass-hover)', borderRadius: '50%', marginBottom: '20px', boxShadow: 'var(--shadow-glow)' }}>
              <Sparkles size={42} color="var(--primary)" />
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em' }}>
              TaskMaster Pro
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '32px', lineHeight: 1.6 }}>
              A high-performance real-time task management workstation with live WebSockets sync, Kanban drag-and-drop, and interactive cursor-based flower background animations.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <button className="btn btn-primary" onClick={() => setIsAuthModalOpen(true)} style={{ padding: '12px 28px', fontSize: '1rem' }}>
                Get Started / Sign In
              </button>
            </div>

            {/* Key Features Overview Pills */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginTop: '32px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={15} color="var(--primary)" /> Cursor Flower Animation
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={15} color="var(--primary)" /> Real-time WebSockets Sync
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
          title="Quick Customize Flowers & Background"
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
          <Flower size={18} color="var(--primary)" style={{ filter: 'drop-shadow(0 0 6px var(--primary))' }} />
          <span>Background & Flowers</span>
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

        {/* Theme & Background Flower Selector Modal */}
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
          flowerTheme={flowerTheme}
          setFlowerTheme={setFlowerTheme}
          flowerSize={flowerSize}
          setFlowerSize={setFlowerSize}
          flowerDensity={flowerDensity}
          setFlowerDensity={setFlowerDensity}
          enablePetalSparks={enablePetalSparks}
          setEnablePetalSparks={setEnablePetalSparks}
        />
      </div>
    </>
  );
}
