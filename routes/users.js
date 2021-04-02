var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
var passport = require('passport');
var csrf = require("csurf");
var csrfProtection = csrf()
router.use(csrfProtection);



/* GET home page. */


/* GET sign-in page. */
router.get('/signin', function(req, res, next) {
    // Hiển thị trang và truyển lại những tin nhắn từ phía server nếu có
    var messages = req.flash('error');
    dataForm = {

        email: '',
        password: ''
    }
    res.render('users/signin', {
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0,
        dataForm: dataForm
    })
});
//logout
router.get('/logout', isLoggedIn, function(req, res, next) {
    req.logout();
    res.redirect('/');
})
router.use('/', notLoggedIn, function(req, res, next) {
    next();
});
/* Post sign-up page. */
// Xử lý thông tin khi có người đăng nhập
router.post('/signin',

    [

        check('email', 'Your email is not valid').isEmail(),
        check('password', 'Your password must be at least 5 characters').isLength({ min: 5 })
    ],
    (function(req, res, next) {

        var email = req.body.email;
        var password = req.body.password;

        var messages = req.flash('error');
        const result = validationResult(req);
        var errors = result.errors;
        dataForm = {

            email: email,
            password: password
        }
        if (!result.isEmpty()) {
            var messages = [];
            errors.forEach(function(error) {
                messages.push(error.msg);
            });
            res.render('user/signin', {
                csrfToken: req.csrfToken(),
                messages: messages,
                hasErrors: messages.length > 0,
                dataForm: dataForm
            });
            console.log(messages)
        } else {
            next();
        }
    }),
    passport.authenticate('local.signin', {
        failureRedirect: '/signin',
        failureFlash: true
    }),
    function(req, res, next) {
        if (req.session.oldUrl) {
            var oldUrl = req.session.oldUrl;
            req.session.oldUrl = null;
            res.redirect(oldUrl);
        }else {
            res.redirect('/');
        }
        // } else {
        //     if (req.user.role === true) {
        //         res.redirect('/Home');
        //     } else {
        //         if (req.user.role === false) {
        //             res.redirect('/');
        //         }
        //     }
        // }
    }

);

/* GET sign-up page. */
router.get('/signup', function(req, res, next) {
    var messages = req.flash('error')
    dataForm = {

        email: '',
        password: ''
    }
    res.render('users/signup', {
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0,
        dataForm: dataForm
    })
});

/* Post sign-up page. */
// Xử lý thông tin khi có người đăng ký
router.post('/signup', [

    check('email', 'Your email is not valid').isEmail(),
    check('password', 'Your password must be at least 5 characters').isLength({ min: 5 })
],
(function(req, res, next) {

    var email = req.body.email;
    var password = req.body.password;

    var messages = req.flash('error');
    const result = validationResult(req);
    var errors = result.errors;
    dataForm = {
        email: email,
        password: password
    }
    if (!result.isEmpty()) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        res.render('users/signup', {
            csrfToken: req.csrfToken(),
            messages: messages,
            hasErrors: messages.length > 0,
            dataForm: dataForm
        });
        console.log(messages)
    } else {
        next();
    }
}),
    passport.authenticate('local.signup', {
        successRedirect: '/users/signin',
        failureRedirect: '/users/signup',
        failureFlash: true
    })
);
module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
// Chưa login thì yêu cầu login
function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}