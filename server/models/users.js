const mongoose = require('mongoose')
let Book = require('./books.js')
const Joi = require('joi')

const userSchema = new mongoose.Schema({
    userName: String,
    want_to_read: [],
    read: [],
    reading: []
})
const User = module.exports = mongoose.model('user', userSchema)

const joiSchema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(30).required(),
    isbn: Joi.number()
})

module.exports.addUser = (user, callback) => {
    let validation = Joi.validate({username: user}, joiSchema)
    if(validation.error=== null){
        User.findOne({
            userName: user
        }).then( data => {
            if(data === null){
                User.create({
                    userName: user
                }).then(data =>{
                    callback(data,201)
                }) 
            }else callback('Username already exists', 400)
        })
    }else callback(`Invalid Username`,400)
}

module.exports.displayBooks = (user, section, callback) => {
    let validation = Joi.validate({username: user}, joiSchema)

    if(validation.error=== null){
        User.find({userName: user}, section).then(data =>{
            if(data.length===0) callback(`${user} does not exists`,400)
            else callback(data,200)
        })
    }else callback('Invalid Username',400)
}

module.exports.addBook = (user, bookIsbn, section, callback) => {

    let validation = Joi.validate({
        username: user,
        isbn: bookIsbn
    }, joiSchema)

    if (validation.error === null) {
        Book.findOne({
            isbn: bookIsbn
        }).then(data => {
            User.findOne({
                userName: user
            }).then(bookData => {
                //do the following using MongoDB Queries or promises
                let checkIsbn = null
                let arr = ['want_to_read','read','reading']
                for(let i =0; i<arr.length;i++){
                    for(let j=0;j<bookData[arr[i]].length;j++){
                        if(bookData[arr[i]][j].isbn === bookIsbn){
                            checkIsbn = true
                        }
                    }
                }
  
                if (!checkIsbn) {
                    bookData[section].push({
                        isbn: data.isbn,
                        title: data.title
                    })
                    bookData.save()
                    callback(bookData, 201)
                } else {
                    callback('Book already exists', 400)
                }
            })
        })
    } else {
        callback('Invalid Request',400)
    }
}

module.exports.deleteBook = (user, bookIsbn, section, callback) => {
    let validation = Joi.validate({ 
        username: user,
        isbn: bookIsbn
    }, joiSchema)
    if (validation.error === null) {
        User.findOneAndUpdate({userName: user}, {$pull: {[section]: {isbn: bookIsbn}}},{new:true}).then(data =>{
            callback(data,201)
        })
    }else callback('Invalid Request',400)
}
