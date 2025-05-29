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
exports.getCompanyReviews = exports.newCompanyReview = exports.getBossReviews = exports.newBossReview = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const newBossReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewText, rating, term, userId, bossId } = req.body;
    try {
        const review = yield prisma.bossReview.create({
            data: {
                reviewText,
                rating,
                term,
                userId,
                bossId
            }
        });
        if (review) {
            res.status(200).json({ message: "Review created", review });
            const pendingReview = yield prisma.pendingBossReviews.create({
                data: {
                    reviewId: review.reviewId
                }
            });
            if (pendingReview) {
                console.log("Pending review created:", pendingReview);
            }
            else {
                console.error("Failed to create pending review");
            }
        }
    }
    catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.newBossReview = newBossReview;
const getBossReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bossId } = req.params;
    try {
        const reviews = yield prisma.bossReview.findMany({
            where: {
                bossId: bossId
            }
        });
        res.status(200).json(reviews);
    }
    catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getBossReviews = getBossReviews;
const newCompanyReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewText, rating, term, userId, companyId } = req.body;
    try {
        const review = yield prisma.companyReview.create({
            data: {
                reviewText,
                rating,
                term,
                userId,
                companyId
            }
        });
        if (review) {
            res.status(200).json({ message: "Review created", review });
            const pendingReview = yield prisma.pendingCompanyReviews.create({
                data: {
                    reviewId: review.reviewId
                }
            });
            if (pendingReview) {
                console.log("Pending review created:", pendingReview);
            }
            else {
                console.error("Failed to create pending review");
            }
        }
    }
    catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.newCompanyReview = newCompanyReview;
const getCompanyReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mapboxId } = req.params;
    try {
        const company = yield prisma.company.findFirst({
            where: {
                mapboxId: mapboxId
            },
        });
        const reviews = yield prisma.companyReview.findMany({
            where: {
                companyId: company === null || company === void 0 ? void 0 : company.companyId
            }
        });
        res.status(200).json(reviews);
    }
    catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getCompanyReviews = getCompanyReviews;
