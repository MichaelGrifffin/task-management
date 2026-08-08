import React, { useState } from 'react';
import { X, Lock, Mail, User, LogIn, UserPlus, CheckCircle2, XCircle, Eye, EyeOff } from 'lucide-react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  if (!isOpen) return null;

  // Real-time validations
  const isEmailValid = EMAIL_REGEX.test(email.trim());

  const passwordRules = {
    startsWithUppercase: /^[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password),
    validLength: password.length > 0 && password.length <= 10
  };

  const isPasswordValid = 
    passwordRules.startsWithUppercase &&
    passwordRules.hasNumber &&
    passwordRules.hasSpecialChar &&
    passwordRules.validLength;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setTouched({ email: true, password: true });

    if (!isLogin && !username.trim()) {
      setError('Please enter a username');
      return;
    }

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!isEmailValid) {
      setError('Please enter a valid email address (e.g. user@example.com)');
      return;
    }

    if (!password) {
      setError('Please enter a password');
      return;
    }

    if (!isPasswordValid) {
      if (!passwordRules.startsWithUppercase) {
        setError('Password must start with an uppercase letter (A-Z)');
      } else if (!passwordRules.hasNumber) {
        setError('Password must contain at least one number (0-9)');
      } else if (!passwordRules.hasSpecialChar) {
        setError('Password must contain at least one special character (e.g. !@#$%^&*)');
      } else if (password.length > 10) {
        setError('Password length cannot exceed 10 characters');
      }
      return;
    }

    setLoading(true);
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin ? { email, password } : { username, email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      onAuthSuccess(data.user, data.token);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setError('');
    setTouched({ email: false, password: false });
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-card animate-fade" style={{
        maxWidth: '460px',
        width: '100%',
        borderRadius: 'var(--radius-lg)',
        padding: '28px',
        position: 'relative'
      }}>
        <button className="btn-icon" onClick={onClose} style={{ position: 'absolute', right: '20px', top: '20px' }}>
          <X size={20} />
        </button>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <button
            type="button"
            onClick={() => { setIsLogin(true); resetForm(); }}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              background: 'transparent',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '1.05rem',
              color: isLogin ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: isLogin ? '2px solid var(--primary)' : '2px solid transparent',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); resetForm(); }}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              background: 'transparent',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '1.05rem',
              color: !isLogin ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: !isLogin ? '2px solid var(--primary)' : '2px solid transparent',
              cursor: 'pointer'
            }}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#ef4444',
            fontSize: '0.85rem',
            marginBottom: '16px',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <XCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group" style={{ marginBottom: '16px' }}>
              <label className="input-label">Username</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. alex_developer"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>
          )}

          {/* Email Input */}
          <div className="input-group" style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="input-label" style={{ marginBottom: 0 }}>Email Address</label>
              {email.length > 0 && (
                <span style={{ fontSize: '0.75rem', color: isEmailValid ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {isEmailValid ? (
                    <><CheckCircle2 size={12} /> Valid email</>
                  ) : (
                    <><XCircle size={12} /> Invalid format</>
                  )}
                </span>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                className="input-field"
                placeholder="alex@example.com"
                value={email}
                onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                style={{
                  paddingLeft: '38px',
                  borderColor: touched.email && email.length > 0 ? (isEmailValid ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)') : undefined
                }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="input-group" style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="input-label" style={{ marginBottom: 0 }}>Password</label>
              <span style={{ fontSize: '0.75rem', color: password.length > 10 ? '#ef4444' : 'var(--text-muted)' }}>
                {password.length}/10 max
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="e.g. Pass123!"
                value={password}
                maxLength={12}
                onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                style={{
                  paddingLeft: '38px',
                  paddingRight: '38px',
                  borderColor: touched.password && password.length > 0 ? (isPasswordValid ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)') : undefined
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Password Validation Requirements Checklist */}
            <div style={{
              marginTop: '10px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-color)',
              fontSize: '0.78rem',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '6px 12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: passwordRules.startsWithUppercase ? '#10b981' : 'var(--text-muted)' }}>
                {passwordRules.startsWithUppercase ? <CheckCircle2 size={13} /> : <XCircle size={13} style={{ opacity: 0.5 }} />}
                <span>Starts with Uppercase</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: passwordRules.hasNumber ? '#10b981' : 'var(--text-muted)' }}>
                {passwordRules.hasNumber ? <CheckCircle2 size={13} /> : <XCircle size={13} style={{ opacity: 0.5 }} />}
                <span>Contains a Number</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: passwordRules.hasSpecialChar ? '#10b981' : 'var(--text-muted)' }}>
                {passwordRules.hasSpecialChar ? <CheckCircle2 size={13} /> : <XCircle size={13} style={{ opacity: 0.5 }} />}
                <span>Special Char (!@#$...)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: passwordRules.validLength ? '#10b981' : (password.length > 10 ? '#ef4444' : 'var(--text-muted)') }}>
                {passwordRules.validLength ? <CheckCircle2 size={13} /> : <XCircle size={13} style={{ opacity: 0.5 }} />}
                <span>Max 10 Chars</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '12px', padding: '12px' }}
          >
            {loading ? 'Processing...' : isLogin ? (
              <><LogIn size={18} /> Sign In</>
            ) : (
              <><UserPlus size={18} /> Register Account</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

