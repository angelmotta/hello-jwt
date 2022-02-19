"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        min: 4,
        lowercase: true
    },
    email: {
        type: String,
        unique: true,
        requiredPaths: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    }
});
userSchema.methods.encryptPassword = (password) => {
    const salt = bcryptjs_1.default.genSaltSync();
    return bcryptjs_1.default.hashSync(password, salt);
};
userSchema.methods.isValidPassword = function (givenPasswd) {
    return bcryptjs_1.default.compareSync(givenPasswd, this.password);
};
exports.default = (0, mongoose_1.model)('User', userSchema);
//# sourceMappingURL=User.js.map