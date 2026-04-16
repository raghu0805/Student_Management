import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { User, Save, LogOut, Loader2, BookOpen, GraduationCap } from 'lucide-react';
import { formatError } from '../utils/error';


const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState(1);
  const [loading, setLoading] = useState(true);

  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const resp = await api.get('/api/v1/students/me');
      setProfile(resp.data);
      setName(resp.data.name);
      setCourse(resp.data.course);
      setYear(resp.data.year || 1);

    } catch (err) {
      console.error(err);
      setError('Student record not yet created by Admin.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUpdating(true);
    try {
      await api.put('/api/v1/students/me', { name, course, year });
      setSuccess('Profile updated successfully!');

      fetchProfile();
    } catch (err) {
      setError(formatError(err.response) || 'Failed to update profile.');
    } finally {

      setUpdating(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg)' }}>
      <Loader2 className="animate-spin" size={48} color="var(--primary)" />
    </div>
  );

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', padding: '0 0.5rem' }}>
          <div style={{ padding: '0.5rem', background: 'var(--primary)', borderRadius: '0.5rem' }}>
            <GraduationCap size={20} color="white" />
          </div>
          <span style={{ fontWeight: '700', fontSize: '1.25rem' }}>StudentCenter</span>
        </div>
        
        <nav>
          <a href="#" className="nav-link active">
            <User size={20} />
            My Profile
          </a>
          <a href="#" className="nav-link" onClick={logout}>
            <LogOut size={20} />
            Logout
          </a>
        </nav>

        <div style={{ marginTop: 'auto', padding: '1rem', background: 'var(--bg)', borderRadius: '0.75rem' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Logged in as</p>
          <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text)', wordBreak: 'break-all' }}>{user?.email}</p>
          <span className="badge badge-student" style={{ marginTop: '0.5rem', display: 'inline-block' }}>Student Portal</span>
        </div>
      </aside>

      <main className="main-content">
        <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '2rem' }}>Welcome, {profile?.name || 'Student'}</h1>

        <div className="grid">
          <div className="card" style={{ maxWidth: 'none', padding: '2rem' }}>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <User size={18} />
                  </div>
                  <input className="form-input" style={{ paddingLeft: '2.5rem' }} value={name} onChange={e => setName(e.target.value)} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email (Read-only)</label>
                <input className="form-input" value={profile?.email || ''} readOnly style={{ background: 'rgba(0,0,0,0.1)', cursor: 'not-allowed', color: 'var(--text-muted)' }} />
              </div>

              <div className="form-group">
                <label className="form-label">Course / Dept</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <BookOpen size={18} />
                  </div>
                  <input className="form-input" style={{ paddingLeft: '2.5rem' }} value={course} onChange={e => setCourse(e.target.value)} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Year of Study</label>
                <input className="form-input" type="number" value={year} onChange={e => setYear(parseInt(e.target.value) || 1)} required />
              </div>


              <button className="btn btn-primary" style={{ display: 'flex', width: 'auto', padding: '0.75rem 2rem', gap: '0.5rem', alignItems: 'center' }} disabled={updating || !profile}>
                {updating ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Update Profile</>}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
