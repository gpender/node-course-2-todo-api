const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '5a9aca94c1239b353428ed21';
var userId = '5a9ab19683681f1b31391782';

if(!ObjectID.isValid(userId)){
    return console.log('Invalid User id');
};

User.findById(userId).then((user)=>{
    if(!user){
        return console.log('Could not find user');
    }
    console.log(user);
});


// if(!ObjectID.isValid(id)){
//     console.log('Id is invalid');
// }
// Todo.find({_id:id}).then((todos)=>{
//     console.log('Todos',todos);
// });

// Todo.findOne({_id:id}).then((todo)=>{
//     console.log('Todo',todo);
// });
// Todo.findById(id).then((todo)=>{
//     if(!todo){
//         return console.log('Id not found');
//     }
//     console.log('Todo by Id',todo);
// }).catch((e)=>{
//     console.log('Invalid Id');
// });