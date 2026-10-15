const Appointment = require("../models/Appointment");
const User = require("../models/User");

const parseDateOnly = (dateStr) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return null;
  }

  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  date.setHours(0, 0, 0, 0);
  return date;
};

exports.createAppointment = async (req, res) => {
  try {
    const { department, doctorName, date, timeSlot } = req.body;

    if (!department || !doctorName || !date || !timeSlot) {
      return res.status(400).json({
        message: "Department, doctorName, date and timeSlot are required"
      });
    }

    const selectedDate = parseDateOnly(date);
    if (!selectedDate) {
      return res.status(400).json({ message: "Date must be in YYYY-MM-DD format" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return res.status(400).json({ message: "You cannot book appointments for previous dates" });
    }

    const patient = await User.findById(req.user.id);
    if (!patient || patient.role !== "patient") {
      return res.status(403).json({ message: "Only patients can book appointments" });
    }

    const doctor = await User.findOne({
      name: { $regex: new RegExp(`^${doctorName.trim()}$`, "i") },
      role: "doctor"
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const appointment = await Appointment.create({
      department,
      doctorName: doctor.name,
      patientName: patient.name,
      date,
      timeSlot,
      patientId: patient._id,
      doctorId: doctor._id
    });

    return res.status(201).json(appointment);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create appointment" });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "patient") {
      filter = { patientId: req.user.id };
    }

    if (req.user.role === "doctor") {
      filter = { doctorId: req.user.id };
    }

    const appointments = await Appointment.find(filter).sort({ createdAt: -1 });
    return res.json(appointments);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, approvedTimeSlot } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be approved or rejected" });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) { 
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.doctorId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can update only your assigned appointments" });
    }

    appointment.status = status;
    if (status === "approved") {
      appointment.approvedTimeSlot = (approvedTimeSlot || appointment.timeSlot).trim();
    } else if (status === "rejected") {
      appointment.approvedTimeSlot = "";
    }
    await appointment.save();

    return res.json(appointment);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update appointment status" });
  }
};
