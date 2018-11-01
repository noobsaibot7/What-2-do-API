const jwt = require('jsonwebtoken');
const {SHA256} = require('crypto-js');
const message = {hello: 'hello barbie'};
const bcrypt = require('bcryptjs');

const encrypted = SHA256(JSON.stringify(message)).toString();
//console.log(encrypted);

// we hash it then add a secret which can only be known by each individual users

// const user1 = SHA256(JSON.stringify(message) + "my cat is my fav");

// each secrets sets each encryption  this is a method used by the JWT Board (javascript eb token)

// jwt.sign(data, 'secret') ==> this methods takes both data and token and argument

const token = jwt.sign(message, 'i love monkey');
// console.log(token);
// output =eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJoZWxsbyI6ImhlbGxvIGJhcmJpZSIsImlhdCI6MTUzNjgyOTg0Nn0.qAJrjo91pH7gCX6umvnZAxX25hIb57aEMtHe1kr5g-s

// it can be decoded using the following method jwt.verify(token, 'secret) ==> it takes the token and the secret

const decoded = jwt.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJoZWxsbyI6ImhlbGxvIGJhcmJpZSIsImlhdCI6MTUzNjgyOTg0Nn0.qAJrjo91pH7gCX6umvnZAxX25hIb57aEMtHe1kr5g-s', 'i love monkey');
// console.log('decoded', decoded);

// output==>{ hello: 'hello barbie', iat: 1536829846 } where iat = issued at timestamp

// bcrypt enable us to salt and gives us proper comparisin function
const monkey = 'i love banannas';
const hashed ='$2a$12$PKHYfftgrKc.uHsQA0k9ruNPV1SlsMJiCFHyWS7JFtc/HC6jNdtuy'
// const salt = bcrypt.genSalt(10, (err, salt)=>{
//   bcrypt.hash(monkey, salt, (err, hashed)=> console.log(hashed));
// })

bcrypt.compare(monkey, hashed, (err, result)=>console.log(result))


