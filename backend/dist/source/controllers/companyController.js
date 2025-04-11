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
exports.checkCompanyExists = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const checkCompanyExists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mapboxId, name, fullAddress } = req.body;
    try {
        const existingCompany = yield prisma.company.findFirst({
            where: {
                mapboxId: mapboxId
            }
        });
        if (existingCompany) {
            res.status(200).json({ exists: true, company: existingCompany });
            return;
        }
        else {
            const newCompany = yield prisma.company.create({
                data: {
                    mapboxId: mapboxId,
                    companyName: name,
                    fullAddress: fullAddress,
                }
            });
            res.status(200).json({ message: "Company created", company: newCompany });
        }
    }
    catch (error) {
        console.error("Error checking company existence:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.checkCompanyExists = checkCompanyExists;
