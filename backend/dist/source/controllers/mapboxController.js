"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMapboxUtilsData = exports.fetchCustomSearchMapboxData = exports.fetchSearchComponentMapboxData = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;
const sessionToken = (`${Math.random().toString(36).substring(2)}-${Date.now()}`);
const fetchSearchComponentMapboxData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { encodedSearch, locationString } = req.query;
        if (!encodedSearch || !locationString) {
            res.status(400).json({ error: "Missing required query parameters." });
            return;
        }
        const response = yield fetch(`https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodedSearch}&language=en&types=poi&limit=10&proximity=${locationString}&session_token=${sessionToken}&access_token=${ACCESS_TOKEN}`);
        const mapboxData = yield response.json();
        res.status(200).json(mapboxData);
    }
    catch (error) {
        console.error("Error fetching Mapbox data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.fetchSearchComponentMapboxData = fetchSearchComponentMapboxData;
const fetchCustomSearchMapboxData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { selectedAddressMapboxId } = req.query;
        if (!selectedAddressMapboxId) {
            res.status(400).json({ error: "Missing required query parameters." });
            return;
        }
        const response = yield fetch(`https://api.mapbox.com/search/searchbox/v1/retrieve/${selectedAddressMapboxId}?session_token=${sessionToken}&access_token=${ACCESS_TOKEN}`);
        if (!response.ok) {
            throw new Error("Failed to fetch Mapbox data");
        }
        const mapboxData = yield response.json();
        res.status(200).json(mapboxData);
    }
    catch (error) {
        console.error("Error fetching Mapbox data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.fetchCustomSearchMapboxData = fetchCustomSearchMapboxData;
const fetchMapboxUtilsData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query, proximity, customLocation, searchType = "poi,address", enabled, limit = "10", } = req.query;
        if (!query || !enabled) {
            res.status(400).json({ error: "Missing required query parameters." });
            return;
        }
        const encodedSearch = encodeURIComponent(query);
        const sessionToken = Math.random().toString(36).substring(2);
        const url = `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodedSearch}&language=en&types=${searchType}&limit=${limit}${customLocation || proximity
            ? `&proximity=${customLocation || proximity}`
            : ""}&session_token=${sessionToken}&access_token=${ACCESS_TOKEN}`;
        const response = yield fetch(url);
        if (!response.ok) {
            throw new Error("Mapbox API error");
        }
        const data = yield response.json();
        res.status(200).json(data);
    }
    catch (error) {
        console.error("Error fetching Mapbox data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.fetchMapboxUtilsData = fetchMapboxUtilsData;
