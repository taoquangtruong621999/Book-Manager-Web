var express = require('express');
var router = express.Router();
var Book = require('../models/books.model');
var Chat = require("../models/Chat");
var user = require("../models/user.model");
/* GET home page. */
router.get('/', isLoggedIn, async function(req, res, next) {
    /*let books, messages, users
    var _id = req.user._id
    try {
        books = await Book.find().sort({ createdAt: 'desc' }).limit(10).exec();
        messages = await Chat.find({});
        //console.log(messages);
        users = await user.find({ _id });
        console.log(users);
        //res.locals.users = users;
    } catch {
        books = [];
        messages = [];
        users = [];
    }
    res.render('Home', { books: books, messages: messages, users: users });*/
    var query = Book.find()
    if(req.query.title != null && req.query.title  != ''){
        query = query.regex('title', new RegExp(req.query.title,'i'))
    }
    if(req.query.publishedAfter != null && req.query.publishedAfter  != ''){
        query = query.gte('publishDate',req.query.publishedAfter)
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore  != ''){
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    const booksearch = await query.exec()
    var _id = req.user._id;
    var users = await user.findById(_id);
    var books = await Book.find().sort({ createdAt: 'desc' }).limit(10).exec();
    await Chat.find({}).then(messages => {
        res.render('Home', { messages, users, books,books:booksearch,searchOptions: req.query });
        //console.log(messages);
        console.log(users)
    }).catch(err => console.error(err));


});
router.get('/Home', async function(req, res, next) {
    let books
    try {
        books = await Book.find().sort({ createdAt: 'desc' }).limit(10).exec()
    } catch {
        books = []
    }
    res.render('index', { books: books });

}); 
router.get('/Home/:id', async function(req, res, next) {
    try {
        const book = await Book.findById(req.params.id).populate('author').exec();
        if (req.user.role === true) {
            res.render('books/show', {
                book: book,

            });
        } else {
            res.render('a', {
                book: book
            });
        }
    } catch {
        res.redirect('/')
    }
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/users/signin');
}

module.exports = router;