import { useCallback, useEffect, useMemo, useState } from "react";
import API from "../services/api";
import DashboardLayout from "../components/DashboardLayout";

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

  return (
    <DashboardLayout
      title="Doctor Dashboard"
      subtitle="Review incoming appointments and approve or reject requests."
      role="doctor"
    >
      <section className="card glass">
        <h3>Assigned Appointments</h3>

        {error && <p className="error-text">{error}</p>}
        {loading && <p className="helper-text">Loading appointments...</p>}

        {!loading && sortedAppointments.length === 0 ? (
          <p className="empty-state">No appointments assigned yet.</p>
        ) : (
          <div className="list-grid">
            {sortedAppointments.map((appointment) => (
              <article className="appointment-item doctor-item" key={appointment._id}>
                <div>
                  <h4>{appointment.patientName}</h4>
                  <p>{appointment.department}</p>
                  <p>
                    {appointment.date} | {appointment.timeSlot}
                  </p>
                </div>

                <div className="actions-col">
                  <span className={`status-badge status-${appointment.status}`}>
                    {appointment.status}
                  </span>

                  {appointment.status === "pending" && (
                    <label>
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
                    </label>
                  )}

                  {appointment.status === "approved" && appointment.approvedTimeSlot && (
                    <p>Approved Time: {appointment.approvedTimeSlot}</p>
                  )}

                  <div className="action-row">
                    <button
                      className="btn btn-success"
                      disabled={appointment.status !== "pending"}
                      onClick={() => updateStatus(appointment._id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger"
                      disabled={appointment.status !== "pending"}
                      onClick={() => updateStatus(appointment._id, "rejected")}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}

export default DoctorDashboard;
