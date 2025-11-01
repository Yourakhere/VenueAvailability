const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const auth = require("../auth/authMiddleware");

router.get("/", bookingController.getBookings);
router.post("/", auth.protect, bookingController.createBooking);
router.delete("/", auth.protect, bookingController.cancelBooking);

module.exports = router;
