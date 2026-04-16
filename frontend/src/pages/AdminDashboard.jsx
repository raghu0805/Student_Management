import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, Users, Pencil, Trash, 
  LogOut, LayoutDashboard, Search,
  X, Save, Loader2 
} from 'lucide-react';
import { formatError } from '../utils/error';


const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', course: '', year: 1 });

  const [error, setError] = useState('');
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const resp = await api.get('/api/v1/students/get-students');
      setStudents(resp.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch students. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (editingId) {
        // According to routes/students.py, standard student update by admin is not clearly exposed as PUT /{id} except for /me.
        // Wait, looking back at students.py:
        // @router.put("/me") update_my_data
        // @router.post("/") create_student
        // @router.delete("/{id}") delete_student
        // Seems PUT student {id} is missing in backend? Let me re-verify students.py.
        // It has @router.get("/{id}"), @router.delete("/{id}").
        // I should probably add an update endpoint for admin OR stick to what's there.
        // Actually, user said "I build the backend". I shouldn't fix backend unless necessary.
        // Let's check schemas/student.py or similar for update logic if any.
      } else {
        await api.post('/api/v1/students/', formData);
      }
      setShowModal(false);
      setFormData({ name: '', email: '', course: '', year: 1 });
      fetchStudents();
    } catch (err) {
      setError(formatError(err.response) || 'Action failed.');
    } finally {

      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await api.delete(`/api/v1/students/${id}`);
      fetchStudents();
    } catch (err) {
      setError('Delete failed.');
    }
  };

  const openEdit = (s) => {
    setEditingId(s.id);
    setFormData({ name: s.name, email: s.email, course: s.course, year: s.year });
    setShowModal(true);

  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', padding: '0 0.5rem' }}>
          <div style={{ padding: '0.5rem', background: 'var(--primary)', borderRadius: '0.5rem' }}>
            <Users size={20} color="white" />
          </div>
          <span style={{ fontWeight: '700', fontSize: '1.25rem' }}>StudentPortal</span>
        </div>
        
        <nav>
          <a href="#" className="nav-link active">
            <LayoutDashboard size={20} />
            Dashboard
          </a>
          <a href="#" className="nav-link" onClick={logout}>
            <LogOut size={20} />
            Logout
          </a>
        </nav>

        <div style={{ marginTop: 'auto', padding: '1rem', background: 'var(--bg)', borderRadius: '0.75rem' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Logged in as</p>
          <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text)', wordBreak: 'break-all' }}>{user?.email}</p>
          <span className="badge badge-admin" style={{ marginTop: '0.5rem', display: 'inline-block' }}>Administrator</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '700' }}>Admin Dashboard</h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage student profiles and academic records</p>
          </div>
          <button className="btn btn-primary" style={{ width: 'auto', display: 'flex', gap: '0.5rem', alignItems: 'center' }} onClick={() => { setEditingId(null); setFormData({ name: '', email: '', course: '', year: 1 }); setShowModal(true); }}>

            <Plus size={20} />
            Add Student
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="grid" style={{ marginBottom: '2rem' }}>
          <div className="stat-card">
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Students</p>
            <h2 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{students.length}</h2>
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <Loader2 className="animate-spin" size={40} style={{ margin: '0 auto' }} />
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: '600' }}>{s.name}</td>
                    <td>{s.email}</td>
                    <td>{s.course}</td>
                    <td><span className="badge badge-student">Active</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        {/* <button className="btn" style={{ padding: '0.4rem', border: '1px solid var(--border)', background: 'transparent' }} onClick={() => openEdit(s)}>
                          <Pencil size={16} color="var(--text-muted)" />
                        </button> */}
                        <button className="btn" style={{ padding: '0.5rem', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'transparent' }} onClick={() => handleDelete(s.id)}>
                          <Trash size={16} color="var(--danger)" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No students found. Add your first student to get started.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem' }}>{editingId ? 'Edit Student' : 'Add New Student'}</h2>
              <X style={{ cursor: 'pointer' }} onClick={() => setShowModal(false)} />
            </div>
            <form onSubmit={handleCreateOrUpdate}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email (Must have account)</label>
                <input className="form-input" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Course</label>
                <input className="form-input" value={formData.course} onChange={e => setFormData({ ...formData, course: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Year of Study</label>
                <input className="form-input" type="number" value={formData.year} onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) || 1 })} required />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn" style={{ background: 'transparent', border: '1px solid var(--border)' }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" size={18} /> : 'Save Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
