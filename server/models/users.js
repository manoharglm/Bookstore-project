const mongoose = require('mongoose')
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
    return (Joi.validate({
        isbn: bookIsbn
    }, joiSchema))
}
module.exports.joiValidationIsbn = joiValidationIsbn

function validateUser(user) {
    return new Promise((resolve, reject) => {
        User.findOne({
            userName: user
        }).then(data => {
            if (data) reject('user already registered')
            else resolve(true)
        })
    })
}

module.exports.validateUser = validateUser

module.exports.addUser = (user) => {
    return User.create({
        userName: user
    }).then(data => {
        return data
    })
}

module.exports.displayBooks = (user, section) => {
    return new Promise((resolve, reject) => {
        User.find({
            userName: user
        }, section).then(data => {
            if (data.length === 0) reject(JSON.stringify(`${user} does not exists`))
            else resolve(JSON.stringify(data))
        })
    })
}

function checkInCurrentSectionToAdd(user, section, bookIsbn) {
    return User.findOne({
        userName: user
    }, section).then(bookData => {
        let result = bookData[section].some(obj => obj.isbn === bookIsbn)
        return result
    })
}

function validatingRequest(user, bookIsbn, section) {
    return new Promise((resolve, reject) => {
        checkInCurrentSectionToAdd(user, section, bookIsbn).then(result => {
            if (!result) {
                resolve(bookIsbn)
            } else {
                reject('Book Already Exists')
            }
        })
    })
}
module.exports.validatingRequest = validatingRequest

module.exports.addBook = (user, bookIsbn, section) => {
    return new Promise((resolve, reject) => {
        User.findOneAndUpdate({
            userName: user
        }, {
            $push: {
                [section]: {
                    isbn: bookIsbn
                }
            }
        }).then(data => {
            resolve(data)
        }).catch(err => {
            reject(err)
        })
    })
}

function deleteBook(user, bookIsbn, section) {
    return new Promise((resolve, reject) => {
        User.findOneAndUpdate({
            userName: user
        }, {
            $pull: {
                [section]: {
                    isbn: bookIsbn
                }
            }
        }, {
            new: true
        }).then(data => {
            resolve(data)
        }).catch((err) => reject(err))
    })
}
module.exports.deleteBook = deleteBook