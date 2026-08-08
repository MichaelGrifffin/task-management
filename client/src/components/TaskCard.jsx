import React from 'react';
import { Calendar, Edit3, Trash2, Tag } from 'lucide-react';

function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'urgent': return <span className="badge badge-priority-urgent">Urgent</span>;
      case 'high': return <span className="badge badge-priority-high">High</span>;
      case 'medium': return <span className="badge badge-priority-medium">Medium</span>;
      default: return <span className="badge badge-priority-low">Low</span>;
    }
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';
  const tagsList = task.tags ? task.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
  const taskId = task.id || task._id;

  return (
    <div className="glass-panel animate-fade" style={{
      padding: '18px',
      borderRadius: 'var(--radius-md)',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      transition: 'transform var(--transition-fast), border-color var(--transition-fast)',
      borderLeft: task.status === 'completed' ? '4px solid var(--status-completed)' : 
                 task.status === 'in_progress' ? '4px solid var(--status-in-progress)' : '4px solid var(--status-todo)'
    }}>
      
      {/* Top Meta: Priority & Quick Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          {getPriorityBadge(task.priority)}
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          <button className="btn-icon" onClick={() => onEdit(task)} title="Edit Task">
            <Edit3 size={15} />
          </button>
          <button className="btn-icon" onClick={() => onDelete(taskId)} title="Delete Task" style={{ color: '#ef4444' }}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Title & Description */}
      <div>
        <h3 style={{
          fontSize: '1.05rem',
          fontWeight: 700,
          textDecoration: task.status === 'completed' ? 'line-through' : 'none',
          color: task.status === 'completed' ? 'var(--text-muted)' : 'var(--text-main)',
          marginBottom: '4px'
        }}>
          {task.title}
        </h3>

        {task.description && (
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {task.description}
          </p>
        )}
      </div>

      {/* Tags */}
      {tagsList.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {tagsList.map((tag, idx) => (
            <span key={idx} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.72rem',
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-input)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-color)'
            }}>
              <Tag size={10} /> {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer: Due Date & Status Switcher */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '10px',
        borderTop: '1px solid var(--border-color)',
        fontSize: '0.78rem',
        color: 'var(--text-muted)'
      }}>
        {task.due_date ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isOverdue ? '#ef4444' : 'var(--text-muted)', fontWeight: isOverdue ? 700 : 500 }}>
            <Calendar size={13} />
            <span>{new Date(task.due_date).toLocaleDateString()}</span>
          </div>
        ) : <div />}

        <select
          value={task.status || 'todo'}
          onChange={(e) => onStatusChange(taskId, e.target.value)}
          style={{
            background: 'var(--bg-surface)',
            color: 'var(--text-main)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            padding: '4px 8px',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

    </div>
  );
}

export default React.memo(TaskCard);
