"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bossController_1 = require("../controllers/bossController");
const router = (0, express_1.Router)();
router.post('/add-boss-request', bossController_1.addBossRequest);
router.get('/pending-bosses', bossController_1.getPendingBosses);
router.post('/accept-boss-request', bossController_1.acceptBossRequest);
router.post('/decline-boss-request', bossController_1.declineBossRequest);
exports.default = router;
