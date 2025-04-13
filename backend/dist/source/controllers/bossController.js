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
exports.declineBossRequest = exports.acceptBossRequest = exports.getPendingBosses = exports.addBossRequest = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const addBossRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, bossFirstName, bossLastName, position, companyId } = req.body;
    try {
        const bossRequest = yield prisma.pendingBosses.create({
            data: {
                userId,
                bossFirstName,
                bossLastName,
                position,
                companyId
            }
        });
        res.status(200).json({ message: "Boss request added", bossRequest });
    }
    catch (error) {
        console.error("Error adding boss request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.addBossRequest = addBossRequest;
const getPendingBosses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pendingBosses = yield prisma.pendingBosses.findMany({
            include: {
                User: true,
                Company: true,
            }
        });
        res.status(200).json(pendingBosses);
    }
    catch (error) {
        console.error("Error fetching pending bosses:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getPendingBosses = getPendingBosses;
const acceptBossRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bossFirstName, bossLastName, position, companyId, userId, pendingId, status } = req.body;
    try {
        const newBoss = yield prisma.boss.create({
            data: {
                bossFirstName,
                bossLastName,
                position,
                companyId
            }
        });
        const newArchivedForm = yield prisma.archivedForms.create({
            data: {
                userId,
                bossFirstName,
                bossLastName,
                position,
                companyId,
                status
            }
        });
        const deleted = yield prisma.pendingBosses.delete({
            where: {
                pendingId
            }
        });
        res.status(200).json({ message: "Boss request accepted", newBoss, newArchivedForm, deleted });
    }
    catch (error) {
        console.error("Error accepting boss request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.acceptBossRequest = acceptBossRequest;
const declineBossRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bossFirstName, bossLastName, position, companyId, userId, pendingId, status } = req.body;
    try {
        const newArchivedForm = yield prisma.archivedForms.create({
            data: {
                userId,
                bossFirstName,
                bossLastName,
                position,
                companyId,
                status
            }
        });
        const deleted = yield prisma.pendingBosses.delete({
            where: {
                pendingId
            }
        });
        res.status(200).json({ message: "Boss request declined", newArchivedForm, deleted });
    }
    catch (error) {
        console.error("Error declining boss request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.declineBossRequest = declineBossRequest;
