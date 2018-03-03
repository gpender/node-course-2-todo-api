//const MongoClient = require('mongodb').MongoClient;
var {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) =>{
    if(err){
        console.log('Unable to connect to MongoDb server');
    }else{
        console.log('Connected to MongoDb Server');
    }
    // db.collection('Todos').findOneAndUpdate( {_id:123},{$set: {text:'Walk the dogs and go shopping'}},{returnOriginal:false}).then((result) => {
    //     console.log(JSON.stringify(result,undefined,2));
    // });

    db.collection('Users').findOneAndUpdate({_id:new ObjectID('5a99a4885a6a6e29c0d8e67f')},{$set:{name:'Brett Pender'},$inc:{age:-2}},{returnOriginal:false}).then((result)=>{
        console.log(JSON.stringify(result,undefined,2));
    });

    db.close();
});