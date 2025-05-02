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
exports.getArchivedBossReviews = exports.declinePendingBossReview = exports.acceptPendingBossReview = exports.getAllPendingBossReviews = exports.getArchivedForms = exports.declineBossRequest = exports.acceptBossRequest = exports.getPendingBosses = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getPendingBosses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pendingBosses = yield prisma.pendingBosses.findMany({
            include: {
                User: true,
                Company: true,
            },
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
    const { bossFirstName, bossLastName, position, companyId, userId, pendingId, status, requestedDate, } = req.body;
    try {
        const newBoss = yield prisma.boss.create({
            data: {
                bossFirstName,
                bossLastName,
                position,
                companyId,
            },
        });
        const newArchivedForm = yield prisma.archivedForms.create({
            data: {
                userId,
                bossFirstName,
                bossLastName,
                position,
                companyId,
                status,
                requestedDate,
            },
        });
        const deleted = yield prisma.pendingBosses.delete({
            where: {
                pendingId,
            },
        });
        res
            .status(200)
            .json({
            message: "Boss request accepted",
            newBoss,
            newArchivedForm,
            deleted,
        });
    }
    catch (error) {
        console.error("Error accepting boss request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.acceptBossRequest = acceptBossRequest;
const declineBossRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bossFirstName, bossLastName, position, companyId, userId, pendingId, status, requestedDate, } = req.body;
    try {
        const newArchivedForm = yield prisma.archivedForms.create({
            data: {
                userId,
                bossFirstName,
                bossLastName,
                position,
                companyId,
                status,
                requestedDate,
            },
        });
        const deleted = yield prisma.pendingBosses.delete({
            where: {
                pendingId,
            }
        });
        res
            .status(200)
            .json({ message: "Boss request declined", newArchivedForm, deleted });
    }
    catch (error) {
        console.error("Error declining boss request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.declineBossRequest = declineBossRequest;
const getArchivedForms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const archivedForms = yield prisma.archivedForms.findMany({
            include: {
                User: true,
                Company: true,
            },
        });
        res.status(200).json(archivedForms);
    }
    catch (error) {
        console.error("Error fetching archived forms:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getArchivedForms = getArchivedForms;
const getAllPendingBossReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviews = yield prisma.pendingBossReviews.findMany({
            include: {
                Review: {
                    include: {
                        User: true,
                        Boss: {
                            include: {
                                Company: true,
                            },
                        }
                    }
                }
            },
        });
        res.status(200).json(reviews);
    }
    catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getAllPendingBossReviews = getAllPendingBossReviews;
const acceptPendingBossReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pendingId, reviewId } = req.body;
    try {
        const review = yield prisma.bossReview.findUnique({
            where: {
                reviewId,
            },
        });
        const deleted = yield prisma.pendingBossReviews.delete({
            where: {
                pendingId,
            },
        });
        const acceptedReview = yield prisma.archivedBossReviews.create({
            data: {
                bossId: (review === null || review === void 0 ? void 0 : review.bossId) || "",
                userId: (review === null || review === void 0 ? void 0 : review.userId) ? review.userId : undefined,
                reviewText: (review === null || review === void 0 ? void 0 : review.reviewText) || "",
                status: "accepted",
                requestedDate: (review === null || review === void 0 ? void 0 : review.timestamp) ? review.timestamp.toISOString() : ""
            }
        });
        res.status(200).json({
            message: "Review accepted",
            review,
            deleted,
            acceptedReview
        });
    }
    catch (error) {
        console.error("Error accepting review:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.acceptPendingBossReview = acceptPendingBossReview;
const declinePendingBossReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pendingId, reviewId } = req.body;
    try {
        const deleted = yield prisma.pendingBossReviews.delete({
            where: {
                pendingId,
            },
        });
        const deletedReview = yield prisma.bossReview.delete({
            where: {
                reviewId,
            },
        });
        const archivedReview = yield prisma.archivedBossReviews.create({
            data: {
                bossId: deletedReview.bossId,
                userId: deletedReview.userId,
                reviewText: deletedReview.reviewText,
                status: "declined",
                requestedDate: deletedReview.timestamp.toISOString()
            }
        });
        res.status(200).json({
            message: "Review declined",
            deleted,
            deletedReview,
            archivedReview
        });
    }
    catch (error) {
        console.error("Error declining review:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.declinePendingBossReview = declinePendingBossReview;
const getArchivedBossReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviews = yield prisma.archivedBossReviews.findMany({
            include: {
                User: true,
                Boss: {
                    include: {
                        Company: true,
                    },
                }
            },
        });
        res.status(200).json(reviews);
    }
    catch (error) {
        console.error("Error fetching archived reviews:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getArchivedBossReviews = getArchivedBossReviews;
