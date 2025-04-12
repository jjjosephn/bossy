"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const companyController_1 = require("../controllers/companyController");
const router = (0, express_1.Router)();
router.post('/check-company', companyController_1.checkCompanyExists);
router.get('/:mapboxId', companyController_1.getCompanyByMapboxId);
exports.default = router;
