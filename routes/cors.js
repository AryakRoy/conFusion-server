const express = require("express")
const cors = require("cors")

const whitelist = ["http://localhost:3000", "https://localhost:3443", "https://localhost:3001"]
const corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = {
            origin: true
        }
    }
    else {
        corsOptions = {
            origin: true
        }
    }
    callback(null, corsOptions);
}

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate)