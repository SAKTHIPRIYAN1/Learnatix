"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cont = void 0;
const cont = (req, res) => {
    console.log(req.params);
    const { id } = req.params;
    console.log(typeof id);
    console.log(req.query);
    res.send({ msg: id });
};
exports.cont = cont;
