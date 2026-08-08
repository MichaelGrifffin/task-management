import React from 'react';
import { Edit3, Trash2, Calendar, Tag } from 'lucide-react';

function ListView({ tasks = [], onEdit, onDelete, onStatusChange }) {
  if (tasks.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '60px', borderRadius: 'var(--radius-lg)', textAlign: 'center', color: 'var(--text-muted)' }}>
        <h3>No tasks found</h3>
        <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>Try adjusting your filters or create a new task to get started.</p>
      </div>
    );
  }

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'urgent': return <span className="badge badge-priority-urgent">Urgent</span>;
      case 'high': return <span className="badge badge-priority-high">High</span>;
      case 'medium': return <span className="badge badge-priority-medium">Medium</span>;
      default: return <span className="badge badge-priority-low">Low</span>;
    }
  };

  return (
    <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '16px 20px', width: '140px' }}>Status</th>
              <th style={{ padding: '16px 20px' }}>Task</th>
              <th style={{ padding: '16px 20px', width: '120px' }}>Priority</th>
              <th style={{ padding: '16px 20px', width: '150px' }}>Due Date</th>
              <th style={{ padding: '16px 20px', width: '180px' }}>Tags</th>
              <th style={{ padding: '16px 20px', width: '100px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const taskId = task.id || task._id;
              const tagsList = task.tags ? task.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
              const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';

              return (
                <tr 
                  key={taskId} 
                  style={{
                    borderBottom: '1px solid var(--border-color)',
                    transition: 'background var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Status Dropdown */}
                  <td style={{ padding: '16px 20px' }}>
                    <select
                      value={task.status || 'todo'}
                      onChange={(e) => onStatusChange(taskId, e.target.value)}
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-input)',
                        color: task.status === 'completed' ? 'var(--status-completed)' :
                               task.status === 'in_progress' ? 'var(--status-in-progress)' : 'var(--status-todo)',
                        border: '1px solid var(--border-color)',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>

                  {/* Title & Desc */}
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                      color: task.status === 'completed' ? 'var(--text-muted)' : 'var(--text-main)'
                    }}>
                      {task.title}
                    </div>
                    {task.description && (
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {task.description}
                      </div>
                    )}
                  </td>

                  {/* Priority */}
                  <td style={{ padding: '16px 20px' }}>
                    {getPriorityBadge(task.priority)}
                  </td>

                  {/* Due Date */}
                  <td style={{ padding: '16px 20px', fontSize: '0.85rem' }}>
                    {task.due_date ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isOverdue ? '#ef4444' : 'var(--text-muted)', fontWeight: isOverdue ? 700 : 500 }}>
                        <Calendar size={14} />
                        <span>{new Date(task.due_date).toLocaleDateString()}</span>
                      </div>
                    ) : <span style={{ color: 'var(--text-muted)' }}>-</span>}
                  </td>

                  {/* Tags */}
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {tagsList.length > 0 ? (
                        tagsList.map((tag, idx) => (
                          <span key={idx} style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                            fontSize: '0.7rem',
                            padding: '2px 6px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--bg-input)',
                            color: 'var(--text-muted)'
                          }}>
                            <Tag size={9} /> {tag}
                          </span>
                        ))
                      ) : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>-</span>}
                    </div>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                      <button className="btn-icon" onClick={() => onEdit(task)} title="Edit Task">
                        <Edit3 size={15} />
                      </button>
                      <button className="btn-icon" onClick={() => onDelete(taskId)} title="Delete Task" style={{ color: '#ef4444' }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default React.memo(ListView);
