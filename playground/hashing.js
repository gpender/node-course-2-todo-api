const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!'

bcrypt.genSalt(10,(err,saltValue)=>{
    bcrypt.hash(password,saltValue,(err,hash)=>{
        //console.log(hash);
    })
})

var hashedPassword = '$2a$10$9fFe5Z7FxxJPrEemIRWPiO6HSHWlr/JbLLFPqJAY/jQxMBN52.a9e';
bcrypt.compare(password,hashedPassword,(err,res)=>{
    console.log(res);
})
// var data={
//     id:10,
//     guy:99
// }

// var token = jwt.sign(data,'123abc');
// console.log(token);

// var decoded = jwt.verify(token,'123abc');
// console.log(decoded);


// const {SHA256} = require('crypto-js');

// var message = 'I am user number 3';
// var hash = SHA256(message).toString();

// console.log(message);
// console.log(hash);

// var data={
//     id:4
// }

// var token = {
//     data:data,
//     hash:SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// // token.data.id=5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data)+'somesecret').toString();

// if(resultHash == token.hash){
//     console.log('Data OK');
// }else{
//     console.log('Data has changed, don\'t trust it');
// }