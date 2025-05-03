"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
router.post('/check-user', userController_1.checkUserExists);
router.get('/get-reviews/:userId', userController_1.getReviewsByUserId);
exports.default = router;
