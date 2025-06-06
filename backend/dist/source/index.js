"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
/* Route Imports */
const companyRouter_1 = __importDefault(require("./routes/companyRouter"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const bossRouter_1 = __importDefault(require("./routes/bossRouter"));
const adminRouter_1 = __importDefault(require("./routes/adminRouter"));
const reviewRouter_1 = __importDefault(require("./routes/reviewRouter"));
const mapboxRouter_1 = __importDefault(require("./routes/mapboxRouter"));
/* Configs */
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use((0, morgan_1.default)('common'));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
/* Routes */
app.use("/company", companyRouter_1.default);
app.use("/user", userRouter_1.default);
app.use("/boss", bossRouter_1.default);
app.use("/admin", adminRouter_1.default);
app.use("/review", reviewRouter_1.default);
app.use("/mapbox", mapboxRouter_1.default);
/* Server */
const port = Number(process.env.PORT) || 3001;
app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port ${port}`);
});
