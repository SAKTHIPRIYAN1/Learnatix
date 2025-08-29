"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
let demoRouter = (0, express_1.Router)();
demoRouter.get('/', (req, res) => {
    res.send({ 'msg': "happy Diwali!!!" });
});
