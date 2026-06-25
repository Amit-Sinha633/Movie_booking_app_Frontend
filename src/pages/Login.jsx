import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Film, Mail, Lock, LogIn } from "lucide-react";

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect target
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      // Error is already toasted in context
      console.error("Login component error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-dark-bg transition-colors duration-300">
      <div className="w-full max-w-md space-y-8 p-8 rounded-2xl bg-white dark:bg-dark-card shadow-xl border border-slate-200/50 dark:border-slate-800/60">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-2">
            <Film className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-450">
            Sign in to book tickets, manage reservations, and get offers.
          </p>
        </div>

        {/* Credentials Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="block w-full pl-10 pr-3 py-2 border border-slate-350 dark:border-slate-700/80 rounded-lg bg-slate-50 dark:bg-slate-900/40 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider block">
                Password
              </label>
              <a href="#" className="text-xs text-primary hover:underline font-semibold">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full pl-10 pr-3 py-2 border border-slate-355 dark:border-slate-700/80 rounded-lg bg-slate-50 dark:bg-slate-900/40 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary hover:bg-primary/95 text-white font-bold text-sm rounded-lg transition-all shadow-md shadow-primary/20 hover:shadow-lg disabled:opacity-50 mt-6"
          >
            <LogIn className="h-4.5 w-4.5" />
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Social Authentication */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="relative flex justify-center text-xs">
            <span className="bg-white dark:bg-dark-card px-3 text-slate-400 uppercase tracking-wider font-semibold">
              Or Sign In With
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => alert("Social Sign-in is coming soon!")}
              className="flex items-center justify-center gap-2 py-2 px-3 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <svg className="h-4 w-4 text-rose-500 fill-current" viewBox="0 0 24 24">
                <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.986 0-.746-.08-1.32-.176-1.887h-10.62z"/>
              </svg>
              Google
            </button>
            <button
              onClick={() => alert("Social Sign-in is coming soon!")}
              className="flex items-center justify-center gap-2 py-2 px-3 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <svg className="h-4 w-4 text-blue-600 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div>
        </div>

        {/* Footer Redirect */}
        <p className="text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:underline font-bold">
            Create Account
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;
