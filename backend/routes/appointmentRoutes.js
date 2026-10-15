const express = require("express");

const {
  createAppointment,
  getAppointments,
  updateStatus
} = require("../controllers/appointmentController");
const { verifyToken } = require("../middleware/authMiddleware");
const { authorizeRole } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", verifyToken, authorizeRole("patient"), createAppointment);
router.get("/", verifyToken, authorizeRole("patient", "doctor"), getAppointments);
router.put("/:id", verifyToken, authorizeRole("doctor"), updateStatus);

module.exports = router;