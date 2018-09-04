
const _ = require('lodash');
/**
 * 
 *  Sample: 
 * 
 *  [{name: "ABC" , room: "Angular"} , {name:"XYZ" , room: "React"}]
 * 
 */

class Users {

    constructor(){

        this.users = [];

        // this.users = [
        //     {id: 1 , name: "Tarun" , room:"Node"},
        //     {id: 2 , name: "Tary" , room: "React"},
        //     {id:3 , name: "Tonu" , room: "Node"}
        // ];

    }


    getUserList(){

        return this.users;

    }


    addUser(id , name , room){

        let user = {
            id , 
            name , 
            room
        }

        this.users.push(user);
        return user;
    }

    removeUser(id) {

        let user = this.getUser(id);

        if(user){
            this.users = this.users.filter((user) => {
                return user.id !== id;
            })
        }

        return user;
    }


    getUser(id) {

        let userInfo = this.users.find((user) => {              // find returns Object
            return user.id === id
        })

        return userInfo;

    }


    getUsersInRoom(room){

        let filteredUsers = this.users.filter((user) => {       // filter returns array

            return user.room === room;

        })
        .map((filteredUser) => {

            return filteredUser.name;

        });

        return filteredUsers;

    }


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