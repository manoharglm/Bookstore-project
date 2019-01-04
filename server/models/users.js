const mongoose = require('mongoose')
let Book = require('./books.js')

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    want_to_read: [],
    read: [],
    reading: []

})
const User = module.exports = mongoose.model('user', userSchema)

module.exports.displayBooks = (user,section, callback) => {
    User.find({
        userName: user
    }, section, callback)
}
module.exports.addBook = (user, bookIsbn,section, callback) => {
    Book.find({
        isbn: bookIsbn
    }, (err, data) => {
        if (err) throw err
        User.findOneAndUpdate({
            userName: user
        }, {
            $push: {
                [section]: {
                    title: data[0].title,
                    isbn: data[0].isbn
                }
            }
        }, callback)
    })
}
module.exports.deleteBook = (user, bookIsbn,section, callback) => {
    User.findOneAndUpdate({
        userName: user
    }, {
        $pull: {
            [section]: {
                isbn: bookIsbn
            }
        }
    }, {
        multi: true
    }, callback)
}
