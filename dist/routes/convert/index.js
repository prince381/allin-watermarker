"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const addWatermark_1 = __importDefault(require("../../controllers/addWatermark"));
const router = (0, express_1.Router)();
router.post('/add-watermark', addWatermark_1.default.addWatermark);
exports.default = router;
