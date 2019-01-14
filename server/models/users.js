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

// function checkInOtherSectionToRemove(user, section, bookIsbn) {
//     let arr = ['want_to_read', 'read', 'reading']
//     for (let i = 0; i < arr.length; i++) {
//         if(arr[i] === section) continue
//         else{
//             console.log(arr[i])

//             return User.findOne({
//                 userName: user
//             }, arr[i]).then(bookData => {
//                 let verResult = bookData[arr[i]].some(obj => obj.isbn === bookIsbn)
//                 if(verResult){
//                     User.findOneAndUpdate({
//                         userName: user
//                     }, {
//                         $pull: {
//                             [section]: {
//                                 isbn: bookIsbn
//                             }
//                         }
//                     }, {
//                         new: true
//                     })
//                 }
//             })
//         }
//     }
// }
// module.exports.checkInOtherSectionToRemove = checkInOtherSectionToRemove

function validatingRequest(user, bookIsbn, section) {
    return new Promise((resolve, reject) => {
        Book.findOne({
            isbn: bookIsbn
        }).then(data => {
            if (data !== null) {
                checkInCurrentSectionToAdd(user, section, bookIsbn).then(result => {
                    if (!result) {
                        resolve(bookIsbn)
                    } else {
                        reject('Book Already Exists')
                    }

                })

            } else {
                reject('Invalid Book')
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
        }).catch(err => reject(err))
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