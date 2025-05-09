"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviewController_1 = require("../controllers/reviewController");
const router = (0, express_1.Router)();
router.post('/new', reviewController_1.newBossReview);
router.get('/boss/:bossId', reviewController_1.getBossReviews);
exports.default = router;
