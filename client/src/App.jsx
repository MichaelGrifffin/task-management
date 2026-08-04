import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import DashboardStats from './components/DashboardStats';
import KanbanBoard from './components/KanbanBoard';
import ListView from './components/ListView';
import TaskModal from './components/TaskModal';
import AuthModal from './components/AuthModal';
import AnimatedBackground from './components/AnimatedBackground';
import { Sparkles, CheckCircle2, Loader2 } from 'lucide-react';

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
  
  // Theme state: 'midnight' | 'emerald' | 'sunset' | 'crimson'
  const [theme, setTheme] = useState(localStorage.getItem('app-theme') || 'midnight');

  // Set theme attribute on html body & save choice
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

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
      {/* Animated Canvas Background adapting to active color theme */}
      <AnimatedBackground theme={theme} />

      <div className="app-container">
        {/* Top Navbar */}
        <Navbar
          user={user}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onLogout={logout}
          onOpenNewTask={() => openNewTaskModal('todo')}
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', color: 'var(--primary)', fontWeight: 600 }}>
                <Loader2 size={20} className="spin-icon" style={{ animation: 'spin 1s linear infinite' }} />
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
            padding: '60px 40px',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
            maxWidth: '680px',
            margin: '40px auto'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              boxShadow: 'var(--shadow-glow)'
            }}>
              <Sparkles size={32} color="#ffffff" />
            </div>

            <h2 style={{ fontSize: '2.2rem', marginBottom: '12px' }}>Welcome to TaskMaster</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '28px' }}>
              Full-stack Task Management Web Application with custom dynamic color themes, SQLite database persistence, JWT authentication, and WebSockets.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => setIsAuthModalOpen(true)} style={{ padding: '12px 28px', fontSize: '1rem' }}>
                Sign In or Register
              </button>
            </div>

            {/* Key Features Overview Pills */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginTop: '40px', paddingTop: '28px', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={16} color="var(--primary)" /> JWT Authentication
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={16} color="var(--primary)" /> Real-time WebSockets
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={16} color="var(--primary)" /> Kanban & List Views
              </div>
            </div>
          </div>
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
      </div>
    </>
  );
}
