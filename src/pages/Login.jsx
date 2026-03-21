import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ usernameOrEmail: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(form);
    setLoading(false);
    if (res.success) {
      toast.success('Logged in');
      navigate('/');
    } else {
      toast.error(res.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Login</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300">Email or Username</label>
          <input name="usernameOrEmail" value={form.usernameOrEmail} onChange={handleChange} className="w-full mb-3 px-3 py-2 rounded border" />
          <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300">Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full mb-4 px-3 py-2 rounded border" />
          <button type="submit" disabled={loading} className="w-full py-2 bg-primary-600 text-white rounded">{loading ? 'Logging...' : 'Login'}</button>
        </form>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">Don't have an account? <Link to="/signup" className="text-primary-600">Sign up</Link></p>
      </div>
    </div>
  );
}
