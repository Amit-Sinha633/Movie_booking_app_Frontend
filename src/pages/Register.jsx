import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Film, User, Mail, Lock, UserPlus } from "lucide-react";
import { toast } from "react-hot-toast";

function Register() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password ) return;

    setName("")
    setEmail("")
    setPassword("")

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    setLoading(true);
    try {
      // Backend expects: name, email, password, and optional userRole/userStatus
      const response = await register({
    name,
    email,
    password
  });

  if (response) {
    toast.success("Registration successful");
    navigate("/login");
  }
    } catch (err) {
      console.error("Register page error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-dark-bg transition-colors duration-300">
      <div className="w-full max-w-md space-y-8 p-8 rounded-2xl bg-white dark:bg-dark-card shadow-xl border border-slate-200/50 dark:border-slate-800/60">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-2">
            <Film className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Create Account
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-450">
            Sign up to get personalized recommendations and movie tickets.
          </p>
        </div>

        {/* Signup Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider block">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="block w-full pl-10 pr-3 py-2 border border-slate-350 dark:border-slate-700/80 rounded-lg bg-slate-50 dark:bg-slate-900/40 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all"
              />
            </div>
          </div>

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
                placeholder="john@example.com"
                className="block w-full pl-10 pr-3 py-2 border border-slate-350 dark:border-slate-700/80 rounded-lg bg-slate-50 dark:bg-slate-900/40 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider block">
                Password
              </label>
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
                  className="block w-full pl-10 pr-3 py-2 border border-slate-350 dark:border-slate-700/80 rounded-lg bg-slate-50 dark:bg-slate-900/40 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary hover:bg-primary/95 text-white font-bold text-sm rounded-lg transition-all shadow-md shadow-primary/20 hover:shadow-lg disabled:opacity-50 mt-6"
          >
            <UserPlus className="h-4.5 w-4.5" />
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Footer Redirect */}
        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline font-bold">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;
