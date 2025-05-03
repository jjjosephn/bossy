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
exports.getReviewsByUserId = exports.checkUserExists = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const checkUserExists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, firstName, lastName, email } = req.body;
    try {
        const existingUser = yield prisma.user.findUnique({
            where: { userId }
        });
        if (existingUser) {
            res.status(200).json({ exists: true, user: existingUser });
            return;
        }
        const newUser = yield prisma.user.create({
            data: {
                userId,
                firstName,
                lastName,
                email
            }
        });
        res.status(200).json({ exists: false, user: newUser });
    }
    catch (error) {
        console.error("Error checking user existence:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.checkUserExists = checkUserExists;
const getReviewsByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const reviews = yield prisma.bossReview.findMany({
            where: { userId },
            include: {
                Boss: {
                    include: {
                        Company: true,
                    }
                }
            },
        });
        res.status(200).json(reviews);
    }
    catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getReviewsByUserId = getReviewsByUserId;
