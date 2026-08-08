import React, { useState, useMemo } from 'react';
import TaskCard from './TaskCard';
import { Circle, Clock, CheckCircle2, Plus } from 'lucide-react';

export default function KanbanBoard({ tasks = [], onEdit, onDelete, onStatusChange, onOpenNewTask }) {
  const [mobileTab, setMobileTab] = useState('all'); // 'all' | 'todo' | 'in_progress' | 'completed'

  const columns = useMemo(() => [
    {
      id: 'todo',
      title: 'To Do',
      icon: <Circle size={18} color="var(--status-todo)" />,
      badgeClass: 'badge-todo',
      items: tasks.filter(t => (t.status || 'todo') === 'todo')
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      icon: <Clock size={18} color="var(--status-in-progress)" />,
      badgeClass: 'badge-in_progress',
      items: tasks.filter(t => t.status === 'in_progress')
    },
    {
      id: 'completed',
      title: 'Completed',
      icon: <CheckCircle2 size={18} color="var(--status-completed)" />,
      badgeClass: 'badge-completed',
      items: tasks.filter(t => t.status === 'completed')
    }
  ], [tasks]);

  const visibleColumns = useMemo(() => {
    return mobileTab === 'all' 
      ? columns 
      : columns.filter(col => col.id === mobileTab);
  }, [columns, mobileTab]);

  return (
    <div>
      {/* Mobile Quick Column Selector Tabs */}
      <div className="mobile-column-tabs" style={{
        display: 'none',
        gap: '6px',
        marginBottom: '16px',
        overflowX: 'auto',
        paddingBottom: '4px'
      }}>
        <button
          className={`btn ${mobileTab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setMobileTab('all')}
          style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
        >
          All Columns
        </button>
        {columns.map(col => (
          <button
            key={col.id}
            className={`btn ${mobileTab === col.id ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setMobileTab(col.id)}
            style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
          >
            {col.title} ({col.items.length})
          </button>
        ))}
      </div>

      {/* Grid Layout */}
      <div className="kanban-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
        gap: '20px',
        alignItems: 'start'
      }}>
        {visibleColumns.map(col => (
          <div key={col.id} className="glass-panel" style={{
            padding: '18px',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            minHeight: '380px'
          }}>
            {/* Column Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {col.icon}
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{col.title}</h2>
                <span className={`badge ${col.badgeClass}`}>
                  {col.items.length}
                </span>
              </div>

              <button className="btn-icon" onClick={() => onOpenNewTask(col.id)} title={`Add task to ${col.title}`}>
                <Plus size={18} />
              </button>
            </div>

            {/* Column Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
              {col.items.length > 0 ? (
                col.items.map(task => (
                  <TaskCard
                    key={task.id || task._id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                  />
                ))
              ) : (
                <div style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px dashed var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '24px',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem'
                }}>
                  No tasks here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
