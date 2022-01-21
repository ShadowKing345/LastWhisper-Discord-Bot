"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    _id: String,
    plots: Array,
    eventPostingChannel: String,
});
exports.default = (0, mongoose_1.model)("GardeningManager", schema);
