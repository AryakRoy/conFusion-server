const express = require("express");
const bodyParser = require('body-parser')
const mongoose = require("mongoose")
const authenticate = require("../authenticate")

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());

const Promotions = require("../models/promotions");

promoRouter.route('/')
    .get((req, res, next) => {
        Promotions.find({})
            .then((promotions) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json(promotions)
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotions.create(req.body)
            .then((promotion) => {
                console.log('Leader Created', promotion)
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json(promotion)
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on ' + req.originalUrl);
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotions.deleteMany({})
            .then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json(response)
            }, (err) => next(err))
            .catch((err) => next(err))
    });

promoRouter.route('/:promoId')
    .get((req, res, next) => {
        Promotions.findById(req.params.promoId)
            .then((promotion) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json(promotion)
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported for  : ' + req.originalUrl);
    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotions.findByIdAndUpdate(req.params.promoId, { $set: req.body }, { new: true, })
            .then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json(response)
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotions.findByIdAndRemove(req.params.promoId)
            .then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json(response)
            }, (err) => next(err))
            .catch((err) => next(err))
    });

module.exports = promoRouter;