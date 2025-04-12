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
exports.addBossRequest = void 0;
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
