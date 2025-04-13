"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bossController_1 = require("../controllers/bossController");
const router = (0, express_1.Router)();
router.post('/add-boss-request', bossController_1.addBossRequest);
router.get('/pending-bosses', bossController_1.getPendingBosses);
exports.default = router;
