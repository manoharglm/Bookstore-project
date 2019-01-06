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
        User.find({
            userName: user
        }).then((err, data) => {
            if(data === undefined){
                User.create({
                    userName: user
                }).then(data =>{
                    callback(data,201)
                }) 
            }else callback('Username already exists', 400)
        })
    }else callback(`Invalid Username ${user}`,400)
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
                let checkIsbn = bookData[section].some(book => book.isbn === bookIsbn)
                if (!checkIsbn) {
                    bookData[section].push({
                        isbn: data.isbn,
                        title: data.title
                    })
                    bookData.save()
                    callback(bookData, 201)
                } else {
                    callback(`Book already exists in ${section} section`, 400)
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
        User.findOneAndUpdate({userName: user}, {$pull: {[section]: {isbn: bookIsbn}}},{multi: true}).then(data =>{
            callback(data,201)
        })
    }else callback('Invalid Request',400)
}