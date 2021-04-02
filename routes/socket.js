var express = require('express');
var router = express.Router();
const Chat = require('../models/Chat');

module.exports = (io) => {
    //tao ket noi giua client va server
    io.on('connection', socket => {
        //server lang nghe du lieu tu client
        socket.on('chat', data => {
            //create csdl cua du lieu tu client ve
            Chat.create({ name: data.handle, message: data.message }).then(() => {
                //sau khi lang nghe d lieu, server phat lai du lieu nay den cac client khac
                io.sockets.emit('chat', data); // return data
            }).catch(err => console.error(err));
        });
        socket.on('typing', data => {
            socket.broadcast.emit('typing', data); // return data
        });
    });
    return router;
}