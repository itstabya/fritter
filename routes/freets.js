const express = require('express');
const Users = require('../models/Users');
const Freets = require('../models/Freets');
const Relations = require('../models/Relations');
const StatusCodes = require('http-status-codes');
const m = require('./middleware');
const router = express.Router();

/**
  * Removes an upvote on an existing Freet
  * @name DELETE/freets/upvote/:id
  */
 router.delete(
  '/upvote/:id',
  [m.isLoggedOut],
  async (req, res) => {
  try {
   // check that FreetID is real
   let id = req.params.id;
    if (id === undefined) {
      res.status(StatusCodes.BAD_REQUEST).json( {
        message: `Please enter a nonempty Freet ID.`
      }).end();
      return;
    }
   let user = req.session.username;
   let freetExists = await Freets.getFreet(id);

   if (!freetExists) {
     res.status(StatusCodes.BAD_REQUEST)
        .json( {message: `Freet ${id} does not exist`})
        .end();
     return;
   } 

   let ogUser = await Freets.getAuthor(id);
   ogUser = ogUser.freetAuthor;

   // check that we are not not upvoting this already
   let freetAlreadyUpvoted = await Relations.alreadyUpvoted(user, ogUser, id);
   if (!freetAlreadyUpvoted) {
     res.status(StatusCodes.BAD_REQUEST)
        .json( {message: `You can't remove your upvote from something you never upvoted!`})
        .end();
     return;
   }
   
   // otherwise, time to remove upvote!
   await Relations.removeUpvoteFreet(user, ogUser, id);
   res.status(StatusCodes.OK)
      .json({message: `Successfuly removed upvote for Freet ${id}`})
      .end();
  } catch (error) {
   res.status(StatusCodes.SERVICE_UNAVAILABLE)
      .json({ error: `Can't currently remove upvote Freet: ${error}` })
      .end();
   }
});

/**
 * Delete Freet
 * @name DELETE/freets/:id
 */
router.delete(
  '/:id', 
  [m.isLoggedOut], 
  async (req, res) => {
  try {
    let id = req.params.id;
    if (id === undefined) {
      console.log("unndnefined !!!")
      res.status(StatusCodes.BAD_REQUEST).json( {
        message: `Please enter a nonempty Freet ID.`
      }).end();
      return;
    }
    let currentUser = req.session.username;
    let freetExists = await Freets.getFreet(id);

    // check if Freet even exists
    if (!freetExists) {
      console.log('in delete freet');
      console.log('freet doesnt exist');
      res.status(StatusCodes.BAD_REQUEST).json( {
        message: `Freet ${id} does not exist`
      }).end();
      return;
    }

    let freetBelonging = await Freets.getFreetsByUser(currentUser, id);
    // no Freet of that id by user
    if (freetBelonging.length == 0) {
      console.log("you can't delete bc it aint urs")
      res.status(StatusCodes.FORBIDDEN)
        .json({message: `You are not authorized to delete freet ${id}`})
        .end();
        return;
    }


    // otherwise, we're good to go!
    await Freets.deleteFreet(id);
    res.status(StatusCodes.OK).json( {
      message: `Successfully deleted tweet ${req.query.id}`
    }).end();
  } catch (error) {
    res.status(StatusCodes.SERVICE_UNAVAILABLE).json({ error: `Can't currently delete Freet: ${error}` }).end();
  }});

/**
 * View all freets by author if indicated, all of them otherwise
 * @name GET/api/freets/?author=${author} for get Freets by author
 * @name GET/api/freets/ for getting all tweets
 */
router.get(
  '/', 
  async (req, res) => {
  try {
    let author = req.query.author;
    if (author !== undefined) { // querying for a particular author
      let existingAuthor = await Users.findUser(author);

      // author does not exist
      if (!existingAuthor) { 
        res.status(StatusCodes.BAD_REQUEST).json( {
          message: `User ${author} doesn't exist.`
        }).end();
        return;
      }

      // existing, valid author - time to query! 
      let freetsByUser = await Freets.getFreetsByUser(existingAuthor["username"], undefined);
      res.status(StatusCodes.OK).json(freetsByUser).end();

    } else { // viewing all Freets
      let allFreets = await Freets.getAllFreets();
      res.status(StatusCodes.OK).json(allFreets).end();
      return;
    }
  } catch (error) {
    res.status(StatusCodes.SERVICE_UNAVAILABLE).json({ error: `Could not get freets: ${error}` }).end();
  }
});



/**
 * Refreets an existing Freet
 * @name PUT/freets/refreet
 */
