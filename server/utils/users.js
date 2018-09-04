
const _ = require('lodash');
/**
 * 
 *  Simple Users Class with add/remove user utility functions
 *  Only pertains to Array (in-memory)
 * 
 *  Sample: 
 * 
 *  [{name: "ABC" , room: "Angular"} , {name:"XYZ" , room: "React"}]
 *
 */

class Users {

    constructor(){

        this.users = [];

    }

/**
 * 
 *  Pulls Only list of users currently logged in
 *  @return Users Array
 * 
 */

    getUserList(){

        return this.users;

    }

/**
 * 
 *  Adding a new user to users array
 *  @param id String (Socket Id) 
 *  @param name String
 *  @param room String
 *  @return user Object
 * 
 */    

    addUser(id , name , room){

        let user = {
            id , 
            name , 
            room
        }

        this.users.push(user);
        return user;
    }

/**
 * 
 *  Removing user from users array i.e. user connection removed
 *  @param id String (Socket ID)
 *  @return users Array
 * 
 */

    removeUser(id) {

        let user = this.getUser(id);

        if(user){
            this.users = this.users.filter((user) => {
                return user.id !== id;
            })
        }

        return user;
    }


/**
 * 
 *  Get User details based on user / socket id
 *  @param id Mixed (can be socket id) 
 *  @return user Object 
 * 
 */

    getUser(id) {

        let userInfo = this.users.find((user) => {              // returns Object
            return user.id === id
        })

        return userInfo;

    }

/**
 * 
 *  Get currently logged in users in a particular room
 *  @param room String 
 *  @return users Array 
 * 
 */

    getUsersInRoom(room){

        let filteredUsers = this.users.filter((user) => {       // returns array

            return user.room === room;

        })
        .map((filteredUser) => {

            return filteredUser.name;

        });

        return filteredUsers;

    }

/**
 * 
 *  Scan if a user with Yak Name already exists in the Chat Room
 *  @param username String 
 *  @param chatroom String
 *  @return true/false Boolean 
 * 
 */

    isUserExists(username , chatroom){

        let isUserExists = this.users.find((user) => {

            let userCheck = false;

            if(_.lowerCase(user.name) === _.lowerCase(username) && _.lowerCase(user.room) === _.lowerCase(chatroom)){
                userCheck = true;
            }

            return userCheck;

        })

        return isUserExists;

    }


}


module.exports = {
    Users
}