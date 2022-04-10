const express = require("express");
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const cors = require("./cors")

const Favorites = require("../models/favorite");

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json())

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .populate('user')
            .populate('dishes')
            .then((doc) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(doc);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((doc) => {
                if (doc === null) {
                    var newDoc = new Favorites({ user: req.user._id });
                    req.body.forEach((dish) => {
                        newDoc.dishes.push(dish._id);
                    })
                    newDoc.save((err, doc) => {
                        if (err) {
                            res.statusCode = 500;
                            res.setHeader('Content-Type', 'application/json');
                            res.json({ err: err })
                            return;
                        }
                        else {
                            Favorites.findOne({ user: req.user._id })
                                .populate('user')
                                .populate('dishes').then((doc) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(doc)
                                })
                                .catch((err) => next(err))
                        }
                    })
                }
                else {
                    req.body.forEach((dish) => {
                        if (doc.dishes.indexOf(dish._id) === -1) {
                            doc.dishes = [...doc.dishes, dish._id]
                        }
                    })
                    doc.save((err, doc) => {
                        if (err) {
                            res.statusCode = 500;
                            res.setHeader('Content-Type', 'application/json');
                            res.json({ err: err })
                            return;
                        }
                        else {
                            Favorites.findOne({ user: req.user._id })
                                .populate('user')
                                .populate('dishes').then((doc) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(doc)
                                })
                                .catch((err) => next(err))
                        }
                    })
                }
            })
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.deleteOne({ user: req.user._id })
            .then((doc) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(doc);
            }, (err) => next(err))
            .catch((err) => next(err))
    })

favoriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id }).then((favorites) => {
            if (!favorites) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                return res.json({ "exists": false, "favorites": favorites })
            }
            else {
                if (favorites.dishes.indexOf(req.params.dishId) < 0) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json')
                    return res.json({ "exists": false, "favorites": favorites })
                }
                else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json')
                    return res.json({ "exists": true, "favorites": favorites })
                }
            }
        }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((doc) => {
                if (doc === null) {
                    var err = new Error('Favorites for user does not exist')
                    err.status = 404;
                    next(err);
                }
                else {
                    console.log(doc.dishes.indexOf(req.params.dishId))
                    if (doc.dishes.indexOf(req.params.dishId) === -1) {
                        doc.dishes = [...doc.dishes, req.params.dishId]
                    }
                    doc.save((err, updatedDoc) => {
                        if (err) {
                            res.statusCode = 500;
                            res.setHeader('Content-Type', 'application/json');
                            res.json({ err: err })
                            return;
                        }
                        else {
                            Favorites.findOne({ user: req.user._id })
                                .populate('user')
                                .populate('dishes').then((doc) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(doc)
                                })
                                .catch((err) => next(err))
                        }
                    })
                }
            })
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((doc) => {
                if (doc === null) {
                    var err = new Error('Favorites for user does not exist')
                    err.status = 404;
                    next(err);
                }
                else {
                    if (doc.dishes.indexOf(req.params.dishId) !== -1) {
                        doc.dishes = doc.dishes.filter((dishId) => {
                            if (dishId != req.params.dishId) {
                                return dishId;
                            }
                        })
                    }
                    doc.save((err, doc) => {
                        if (err) {
                            res.statusCode = 500;
                            res.setHeader('Content-Type', 'application/json');
                            res.json({ err: err })
                            return;
                        }
                        else {
                            Favorites.findOne({ user: req.user._id })
                                .populate('user')
                                .populate('dishes').then((doc) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(doc)
                                })
                                .catch((err) => next(err))
                        }
                    })
                }
            })
    })


module.exports = favoriteRouter;