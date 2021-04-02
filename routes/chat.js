var express = require('express');
var router = express.Router();
const Chat = require('../models/Chat');
const user = require('../models/user.model')
    /* GET home page. */
router.get('/', async function(req, res, next) {
    /*var _id = req.user._id
    var users = await user.findById(_id);
    await Chat.find({}).then(messages => {
        res.render('chats/chat.ejs', { messages, users });
        console.log(messages);
        console.log(users)
    }).catch(err => console.error(err));*/
    Chat.find({}).then(messages => {
        res.render('chats/chat.ejs', { messages });
    }).catch(err => console.error(err));
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/users/signin');
}
module.exports = router;