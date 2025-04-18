"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bossController_1 = require("../controllers/bossController");
const router = (0, express_1.Router)();
router.post('/add-boss-request', bossController_1.addBossRequest);
router.get('/:mapboxId', bossController_1.getBosses);
exports.default = router;
