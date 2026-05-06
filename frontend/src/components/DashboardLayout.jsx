import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function DashboardLayout({ title, subtitle, role, children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/");
  };

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  const headerVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <motion.div 
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="page-shell"
    >
      <div className="bg-orb bg-orb-left" />
      <div className="bg-orb bg-orb-right" />

      <div className="container dashboard-wrap">
        <motion.header variants={headerVariants} className="topbar glass">
          <div>
            <p className="eyebrow">Medical Appointment Management</p>
            <h1>{title}</h1>
            <p className="subtitle">{subtitle}</p>
          </div>

          <div className="topbar-actions">
            <span className="role-pill">{role}</span>
            <Link to={role === "doctor" ? "/doctor" : "/patient"} className="ghost-link">
              Dashboard
            </Link>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-danger" 
              onClick={handleLogout}
            >
              Logout
            </motion.button>
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default DashboardLayout;