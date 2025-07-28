const db = require('../db/db_config');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

  class Users {
    /**
     * Creates a new Fritter user.
     * @param {String} username 
     * @param {String} password 
     */

    static async createUser(username, password) {
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
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
     * Checks password for user username log-in and migrates plaintext passwords.
     * @param {String} username 
     * @param {String} password
     * @returns {Object} with success boolean and user data
     */
    static async authenticate(username, password) {
      const user = await db.get(`
        SELECT ${db.usersTable.pw} 
        FROM users WHERE ${db.usersTable.username} = '${username}'`);
      
      if (!user) return { success: false };
      
      const storedPassword = user.password;
      
      if (storedPassword.startsWith('$2b$')) {
        const isValid = await bcrypt.compare(password, storedPassword);
        return { success: isValid, user };
      } else {
        if (password === storedPassword) {
          const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
          await db.run(`
            UPDATE users 
            SET ${db.usersTable.pw} = '${hashedPassword}' 
            WHERE ${db.usersTable.username} = '${username}'`);
          return { success: true, user };
        }
        return { success: false };
      }
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
     * Update an existing user's password with hashing
     * @param {String} username
     * @param {String} newPassword
     */
    static async updatePassword(username, newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
      return db.run(`
        UPDATE users
        SET ${db.usersTable.pw} = '${hashedPassword}'
        WHERE ${db.usersTable.username} = '${username}'`);
    }
  }

module.exports = Users;
