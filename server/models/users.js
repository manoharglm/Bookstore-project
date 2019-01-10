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
    isbn: Joi.number()
})

function joiValidationIsbn(bookIsbn) {
    return (Joi.validate({isbn: bookIsbn}, joiSchema)).error
}
module.exports.joiValidationIsbn = joiValidationIsbn

function validateUser(user) {
    return new Promise((resolve, reject) => {
        User.findOne({userName: user}).then(data => {
            if (data) reject('user already registered')
            else resolve(true)
        })
    })
}

module.exports.validateUser = validateUser

module.exports.addUser = (user) => {
    return User.create({userName: user})
        .then(data => {
            return data
        })
}

module.exports.displayBooks = (user, section) => {
    return new Promise((resolve,reject) => {
        User.find({userName: user}, section).then(data => {
            if (data.length === 0) reject(JSON.stringify(`${user} does not exists`))
            else resolve(JSON.stringify(data))
        })
    })
}

function validatingRequest(user, bookIsbn) {
    return new Promise((resolve, reject) => {
        Book.findOne({isbn: bookIsbn}).then(
            User.findOne({userName: user}).then(bookData => {
                //do the following using MongoDB Queries or promises
                let checkIsbn = null
                let arr = ['want_to_read', 'read', 'reading']
                for (let i = 0; i < arr.length; i++) {
                    for (let j = 0; j < bookData[arr[i]].length; j++) {
                        if (bookData[arr[i]][j].isbn === bookIsbn) {
                            checkIsbn = true
                        }
                    }
                }
                resolve(checkIsbn)
            }).catch(err => reject(err))
        ).catch(err => reject(err))
    })
}
module.exports.validatingRequest = validatingRequest

module.exports.addBook = (user, bookIsbn, section) => {
    return new Promise((resolve,reject)=>{
        User.findOneAndUpdate({userName: user},{$push: {[section]: {isbn: bookIsbn}}}).then(data =>{
            resolve(data)
        }).catch(err => reject(err))
    })
}
module.exports.deleteBook = (user, bookIsbn, section) => {
    return new Promise((resolve,reject) =>{
        User.findOneAndUpdate({userName: user}, {$pull: {[section]: {isbn: bookIsbn}}},{new: true}).then(data => {
            resolve(data)
        }).catch((err) => reject(err))
    })
}