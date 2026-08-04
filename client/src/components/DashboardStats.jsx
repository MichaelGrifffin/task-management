import React from 'react';
import { CheckCircle2, Clock, AlertCircle, Layers, TrendingUp } from 'lucide-react';

export default function DashboardStats({ tasks }) {
  const total = tasks.length;
  const todoCount = tasks.filter(t => t.status === 'todo').length;
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const urgentCount = tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').length;

  const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '16px',
      marginBottom: '28px'
    }}>
      {/* Total Tasks */}
      <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
          <Layers size={26} />
        </div>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Tasks</span>
          <h2 style={{ fontSize: '1.8rem', marginTop: '2px' }}>{total}</h2>
        </div>
      </div>

      {/* In Progress */}
      <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24' }}>
          <Clock size={26} />
        </div>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>In Progress</span>
          <h2 style={{ fontSize: '1.8rem', marginTop: '2px', color: '#fbbf24' }}>{inProgressCount}</h2>
        </div>
      </div>

      {/* Completed */}
      <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'rgba(52, 211, 153, 0.15)', color: '#34d399' }}>
          <CheckCircle2 size={26} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Completed</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34d399' }}>{percentage}%</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', marginTop: '2px', color: '#34d399' }}>{completedCount}</h2>
          
          {/* Progress bar */}
          <div style={{ width: '100%', height: '6px', background: 'var(--bg-input)', borderRadius: '3px', marginTop: '8px', overflow: 'hidden' }}>
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
      <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
          <AlertCircle size={26} />
        </div>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Urgent Pending</span>
          <h2 style={{ fontSize: '1.8rem', marginTop: '2px', color: '#ef4444' }}>{urgentCount}</h2>
        </div>
      </div>
    </div>
  );
}
