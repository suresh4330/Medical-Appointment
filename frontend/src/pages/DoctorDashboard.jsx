import { useCallback, useEffect, useMemo, useState } from "react";
import API from "../services/api";
import DashboardLayout from "../components/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "../components/LoadingSpinner";

const TIME_SLOTS = [
  "09:00 AM - 09:30 AM",
  "09:30 AM - 10:00 AM",
  "10:00 AM - 10:30 AM",
  "10:30 AM - 11:00 AM",
  "11:00 AM - 11:30 AM",
  "11:30 AM - 12:00 PM",
  "02:00 PM - 02:30 PM",
  "02:30 PM - 03:00 PM",
  "03:00 PM - 03:30 PM",
  "03:30 PM - 04:00 PM"
];

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [approvalTimes, setApprovalTimes] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAppointments = useCallback(async () => {
    const res = await API.get("/appointments");
    setAppointments(res.data);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await fetchAppointments();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchAppointments]);

  const sortedAppointments = useMemo(
    () => [...appointments].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [appointments]
  );

  const updateStatus = async (id, status) => {
    try {
      const approvedTimeSlot = approvalTimes[id];
      await API.put(`/appointments/${id}`, { status, approvedTimeSlot });
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update appointment.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 }
    }
  };

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingSpinner />}
      </AnimatePresence>
      <DashboardLayout
        title="Doctor Dashboard"
        subtitle="Review incoming appointments and approve or reject requests."
        role="doctor"
      >
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="card glass"
      >
        <h3>Assigned Appointments</h3>

        <AnimatePresence mode="wait">
          {error && (
            <motion.p 
              initial={{ opacity: 0, height: 0, x: -10 }}
              animate={{ opacity: 1, height: "auto", x: 0 }}
              exit={{ opacity: 0, height: 0, x: 10 }}
              className="error-text"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {loading && <p className="helper-text">Loading appointments...</p>}

        {!loading && sortedAppointments.length === 0 ? (
          <p className="empty-state">No appointments assigned yet.</p>
        ) : (
          <div className="list-grid">
            <AnimatePresence>
              {sortedAppointments.map((appointment) => (
                <motion.article 
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
                  className="appointment-item doctor-item" 
                  key={appointment._id}
                >
                  <div>
                    <h4>{appointment.patientName}</h4>
                    <p className="muted">{appointment.department}</p>
                    <p style={{ fontSize: "0.9rem", marginTop: "4px" }}>
                      <strong>{appointment.date}</strong> | {appointment.timeSlot}
                    </p>
                  </div>

                  <div className="actions-col">
                    <motion.span 
                      layout
                      className={`status-badge status-${appointment.status}`}
                    >
                      {appointment.status}
                    </motion.span>

                    {appointment.status === "pending" && (
                      <motion.label initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        Approve Time
                        <select
                          value={approvalTimes[appointment._id] || appointment.timeSlot}
                          onChange={(e) =>
                            setApprovalTimes((prev) => ({
                              ...prev,
                              [appointment._id]: e.target.value
                            }))
                          }
                        >
                          {TIME_SLOTS.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                      </motion.label>
                    )}

                    {appointment.status === "approved" && appointment.approvedTimeSlot && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        Approved Time: {appointment.approvedTimeSlot}
                      </motion.p>
                    )}

                    <div className="action-row">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-success"
                        disabled={appointment.status !== "pending"}
                        onClick={() => updateStatus(appointment._id, "approved")}
                      >
                        Approve
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-danger"
                        disabled={appointment.status !== "pending"}
                        onClick={() => updateStatus(appointment._id, "rejected")}
                      >
                        Reject
                      </motion.button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.section>
    </DashboardLayout>
    </>
  );
}

export default DoctorDashboard;
