
const express = require('express');
const Users = require('../models/Users');
const router = express.Router();
const StatusCodes = require('http-status-codes');

const isUsernameEmpty = function(req, res, next) {
  if (req.body.username.length === 0) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: `You can't have an empty username.`
    }).end(); // successfully created!
    return;
  }
  next();
};

const isPasswordEmpty = function(req, res, next) {
  if (req.body.password.length === 0) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: `You can't have an empty password.`
    }).end(); // successfully created!
    return;
  } next();
};

const isFreetEmpty = function(req, res, next) {
  console.log("is freet empty middleware")
  console.log(req.body)
  if (req.body.content.length === 0) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: `You can't have an empty Freet.`
    }).end(); 
    return;
  } next(); 
}

const areParamsEmpty = function(req, res, next) {
  if (req.params.id.length === 0) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: `Enter a freet ID to delete!`
    }).end(); 
    return;
  } next(); 
}

const checkQueryUsernameEmpty = function(req, res, next) {
  if (req.query.user.length === 0) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: `Enter a freet ID!`
    }).end(); 
    return;
  } next(); 
}


const isFreetIDEmpty = function(req, res, next) {
  if (req.body.id.length === 0) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: `You need to enter a Freet ID.`
    }).end(); 
    return;
  } next(); 
}

const isLoggedIn = function(req, res, next) {
  if (req.session.username !== undefined) { // already logged in
    console.log("IS LOGGED IN MIDDLEWARE")
    console.log(req.session.username);
    res.status(StatusCodes.FORBIDDEN).json({
      error: `You're logged in!`
    }).end();
    return;
  }
  next();
};

const isLoggedOut = function(req, res, next) {
  console.log("is logged out middleware")
  if (req.session.username === undefined) { // already logged in
    console.log("inside isLoggedOut")
    res.status(StatusCodes.FORBIDDEN).json({
      error: `You're logged out!`
    }).end();
    return;
  } next();
};

module.exports = {
  isUsernameEmpty,
  isPasswordEmpty,
  isFreetEmpty,
  isFreetIDEmpty,
  areParamsEmpty,
  checkQueryUsernameEmpty,
  isLoggedIn,
  isLoggedOut
}