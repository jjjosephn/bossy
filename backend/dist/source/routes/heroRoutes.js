"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const heroController_1 = require("../controllers/heroController");
const router = (0, express_1.Router)();
router.post('/check-company', heroController_1.checkCompanyExists);
exports.default = router;
