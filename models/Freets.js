const { v4: uuidv4 } = require('uuid');
const db = require('../db/db_config');

class Freets {

    /**
     * Gets all existing Freets.
     * @returns {Array} Copy of all existing Freets.
     */
    static async getAllFreets() {
      return db.all(`SELECT * FROM freets`);
    }

    /**
     * Returns row(s), depending on provided id,
     * of Freets from a particular author 
     * @param {String} username 
     */
    static async getFreetsByUser(username, id) {
      if (id !== undefined) {
        return db.all(`
          SELECT * FROM freets 
          WHERE ${db.freetsTable.author} = ?
          AND ${db.freetsTable.freetID} = ?`, [username, id]);
      } else {
        return db.all(`
          SELECT * FROM freets 
          WHERE ${db.freetsTable.author} = ?`, [username]);
      } 
    };

    /**
     * Find a Freet by id.
     * @param {int} id 
     */
    static async getFreet(id) {
      return db.get(`
        SELECT * FROM freets 
        WHERE ${db.freetsTable.freetID} = ?`, [id]);
    };


    static async getAuthor(freetID) {
      return db.get(`
        SELECT freetAuthor from freets 
        WHERE ${db.freetsTable.freetID} = ?`, [freetID])
    }


    static async getFreetContent(freetID) {
      return db.get(`
        SELECT freetContent from freets 
        WHERE ${db.freetsTable.freetID} = ?`, [freetID])
    }

    /**
     * Create a new Freet for username with content freetContent.
     * @param {String} username 
     * @param {String} freetContent 
     * @returns {Object} freet
     */
    static async createFreet(username, freetContent) {
      console.log("INSIDE FREETS.JS")
      let new_id = uuidv4();
      return db.run(`
        INSERT INTO freets
        VALUES (?, ?, ?, 0)`, [new_id, username, freetContent])
      .then(() => {
        return Freets.getFreet(new_id);
      })
    };

    static async createFreetWithID(id, username, freetContent) {
      return db.run(`
        INSERT INTO freets
        VALUES (?, ?, ?, 0)`, [id, username, freetContent])
      .then(() => {
        return Freets.getFreet(id);
      })
    }

    /**
     * Edits an existing Freet.
     * @param {String} freetID 
     * @param {String} freetContent 
     * @returns {Object} new Freet
     */
    static async editFreet(freetID, freetContent) {
      return db.run(`
        UPDATE freets
        SET ${db.freetsTable.freetContent} = ?
        WHERE ${db.freetsTable.freetID} = ?`, [freetContent, freetID])
      .then(() => {
        return Freets.getFreet(freetID);
      });
    };

    /**
     * Deletes an existing Freet.
     * @param {String} username 
     * @param {String} freetID 
     * @returns {Array} remaining Freets
     */
    static async deleteFreet(freetID) {
      return db.run(`
        DELETE from freets
        WHERE ${db.freetsTable.freetID} = ?`, [freetID]);
    };
}

module.exports = Freets;
