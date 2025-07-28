const db = require('../db/db_config');
const bcrypt = require('bcrypt');

  class Users {
    /**
     * Creates a new Fritter user.
     * @param {String} username 
     * @param {String} password 
     */

    static async createUser(username, password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return db.run(`
        INSERT INTO users 
        VALUES ('${username}', '${hashedPassword}')`)
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
        WHERE ${db.usersTable.username} = '${username}'`);
    }

    /**
     * Checks password for user username log-in.
     * @param {String} username 
     * @param {String} pw
     * @returns {Boolean}
     */
    static async authenticate(username, pw) {
      const user = await db.get(`
        SELECT ${db.usersTable.pw} 
        FROM users WHERE ${db.usersTable.username} = '${username}'`);
      
      if (!user) {
        return false;
      }
      
      const isValidPassword = await bcrypt.compare(pw, user[db.usersTable.pw]);
      if (isValidPassword) {
        return user; // Return user object on successful authentication
      }
      
      return false; // Return false on failed authentication
    };

    /**
     * Deletes an existing user.
     * @param {String} username 
     */
    static async deleteUser(username) {
      return db.run(`
        DELETE FROM users WHERE ${db.usersTable.username} = '${username}';`)
        .then(() => {
          return db.run(`DELETE FROM freets WHERE ${db.freetsTable.author} = '${username}'`)
        })
        .then(() => {
          return db.run(`DELETE FROM relations WHERE ${db.relationsTable.currUser} = '${username}'`)
        })
        .then(() => {
          return db.run(`DELETE FROM relations WHERE ${db.relationsTable.ogUser} = '${username}'`);
        })
    }


    /**
     * Update an existing user's username.
     * @param {String} username
     * @param {String} newUsername
     */
    static async updateUsername(username, newUsername) {
      return db.run(`UPDATE users
      SET ${db.usersTable.username} = '${newUsername}'
      WHERE ${db.usersTable.username} = '${username}'`)
        .then(() => {
          return db.run(`
          UPDATE relations
          SET ${db.relationsTable.currUser} = '${newUsername}'
          WHERE ${db.relationsTable.currUser} = '${username}'`)
        }).then(() => {
          return db.run(`UPDATE freets
          SET ${db.freetsTable.author} = '${newUsername}'
          WHERE ${db.freetsTable.author} = '${username}'`)
        }).then(() => {
          return db.run(`
          UPDATE relations
            SET ${db.relationsTable.ogUser} = '${newUsername}'
            WHERE ${db.relationsTable.ogUser} = '${username}'`);
        })
        
    }
    /**
     * Update an existing user's password
     * @param {String} username
     * @param {String} newPassword
     */
    static async updatePassword(username, newPassword) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      return db.run(`
        UPDATE users
        SET ${db.usersTable.pw} = '${hashedPassword}'
        WHERE ${db.usersTable.username} = '${username}'`);
    }
  }

module.exports = Users;
