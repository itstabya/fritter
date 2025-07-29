const db = require('../db/db_config');

  class Users {
    /**
     * Creates a new Fritter user.
     * @param {String} username 
     * @param {String} password 
     */

    static async createUser(username, password) {
      return db.run(`
        INSERT INTO users 
        VALUES (?, ?)`, [username, password])
      .then(() => {
        return Users.findUser(username);
      });
    }

    /**
     * Returns an array containing user matching provided username.
     * @param {String} username 
     * @returns {Array} matching user 
     */
    static async findUser(username) {
      return db.get(`
        SELECT ${db.usersTable.username} 
        FROM users 
        WHERE ${db.usersTable.username} = ?`, [username]);
    }

    /**
     * Checks password for user username log-in.
     * @param {String} username 
     * @param {String} pw
     * @returns {Boolean}
     */
    static async authenticate(username, pw) {
      return db.get(`
        SELECT ${db.usersTable.pw} 
        FROM users WHERE ${db.usersTable.username} = ?`, [username]);
    };

    /**
     * Deletes an existing user.
     * @param {String} username 
     */
    static async deleteUser(username) {
      return db.run(`
        DELETE FROM users WHERE ${db.usersTable.username} = ?;`, [username])
        .then(() => {
          return db.run(`DELETE FROM freets WHERE ${db.freetsTable.author} = ?`, [username])
        })
        .then(() => {
          return db.run(`DELETE FROM relations WHERE ${db.relationsTable.currUser} = ?`, [username])
        })
        .then(() => {
          return db.run(`DELETE FROM relations WHERE ${db.relationsTable.ogUser} = ?`, [username]);
        })
    }


    /**
     * Update an existing user's username.
     * @param {String} username
     * @param {String} newUsername
     */
    static async updateUsername(username, newUsername) {
      return db.run(`UPDATE users
      SET ${db.usersTable.username} = ?
      WHERE ${db.usersTable.username} = ?`, [newUsername, username])
        .then(() => {
          return db.run(`
          UPDATE relations
          SET ${db.relationsTable.currUser} = ?
          WHERE ${db.relationsTable.currUser} = ?`, [newUsername, username])
        }).then(() => {
          return db.run(`UPDATE freets
          SET ${db.freetsTable.author} = ?
          WHERE ${db.freetsTable.author} = ?`, [newUsername, username])
        }).then(() => {
          return db.run(`
          UPDATE relations
            SET ${db.relationsTable.ogUser} = ?
            WHERE ${db.relationsTable.ogUser} = ?`, [newUsername, username]);
        })
        
    }
    /**
     * Update an existing user's password
     * @param {String} username
     * @param {String} newPassword
     */
    static async updatePassword(username, newPassword) {
      return db.run(`
        UPDATE users
        SET ${db.usersTable.pw} = ?
        WHERE ${db.usersTable.username} = ?`, [newPassword, username]);
    }
  }

module.exports = Users;
