const express = require('express');
const Users = require('../models/Users');
const Relations = require('../models/Relations');
const StatusCodes = require('http-status-codes');
const m = require('./middleware');
const router = express.Router();

/**
 * Follows an existing user.
 * @name POST/api/users/follow
 */
router.post(
  '/follow/', 
  [m.isLoggedOut, m.isUsernameEmpty], // check for self
  async (req, res) => {
  try {

    if (req.body.username === req.session.username) {
      res.status(StatusCodes.BAD_REQUEST).json({ 
        message: `You can't follow yourself!`,
      }).end();
      return;
    }

    let user = await Users.findUser(req.body.username);

    if (!user) { // user does not exist
      res.status(StatusCodes.BAD_REQUEST).json({ 
        message: `User ${req.body.username} does not exist`,
      }).end();
      return;
    };

    // check that you're not following already
    let following = await Relations.following(req.session.username, req.body.username);
    if (following) {
      res.status(StatusCodes.BAD_REQUEST).json({ 
        message: `You're already following ${req.body.username}`,
      }).end();
      return;
    }

    // user does exist, valid follow
    await Relations.followUser(req.session.username, req.body.username);
    res.status(StatusCodes.CREATED).json({ 
      message:`User ${req.body.username} successfuly followed!`}).end();
  } catch (error) { // Usually for SQLite query failures
    res.status(StatusCodes.SERVICE_UNAVAILABLE).json({ error: `Could not follow user: ${error}` }).end();
  }
});

/**
 * Unfollows an existing user.
 * @name DELETE/api/users/follow/:username
 */
router.delete(
  '/follow/', 
  [m.isLoggedOut, m.checkQueryUsernameEmpty], // need to check for emptiness, and check for self
  async (req, res) => {
  try {
    let user = req.query.user;
    if (user.length === 0) {
      res.status(StatusCodes.BAD_REQUEST).json({ 
        message: `Please enter a nonempty username!`,
      }).end();
      return;
    }

  
    if (user === req.session.username) {
      res.status(StatusCodes.BAD_REQUEST).json({ 
        message: `You can't unfollow yourself!`,
      }).end();
      return;
    }


    user = await Users.findUser(req.query.user);
    if (!user) { // user does not exist
      res.status(StatusCodes.BAD_REQUEST).json({ 
        message: `User ${req.query.user} does not exist`,
      }).end();
      return;
    };

    // check that you're not unfollowing already
    let following = await Relations.following(req.session.username, req.query.user);
    if (!following) {
      res.status(StatusCodes.BAD_REQUEST).json({ 
        message: `You're already not following ${req.query.user}`,
      }).end();
      return;
    }

    // user does exist, valid deletion
    await Relations.unfollowUser(req.session.username, req.query.user);
    res.status(StatusCodes.CREATED).json({ 
      message:`User ${req.query.user} successfuly unfollowed!`}).end();
  } catch (error) { // Usually for SQLite query failures
    res.status(StatusCodes.SERVICE_UNAVAILABLE).json({ error: `Could not follow user: ${error}` }).end();
  }
});

/**
 * Gets followers for currently logged in user.
 * @name GET/users/followers
 */
router.get(
  '/followers',
  [m.isLoggedOut],
  async (req, res) => {
  try {
    let followers = await Relations.getFollowers(req.session.username);
    let usernames = new Array();
    followers.forEach( obj => {usernames.push(obj.currentUser)});    
    res.status(StatusCodes.OK).json({usernames}).end();
  } catch (error) {
    res.status(StatusCodes.SERVICE_UNAVAILABLE).json({ error: `Could not get followers: ${error}` }).end();
  }
});

/**
 * Gets following for currently logged in user.
 * @name GET/users/following
 */
router.get(
  '/following',
  [m.isLoggedOut],
  async (req, res) => {
  try {
    let following = await Relations.getFollowing(req.session.username);
    let usernames = new Array();
    following.forEach( obj => {usernames.push(obj.ogUser)});    
    res.status(StatusCodes.OK).json({usernames}).end();
  } catch (error) {
    res.status(StatusCodes.SERVICE_UNAVAILABLE).json({ error: `Could not get following: ${error}` }).end();
  }
});


