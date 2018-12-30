const express = require('express')
const mongoose = require('mongoose')
const app = express()
app.get('/', function (req, res) {
    mongoose.connect('mongodb://localhost/books_project_manohar', {
        useNewUrlParser: true
    }, (err, db) => {
        let promise = new Promise((resolve, reject) => {
            let data = db.collection('books_project').find()
            let arr=[]
            arr.push(data)
            let i=0
            data.forEach(element => {
                arr[i]=element
                i++
            },()=>resolve(arr))
            
        })
        promise.then((data) => {
            res.json(data)
        })
    })
})
app.listen(3000)