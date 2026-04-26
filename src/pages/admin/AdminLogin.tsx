import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/admins/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      login(data.token, data.admin);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-uhs-light relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-uhs-maroon transform -skew-y-3 origin-top-right z-0"></div>

      <div className="relative z-10 w-full max-w-md p-8 bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-t-4 border-uhs-orange transform transition-all duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]">

        {/* Logo Area */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div>
            <img
              src="https://res.cloudinary.com/dzpt7zwvf/image/upload/v1777059950/copy_of_screenshot_2026-04-25_010807_dyoqwf_e0435a.png"
              alt="Logo"
              className="w-20 h-20 bg-uhs-maroon text-white rounded-full flex items-center justify-center font-bold text-2xl tracking-widest shadow-inner mb-3 border-4 border-uhs-orange/20"
            />
          </div>
          <h2 className="text-2xl font-heading font-black text-uhs-dark uppercase tracking-wider text-center">
            Admin Portal
          </h2>
          <p className="text-gray-500 text-sm mt-1">Sign in to manage your website</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm animate-shake">
            <p className="font-bold">Login Failed</p>
            <p>{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-uhs-dark mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-uhs-maroon focus:border-transparent transition-all duration-200"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-uhs-dark mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-uhs-maroon focus:border-transparent transition-all duration-200"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" type="checkbox" className="h-4 w-4 text-uhs-maroon focus:ring-uhs-maroon border-gray-300 rounded cursor-pointer" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-uhs-maroon hover:text-uhs-orange transition-colors">
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white transition-all duration-200 uppercase tracking-wider ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-uhs-maroon hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-uhs-maroon'}`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