router.post(
  '/refreet',
  [m.isLoggedOut, m.isFreetIDEmpty],
  async (req, res) => {
  try {
   // check that FreetID is real
   let id = req.body.id;
   let user = req.session.username;
   let freetExists = await Freets.getFreet(id);

   if (!freetExists) {
     res.status(StatusCodes.BAD_REQUEST)
        .json( {message: `Freet ${id} does not exist`})
        .end();
     return;
   } 
   // can you refreet a freet multiple times? (no)
   // checkrefreets
   let checkAlreadyRefreeted = await Relations.checkAlreadyRefreeted(user, id);
   if (checkAlreadyRefreeted){
    res.status(StatusCodes.BAD_REQUEST).json( {
      message: `You can't refreet this freet again.`
    }).end();
    return;
    }

   // check that you're not trying to refreet a refrret
   let checkRefreet = await Relations.checkRefreet(id);
   if (checkRefreet){
    res.status(StatusCodes.BAD_REQUEST).json( {
      message: `You can't refreet a refreet.`
    }).end();
    return;
  }
   // otherwise, time to refreet!
   let ogUser = await Freets.getAuthor(id);
   ogUser = ogUser.freetAuthor;

   await Relations.refreet(user, ogUser, id);
   res.status(StatusCodes.CREATED)
      .json({message: `Successfuly refreeted Freet ${id}`})
      .end();
      return;
  } catch (error) {
   res.status(StatusCodes.SERVICE_UNAVAILABLE)
      .json({ error: `Can't currently refreet Freet: ${error}` })
      .end();
      return;
   }
});


 /**
  * Upvotes an existing Freet
  * @name POST/freets/upvote
  */
 router.post(
   '/upvote',
   [m.isLoggedOut, m.isFreetIDEmpty],
   async (req, res) => {
   try {
    // check that FreetID is real
    let id = req.body.id;
    console.log("inside freets.js", req.body)
    let user = req.session.username;
    let freetExists = await Freets.getFreet(id);

    if (!freetExists) {
      res.status(StatusCodes.BAD_REQUEST)
         .json( {message: `Freet ${id} does not exist`})
         .end();
      return;
    } 

    let ogUser = await Freets.getAuthor(id);
    ogUser = ogUser.freetAuthor;

    // check that we haven't upvoted this already
    let freetAlreadyUpvoted = await Relations.alreadyUpvoted(user, ogUser, id);
    if (freetAlreadyUpvoted) {
      res.status(StatusCodes.BAD_REQUEST)
         .json( {message: `You can't upvote more than once!`})
         .end();
      return;
    }
    
    // otherwise, time to upvote!
    
    await Relations.upvoteFreet(user, ogUser, id);
    res.status(StatusCodes.CREATED)
       .json({message: `Successfuly upvoted Freet ${id}`})
       .end();
       return;
   } catch (error) {
    res.status(StatusCodes.SERVICE_UNAVAILABLE)
       .json({ error: `Can't currently upvote Freet: ${error}` })
       .end();
    }
});
 
/**
 * Create Freet through currently logged in user.
 * @name POST/api/freets
 */
router.post(
  '/', 
  [m.isLoggedOut, m.isFreetEmpty],
  async (req, res) => {
  try {
    if (req.body.content.length > 140) {
      res.status(StatusCodes.FORBIDDEN).json( {
        message: `Freets must be 140 characters or less.`
      }).end();
    } else {
      console.log("IN FREETS.JS")
      newFreet = await Freets.createFreet(req.session.username, req.body.content);
      res.status(StatusCodes.OK).json( {
        message: `Successfully Freeted!`,
        newFreet
      }).end();
    }
  } catch (error) {
    res.status(StatusCodes.SERVICE_UNAVAILABLE).json({ error: `Can't currently Freet: ${error}` }).end();
  }
});



/**
* Edit an existing Freet of the currently logged in user.
@name PUT/freets/
*/
router.put(
  '/', 
  [m.isLoggedOut, m.isFreetEmpty, m.isFreetIDEmpty],
  async (req, res) => {
  try {
    let id = req.body.id;
    let currentUser = req.session.username;
    let freetExists = await Freets.getFreet(id);

    // check if Freet even exists
    if (!freetExists) {
      res.status(StatusCodes.BAD_REQUEST).json( {
        message: `Freet ${id} does not exist`
      }).end();
      return;
    }
  
    // check if Freet is a refreet
    let checkRefreet = await Relations.checkRefreet(id);
    if (checkRefreet){
      res.status(StatusCodes.BAD_REQUEST).json( {
        message: `You can't edit a refreet.`
      }).end();
      return;
    }

    let freetBelonging = await Freets.getFreetsByUser(currentUser, id);
    // no Freet of that id by user
  
    if (freetBelonging.length === 0) {
      res.status(StatusCodes.FORBIDDEN).json( {
        message: `You are not authorized to edit freet ${id}`
      }).end();
      return;
    }

    // otherwise, valid edit
    console.log(req.body.content);
    let editedFreet = await Freets.editFreet(id, req.body.content);
    console.log(editedFreet)
    res.status(StatusCodes.OK).json( {
      message: `Successfully edited freet ${id}.`,
      editedFreet
    }).end();
  } catch (error) {
    res.status(StatusCodes.SERVICE_UNAVAILABLE).json({ error: `Can't currently edit Freet: ${error}` }).end();
  }
});

module.exports = router;