/**
 * Create a user
 * @name POST/users/new-user/
 */
router.post(
  '/',
  [m.isLoggedIn, m.isUsernameEmpty],
  async (req, res) => {
    try {
      await Users.createUser(req.body.username, req.body.password);
      res.status(201).json({
        message: `User ${req.body.username} successfully created`
      }).end(); 
    } catch (error) {
      res.status(StatusCodes.SERVICE_UNAVAILABLE).json({ error: "Username must be unique and non-empty" }).end();
    }
  });

 /**
  * Delete the currently logged in user.
  * @name DELETE/users/:username
  */
router.delete(
  '/',
  [m.isLoggedOut],
  async (req, res) => {
  try {
    await Users.deleteUser(req.session.username);
    let oldUser = req.session.username;
    req.session.username = undefined; // "logging" the deleted user out
    res.status(StatusCodes.OK).json({message: `Successfully deleted user ${oldUser}`}).end();
  } catch (error) {
    res.status(StatusCodes.SERVICE_UNAVAILABLE)
      .json({ error: `Could not delete the short: ${error}` })
      .end();
  }
});

/**
 * Change an existing user's username
 * @name put/users/username
 */
router.put(
  '/change-username',
  [m.isLoggedOut, m.isUsernameEmpty],
  async (req, res) => {
  try {
    // Don't change your username to your current one
    if (req.session.username === req.body.username) {
      res.status(StatusCodes.FORBIDDEN).json({
        error: "Please enter a new username; that's your current username",
      }).end();
    } else { // a valid change
      await Users.updateUsername(req.session.username, req.body.username);
      let oldUsername = req.session.username
      req.session.username = req.body.username; // keeping current user logged in
      let newUsername = req.body.username;
      res.status(StatusCodes.OK).json(
        {message: `Successfully updated username from ${oldUsername} to ${req.body.username}`,
        newUsername

      }).end();
    }
  } catch(error) {
    res.status(StatusCodes.SERVICE_UNAVAILABLE).json({ error: `Could not update username: ${error}` }).end();
  }
});

/**
* Change an existing user's password.
* @name PATCH/users/password
*/
router.put(
  '/change-password',
  [m.isLoggedOut, m.isPasswordEmpty], 
  async (req, res) => {
  try {
    await Users.updatePassword(req.session.username, req.body.password);
    res.status(StatusCodes.OK).json({
    message:  `Successfully changed password for user ${req.session.username}`
  }).end();
  } catch (error) {
    res.status(StatusCodes.SERVICE_UNAVAILABLE).json({ error: `Could not update the password: ${error}` }).end();
  }  
});

/**
 * Sign in (start a session) for a user
 * @name POST/api/users/sign-in
 */
router.post(
  '/sign-in', 
  [m.isLoggedIn, m.isUsernameEmpty], 
  async (req, res) => {
  try {
    let user = await Users.findUser(req.body.username);

    if (!user) { // user does not exist
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Invalid credentials, user does not exist.'}).end();
      return;
    }

    const authResult = await Users.authenticate(req.body.username, req.body.password);
    if (authResult.success) { // authenticate success, so sign user in
      req.session.username = req.body.username;
      res.status(StatusCodes.OK).json({ message: 'Successfully signed in!', username: req.session.username}).end();
      return;
    }

    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials'}).end();

  
  } catch (error) {
    res.status(StatusCodes.SERVICE_UNAVAILABLE).json({ error: `Could not authenticate right now: ${error}` }).end();
  }
});

 /**
 * Sign out (close a session) for a user
 * @name POST/users/sign-out
 */
router.post(
  '/sign-out', 
  [m.isLoggedOut],
  async (req, res) => {
  try {
    let oldUser = req.session.username;
    req.session.username = undefined;
    console.log("req.session,username shuld be unefined here", req.session.username);
    res.status(StatusCodes.OK).json({ message: 'Successfully signed out!', username: oldUser}).end();
  } catch (error) {
    console.log('error here')
    res.status(StatusCodes.SERVICE_UNAVAILABLE).json({ error: `Could not sign out: ${error}` }).end();
  }
});

module.exports = router;
