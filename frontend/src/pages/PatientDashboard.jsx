import { useCallback, useEffect, useMemo, useState } from "react";
import API from "../services/api";
import DashboardLayout from "../components/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "../components/LoadingSpinner";

const DEPARTMENTS = [
  "Cardiology",
  "Dermatology",
  "General Medicine",
  "Neurology",
  "Orthopedics",
  "Pediatrics"
];

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

const getTodayLocalDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    department: DEPARTMENTS[0],
    doctorName: "",
    date: "",
    timeSlot: TIME_SLOTS[0]
  });
  const minBookingDate = useMemo(() => getTodayLocalDate(), []);

  const sortedAppointments = useMemo(
    () => [...appointments].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [appointments]
  );

  const fetchAppointments = useCallback(async () => {
    const res = await API.get("/appointments");
    setAppointments(res.data);
  }, []);

  const fetchDoctors = useCallback(async () => {
    const res = await API.get("/auth/doctors");
    setDoctors(res.data);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchAppointments(), fetchDoctors()]);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchAppointments, fetchDoctors]);

  const handleBook = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.department || !form.doctorName || !form.date || !form.timeSlot) {
      setError("Please complete all booking fields.");
      return;
    }

    if (form.date < getTodayLocalDate()) {
      setError("You cannot book an appointment for a previous date.");
      return;
    }

    try {
      await API.post("/appointments", form);
      setMessage("Appointment booked successfully.");
      setForm((prev) => ({ ...prev, date: "", timeSlot: TIME_SLOTS[0] }));
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book appointment.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingSpinner />}
      </AnimatePresence>

      <DashboardLayout
        title="Patient Dashboard"
        subtitle="Create appointment requests and track status updates from your doctor."
        role="patient"
      >
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="dashboard-grid"
      >
        <motion.section variants={itemVariants} className="card glass">
          <h3>Book Appointment</h3>
          <form className="form-grid" onSubmit={handleBook}>
            <motion.label variants={itemVariants}>
              Department
              <select
                value={form.department}
                onChange={(e) => setForm((prev) => ({ ...prev, department: e.target.value, doctorName: "" }))}
              >
                {DEPARTMENTS.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </motion.label>

            <motion.label variants={itemVariants}>
              Doctor
              <select
                value={form.doctorName}
                onChange={(e) => setForm((prev) => ({ ...prev, doctorName: e.target.value }))}
              >
                <option value="">-- Select a Doctor --</option>
                {doctors
                  .filter((d) => d.department === form.department)
                  .map((doctor) => (
                    <option key={doctor._id} value={doctor.name}>
                      {doctor.name}
                    </option>
                  ))}
              </select>
              {doctors.filter((d) => d.department === form.department).length === 0 && (
                <p className="helper-text" style={{ color: "#94a3b8", fontSize: "0.8rem", marginTop: "4px" }}>
                  No doctors registered for this department yet.
                </p>
              )}
            </motion.label>

            <motion.label variants={itemVariants}>
              Date
              <input
                type="date"
                min={minBookingDate}
                value={form.date}
                onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
              />
            </motion.label>

            <motion.label variants={itemVariants}>
              Time Slot
              <select
                value={form.timeSlot}
                onChange={(e) => setForm((prev) => ({ ...prev, timeSlot: e.target.value }))}
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </motion.label>

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
              {message && (
                <motion.p 
                  initial={{ opacity: 0, height: 0, x: 10 }}
                  animate={{ opacity: 1, height: "auto", x: 0 }}
                  exit={{ opacity: 0, height: 0, x: -10 }}
                  className="success-text"
                >
                  {message}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button 
              variants={itemVariants}
              whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(13, 148, 136, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-primary" 
              type="submit" 
              disabled={loading}
            >
              {loading ? "Please wait..." : "Book Appointment"}
            </motion.button>
          </form>
        </motion.section>

        <motion.section variants={itemVariants} className="card glass">
          <h3>My Appointments</h3>

          {sortedAppointments.length === 0 ? (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="empty-state"
            >
              No appointments yet.
            </motion.p>
          ) : (
            <div className="list-grid">
              <AnimatePresence>
                {sortedAppointments.map((appointment) => (
                  <motion.article 
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
                    className="appointment-item" 
                    key={appointment._id}
                  >
                    <div>
                      <h4>{appointment.doctorName}</h4>
                      <p className="muted">{appointment.department}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontWeight: 600 }}>{appointment.date}</p>
                      <p className="muted" style={{ fontSize: "0.85rem" }}>{appointment.timeSlot}</p>
                    </div>
                    <motion.span 
                      layout
                      className={`status-badge status-${appointment.status}`}
                    >
                      {appointment.status}
                    </motion.span>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.section>
      </motion.div>
    </DashboardLayout>
    </>
  );
}

export default PatientDashboard;
