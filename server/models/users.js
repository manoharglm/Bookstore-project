const mongoose = require('mongoose')
let Book = require('./books.js')

const userSchema = new mongoose.Schema({
    userName: String,
    want_to_read: [],
    read: [],
    reading: []
})
const User = module.exports = mongoose.model('user', userSchema)

module.exports.addUser = (user, callback) => {
    User.create({
        userName: user
    }, callback)
}

module.exports.displayBooks = (user, section, callback) => {
    User.find({
        userName: user
    }, section, callback)
}
module.exports.addBook = (user, bookIsbn, section, callback) => {
    Book.findOne({
        isbn: bookIsbn
    }).then(data => {
        User.findOne({
            userName: user
        }).then(bookData=>{
            let checkIsbn = bookData[section].some(book => book.isbn ===bookIsbn)
            if(!checkIsbn){
                bookData[section].push({
                    isbn:data.isbn,
                    title:data.title
                })
                bookData.save()
            }
            callback(checkIsbn)
        })
    })

}

module.exports.deleteBook = (user, bookIsbn, section, callback) => {
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
