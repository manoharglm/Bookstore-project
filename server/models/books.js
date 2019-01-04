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
    subtitle: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    published: {
        type: String,
        required: true
    },
    pages: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    website: {
        type: String,
        required: true
    }

})


const Book = module.exports = mongoose.model('book', booksSchema)


module.exports.getBooks = (callback) => {
    Book.find(callback)
}

module.exports.getBookbyId = (bookId, callback) => {
    Book.findById(bookId, callback)
}


