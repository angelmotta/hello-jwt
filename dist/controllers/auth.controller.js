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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profile = exports.signin = exports.signup = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const user = new User_1.default({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });
    // Update password with hashed data in UserModel
    user.password = user.encryptPassword(user.password);
    // Save UserModel in DB
    yield user.save()
        .then(savedUser => {
        console.log("-- Saved New Instance User --");
        console.log(savedUser);
        // Token
        const token = jsonwebtoken_1.default.sign({ _id: savedUser._id }, process.env.SECRET_TOKEN || 'testsecrettoken');
        res.header('token', token).json(savedUser);
    })
        .catch(err => {
        console.log(`Catched error:`);
        console.log(err);
        res.send(`signup failed: try with other email`);
    });
});
exports.signup = signup;
const signin = (req, res) => {
    res.send(`signin`);
};
exports.signin = signin;
const profile = (req, res) => {
    res.send(`profile`);
};
exports.profile = profile;
//# sourceMappingURL=auth.controller.js.map