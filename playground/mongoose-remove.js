const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove

// Todo.remove({}).then((results)=>{
//     console.log(results);
// });
Todo.findByIdAndRemove('5a9bd3230a36495c064fee03').then((todo)=>{
    console.log(todo);
})
Todo.findOneAndRemove({_id:'5a9bd3230a36495c064fee03'}).then(() =>{

});
// Todo.remove
