import { useCallback, useEffect, useMemo, useState } from "react";
import API from "../services/api";
import DashboardLayout from "../components/DashboardLayout";

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
    setForm((prev) => ({
      ...prev,
      doctorName: prev.doctorName || res.data?.[0]?.name || ""
    }));
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

  return (
    <DashboardLayout
      title="Patient Dashboard"
      subtitle="Create appointment requests and track status updates from your doctor."
      role="patient"
    >
      <div className="dashboard-grid">
        <section className="card glass">
          <h3>Book Appointment</h3>
          <form className="form-grid" onSubmit={handleBook}>
            <label>
              Department
              <select
                value={form.department}
                onChange={(e) => setForm((prev) => ({ ...prev, department: e.target.value }))}
              >
                {DEPARTMENTS.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Doctor
              <select
                value={form.doctorName}
                onChange={(e) => setForm((prev) => ({ ...prev, doctorName: e.target.value }))}
              >
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor.name}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Date
              <input
                type="date"
                min={minBookingDate}
                value={form.date}
                onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
              />
            </label>

            <label>
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
            </label>

            {error && <p className="error-text">{error}</p>}
            {message && <p className="success-text">{message}</p>}

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Please wait..." : "Book Appointment"}
            </button>
          </form>
        </section>

        <section className="card glass">
          <h3>My Appointments</h3>

          {sortedAppointments.length === 0 ? (
            <p className="empty-state">No appointments yet.</p>
          ) : (
            <div className="list-grid">
              {sortedAppointments.map((appointment) => (
                <article className="appointment-item" key={appointment._id}>
                  <div>
                    <h4>{appointment.doctorName}</h4>
                    <p>{appointment.department}</p>
                  </div>
                  <div>
                    <p>{appointment.date}</p>
                    <p>{appointment.timeSlot}</p>
                    {appointment.status === "approved" && appointment.approvedTimeSlot && (
                      <p>Approved Time: {appointment.approvedTimeSlot}</p>
                    )}
                  </div>
                  <span className={`status-badge status-${appointment.status}`}>
                    {appointment.status}
                  </span>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}

export default PatientDashboard;
