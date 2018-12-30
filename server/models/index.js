const mongoose = require('mongoose')

const booksSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
})

const books_project = module.exports = mongoose.model('books_project', booksSchema)


module.exports.getBooks = (callback) => {
    books_project.find(callback)
}