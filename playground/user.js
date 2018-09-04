const {Users} = require('../server/utils/users');

let users = new Users();

// console.log(users);

const userList = users.getUserList();

console.log(userList);


const userInfo = users.getUser(1);

console.log(userInfo);


const usersInRoom = users.getUsersInRoom("Node");

console.log(usersInRoom);



const userRemoved = users.removeUser(3);

console.log(userRemoved);



const FilteredUserList = users.getUserList();

console.log(FilteredUserList);