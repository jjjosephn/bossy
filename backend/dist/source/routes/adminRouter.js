"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const router = (0, express_1.Router)();
router.get('/pending-bosses', adminController_1.getPendingBosses);
router.post('/accept-boss-request', adminController_1.acceptBossRequest);
router.post('/decline-boss-request', adminController_1.declineBossRequest);
router.get('/archived-bosses', adminController_1.getArchivedForms);
exports.default = router;
