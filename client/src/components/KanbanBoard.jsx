import React from 'react';
import TaskCard from './TaskCard';
import { Circle, Clock, CheckCircle2, Plus } from 'lucide-react';

export default function KanbanBoard({ tasks, onEdit, onDelete, onStatusChange, onOpenNewTask }) {
  const columns = [
    {
      id: 'todo',
      title: 'To Do',
      icon: <Circle size={18} color="var(--status-todo)" />,
      badgeClass: 'badge-todo',
      items: tasks.filter(t => t.status === 'todo')
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
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '20px',
      alignItems: 'start'
    }}>
      {columns.map(col => (
        <div key={col.id} className="glass-panel" style={{
          padding: '20px',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          minHeight: '450px'
        }}>
          {/* Column Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {col.icon}
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{col.title}</h2>
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
                  key={task.id}
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
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 20px',
                border: '2px dashed var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-subtle)',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '0.85rem', marginBottom: '8px' }}>No tasks in {col.title}</p>
                <button
                  className="btn btn-secondary"
                  onClick={() => onOpenNewTask(col.id)}
                  style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                >
                  <Plus size={14} /> Add Task
                </button>
              </div>
            )}
          </div>

        </div>
      ))}
    </div>
  );
}
