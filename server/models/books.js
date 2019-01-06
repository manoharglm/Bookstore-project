const mongoose = require('mongoose')
const booksSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    isbn: {
        type: String,
        required: true,
        unique: true
    },
    subtitle:String,
    author: String,
    published: String,
    pages:  Number,
    description:  String,
    website:  String
})
const Book = module.exports = mongoose.model('book', booksSchema)

module.exports.getBooks = (callback) => {
    Book.find(callback)
}

module.exports.getBookbyId = (bookId, callback) => {
    Book.findById(bookId, callback)
}
