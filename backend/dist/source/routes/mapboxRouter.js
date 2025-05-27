"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mapboxController_1 = require("../controllers/mapboxController");
const router = (0, express_1.Router)();
router.get('/fetch-search-component-mapbox-data', mapboxController_1.fetchSearchComponentMapboxData);
router.get('/fetch-custom-search-mapbox-data', mapboxController_1.fetchCustomSearchMapboxData);
router.get('/fetch-mapbox-utils-data', mapboxController_1.fetchMapboxUtilsData);
exports.default = router;
