const { v4: uuidv4 } = require('uuid');
const db = require('../db/db_config');
const Freets = require('./Freets');
const NA_FREET = -1;

const relationType = {
      "follow": 1,
      "upvote": 2,
      "refreet": 3
    };

class Relations {
  static async followUser(currUser, ogUser) {
    return db.runWithParams(`INSERT INTO relations
    VALUES (?, ?, ?, ?, ?)`, [relationType.follow, currUser, NA_FREET, ogUser, NA_FREET])
  };

  static async getFollowers(user) {
    return db.allWithParams(`
      SELECT * FROM relations
      WHERE ${db.relationsTable.relationType} = ?
      AND ${db.relationsTable.ogUser} = ?`, [relationType.follow, user])
  };

  static async getFollowing(user) {
    return db.allWithParams(`
      SELECT * FROM relations
      WHERE ${db.relationsTable.relationType} = ?
      AND ${db.relationsTable.currUser} = ?`, [relationType.follow, user])
  };

  static async unfollowUser(currUser, ogUser) {
    return db.runWithParams(`
      DELETE FROM relations
      WHERE ${db.relationsTable.relationType} = ?
      AND ${db.relationsTable.ogUser} = ?
      AND ${db.relationsTable.currUser} = ?`, [relationType.follow, ogUser, currUser])
  };

  static async following(currUser, ogUser) {
    return db.getWithParams(`
      SELECT * FROM relations
      WHERE ${db.relationsTable.relationType} = ?
      AND ${db.relationsTable.ogUser} = ?
      AND ${db.relationsTable.currUser} = ?`, [relationType.follow, ogUser, currUser]);
  };


  static async upvoteFreet(currUser, ogUser, ogFreetID) {
    return db.runWithParams(`
    INSERT INTO relations
      VALUES (?, ?, ?, ?, ?)`, [relationType.upvote, currUser, NA_FREET, ogUser, ogFreetID])
      .then( () => { return db.runWithParams(`
        UPDATE freets
        SET ${db.freetsTable.upvotes} = ${db.freetsTable.upvotes} + 1
        WHERE ${db.freetsTable.freetID} = ?`, [ogFreetID]);
      })
    };

  static async removeUpvoteFreet(currUser, ogUser, ogFreetID) {
    return db.runWithParams(`
      UPDATE freets
      SET ${db.freetsTable.upvotes} = ${db.freetsTable.upvotes} - 1
      WHERE ${db.freetsTable.freetID} = ?`, [ogFreetID]).then( () => {return db.runWithParams(`
        DELETE FROM relations
        WHERE ${db.relationsTable.relationType} = ?
        AND ${db.relationsTable.ogUser} = ?
        AND ${db.relationsTable.currUser} = ?
        AND ${db.relationsTable.ogFreet} = ?`, [relationType.upvote, ogUser, currUser, ogFreetID])
      }) 
  };

  static async alreadyUpvoted(currUser, ogUser, ogFreetID) {
    return db.getWithParams(`
      SELECT * FROM relations
      WHERE ${db.relationsTable.relationType} = ?
      AND ${db.relationsTable.ogUser} = ?
      AND ${db.relationsTable.currUser} = ?
      AND ${db.relationsTable.ogFreet} = ?`, [relationType.upvote, ogUser, currUser, ogFreetID]);
  };

  static async makeRefreetContent(ogFreetID) {
    let content = await Freets.getFreetContent(ogFreetID);
    let ogAuthor = await Freets.getAuthor(ogFreetID)
    let newFreet = {
      id: ogFreetID,
      originalAuthor: ogAuthor.freetAuthor,
      content: content.freetContent
    };
    return JSON.stringify(newFreet);
  };

  static async refreet(currUser, ogUser, ogFreetID) {
    let newContent = await Relations.makeRefreetContent(ogFreetID);
    let newID = uuidv4();
    return db.runWithParams(
    `INSERT INTO relations
      VALUES (?, ?, ?, ?, ?)`, [relationType.refreet, currUser, newID, ogUser, ogFreetID])
      .then(() => {
        return Freets.createFreetWithID(newID, currUser, newContent);
      });
  };

  static async checkRefreet(id) {
    return db.getWithParams(
      `SELECT * FROM relations
      WHERE ${db.relationsTable.relationType} = ?
      AND ${db.relationsTable.currFreet} = ?`, [relationType.refreet, id])
  };

  static async checkAlreadyRefreeted(user, id) {
    return db.getWithParams(
      `SELECT * FROM relations
      WHERE ${db.relationsTable.relationType} = ?
      AND ${db.relationsTable.ogFreet} = ?
      AND ${db.relationsTable.currUser} = ?`, [relationType.refreet, id, user]
    )
  }
}

module.exports = Relations;
