import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "../components/LoadingSpinner";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please fill in email and password.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await API.post("/auth/login", {
        email: form.email.trim(),
        password: form.password.trim()
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate(data.role === "doctor" ? "/doctor" : "/patient");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.12,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.4, ease: "easeInOut" }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingSpinner />}
      </AnimatePresence>
      <motion.div 
      initial="hidden"
      animate="visible"
      exit="exit"
      className="auth-page"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1.2 }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
        className="bg-orb bg-orb-left" 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1.1 }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "mirror", delay: 1 }}
        className="bg-orb bg-orb-right" 
      />

      <motion.div 
        variants={containerVariants}
        className="auth-card glass"
      >
        <motion.p variants={childVariants} className="eyebrow">
          Welcome Back
        </motion.p>
        <motion.h2 variants={childVariants}>Sign in to continue</motion.h2>
        <motion.p variants={childVariants} className="subtitle">
          Book and manage appointments with role-based access.
        </motion.p>

        <motion.form 
          variants={childVariants}
          className="form-grid" 
          onSubmit={handleSubmit}
        >
          <motion.label variants={childVariants}>
            Email
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
            />
          </motion.label>

          <motion.label variants={childVariants}>
            Password
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
            />
          </motion.label>

          {error && (
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="error-text"
            >
              {error}
            </motion.p>
          )}

          <motion.button 
            variants={childVariants}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(13, 148, 136, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-primary" 
            type="submit" 
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </motion.button>
        </motion.form>

        <motion.p 
          variants={childVariants}
          className="helper-text"
        >
          New user? <Link to="/register">Create an account</Link>
        </motion.p>
      </motion.div>
    </motion.div>
    </>
  );
}

export default Login;