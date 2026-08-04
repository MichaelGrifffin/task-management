import React from 'react';
import { CheckCircle2, Clock, AlertCircle, Layers } from 'lucide-react';

export default function DashboardStats({ tasks }) {
  const total = tasks.length;
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const urgentCount = tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').length;

  const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return (
    <div className="stats-grid" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    }}>
      {/* Total Tasks */}
      <div className="glass-panel" style={{ padding: '18px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1', display: 'flex' }}>
          <Layers size={22} />
        </div>
        <div>
          <span className="stat-card-title" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Tasks</span>
          <h2 className="stat-card-value" style={{ fontSize: '1.7rem', marginTop: '2px' }}>{total}</h2>
        </div>
      </div>

      {/* In Progress */}
      <div className="glass-panel" style={{ padding: '18px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', display: 'flex' }}>
          <Clock size={22} />
        </div>
        <div>
          <span className="stat-card-title" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>In Progress</span>
          <h2 className="stat-card-value" style={{ fontSize: '1.7rem', marginTop: '2px', color: '#fbbf24' }}>{inProgressCount}</h2>
        </div>
      </div>

      {/* Completed */}
      <div className="glass-panel" style={{ padding: '18px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', display: 'flex' }}>
          <CheckCircle2 size={22} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span className="stat-card-title" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Completed</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399' }}>{percentage}%</span>
          </div>
          <h2 className="stat-card-value" style={{ fontSize: '1.7rem', marginTop: '2px', color: '#34d399' }}>{completedCount}</h2>
          
          {/* Progress bar */}
          <div style={{ width: '100%', height: '5px', background: 'var(--bg-input)', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${percentage}%`,
              background: 'linear-gradient(90deg, #34d399, #10b981)',
              transition: 'width 0.5s ease-in-out'
            }} />
          </div>
        </div>
      </div>

      {/* Urgent Warning */}
      <div className="glass-panel" style={{ padding: '18px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex' }}>
          <AlertCircle size={22} />
        </div>
        <div>
          <span className="stat-card-title" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Urgent Pending</span>
          <h2 className="stat-card-value" style={{ fontSize: '1.7rem', marginTop: '2px', color: '#ef4444' }}>{urgentCount}</h2>
        </div>
      </div>
    </div>
  );
}
