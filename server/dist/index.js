"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const demo_1 = require("./controller/demo");
let app = (0, express_1.default)();
app.get("/", (req, res) => {
    console.log("find", req.body);
    res.send({ msg: "hello" });
});
app.get("/:id", demo_1.cont);
app.listen(3000, () => {
    console.log("Server is started.");
});
