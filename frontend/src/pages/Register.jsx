import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "../components/LoadingSpinner";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    department: "Cardiology"
  });

  const DEPARTMENTS = [
    "Cardiology",
    "Dermatology",
    "General Medicine",
    "Neurology",
    "Orthopedics",
    "Pediatrics"
  ];
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name || !form.email || !form.password) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      await API.post("/auth/register", {
        ...form,
        email: form.email.trim(),
        password: form.password.trim()
      });
      setSuccess("Registration successful. Redirecting to login...");
      setTimeout(() => navigate("/"), 900);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
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
        staggerChildren: 0.1,
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
          Create Account
        </motion.p>
        <motion.h2 variants={childVariants}>Start using the portal</motion.h2>

        <motion.form 
          variants={childVariants}
          className="form-grid" 
          onSubmit={handleSubmit}
        >
          <motion.label variants={childVariants}>
            Full Name
            <input
              type="text"
              name="name"
              placeholder="Your full name"
              value={form.name}
              onChange={handleChange}
            />
          </motion.label>

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
              placeholder="Choose a password"
              value={form.password}
              onChange={handleChange}
            />
          </motion.label>

          <motion.label variants={childVariants}>
            Role
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </motion.label>

          {form.role === "doctor" && (
            <motion.label variants={childVariants}>
              Department
              <select name="department" value={form.department} onChange={handleChange}>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </motion.label>
          )}

          {error && (
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="error-text"
            >
              {error}
            </motion.p>
          )}
          {success && (
            <motion.p 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="success-text"
            >
              {success}
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
            {loading ? "Creating account..." : "Register"}
          </motion.button>
        </motion.form>

        <motion.p 
          variants={childVariants}
          className="helper-text"
        >
          Already registered? <Link to="/">Login</Link>
        </motion.p>
      </motion.div>
    </motion.div>
    </>
  );
}

export default Register;