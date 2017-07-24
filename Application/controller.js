function controller(req) {

    const db = req.app.get('db');
    const model = require('./model')(db);
    const nodemailer = require('nodemailer');
    const config = require('../config/config');
    const events = require('events');
    let eventEmitter = new events.EventEmitter();
    const facebookStatergy = require('passport-facebook');
    const passport = require('passport');
    const jwt = require('jsonwebtoken');


    eventEmitter.on('event', () => {
        let transporter = nodemailer.createTransport(config.SMTP);

        // setup email data with unicode symbols
        let mailOptions = {
            from: 'NVOLV', // sender address
            to: req.body.email, // list of receivers
            subject: 'welcome', // Subject line
            text: 'Hello world ?', // plain text body
            html: '<div style="background-color: #4F8A10; font-size: 25px; padding: 30px; width: 500px;border-radius: 10px">' +
            'Welcome to friend App please click the link below <br/>' +
            '<a href="' + config.PATH() + '/jwt/verification?token=' + jwt.sign({email: req.body.email}, config.SECRET) +
            '">verify your email</a></div>' // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
        console.log('an event occurred!');
    });

    return ({
        login: (res) => {

            let requestBody = req.body;
            let email = requestBody.email;
            let password = requestBody.password;
            req.checkBody('email', 'Please provide valid Email').isEmail();

            var errors = req.validationErrors();

            if (errors) {
                res.json({httpCode: 400, message: errors[0].msg});
                return;
            }
            let query = {
                email: email,
                password: password
            }

            model.login(query)
                .then((value) => {
                req.session.user = value[0];
                    res.json(value[0]);
                })
                .catch((error) => {
                    res.json({httpCode: 400, message: error.message});
                });
        },

        signUp: (res) => {
            req.checkBody('email', 'Please provide valid Email').isEmail();
            req.checkBody('firstName', 'Please provide your FirstName').notEmpty();
            req.checkBody('lastName', 'Please provide your lastName').notEmpty();
            req.checkBody('password', 'Please provide your password').notEmpty();

            var errors = req.validationErrors();

            if (errors) {
                res.json({httpCode: 400, message: errors[0].msg});
                return;
            }

            let requestBody = req.body;
            requestBody.fullName = requestBody.firstName + " " + requestBody.lastName;
            requestBody.date = new Date();
            requestBody.verify = false;
            model.checkEmailExist(requestBody)
                .then(model.signUp)
                .then((value) => {
                    eventEmitter.emit('event');
                    res.json({message: "successfully signed up"});
                })
                .catch((error) => {
                    res.json({httpCode: 400, message: error.message});
                });
        },

        getAllAppUsers: (res) => {
            let pageNumber = parseInt(req.query.pageNumber);
            let responseObject = {
                email: req.query.email,
                pageNumber: pageNumber
            }
            model.getAllUsers(responseObject)
                .then(model.getTotalCount)
                .then((value) => {
                    res.json(value);
                })
                .catch((error) => {
                    res.json({httpCode: 400, message: error.message});
                });
        },

        updateUser: (res) => {
            req.checkBody('userEmail', 'Please provide your email').notEmpty();
            req.checkBody('friendEmail', 'Please provide your friend Email').notEmpty();

            var errors = req.validationErrors();

            if (errors) {
                res.json({httpCode: 400, message: errors[0].msg, });
                return;
            }

            let userEmail = req.body.userEmail;
            let friendEmail = req.body.friendEmail;
            let pageNumber = req.body.pageNumber;
            let friendName = req.body.friendName;
            let userName = req.body.userName;
            let query = {
                email: {$in: [userEmail]}
            }
            let update = {
                $push: {friends: {email: friendEmail, name: friendName}}
            }
            let option = {
                new: true
            }
            let bulkQuery = {
                email: friendEmail
            }
            let bulkUpdate = {
                $push: {friends: {email: userEmail, name: userName}}
            }
            model.updateUser(query, update, option, bulkQuery, bulkUpdate, pageNumber, userEmail)
                .then(model.getAllUsers)
                .then((value) => {

                    res.json(value);
                })
                .catch((error) => {
                    res.json({httpCode: 400, message: error.message});

                })

        },

        getSingleFriendList: (res) => {
            let email = req.query.email;

            let query = {
                email: email
            }
            let option = {
                friends: true
            }
            model.getSingleFriendList(query, option)
                .then((value) => {
                    res.json(value);
                })
                .catch((error) => {
                    res.json({httpCode: 400, message: error.message});

                })
        },
        facebookLogin: (res) => {
            let name = req.query.name;
            let id = req.query.id;

            model.facebookLogin(name, id)
                .then(model.afterFacebookLogin)
                .then(model.getTotalCount)
                .then((value) => {
                res.json(value);
                })
                .catch((error) => {
                    res.json({httpCode: 400, message: error.message});
                })
        },

        facebookVerification: (res) => {
            req.checkQuery('token', "please provide token").notEmpty();

            var errors = req.validationErrors();

            if (errors) {
                res.json({httpCode: 400, message: errors[0].msg });
                return;
            }
            let token = req.query.token;
                let object = jwt.verify(token, config.SECRET);
            let email = "";
            if(object != null && object.email != null){
                email = object.email
            }else{
                res.json({message: "you have written wrong token"});
                return;
            }
            let query = {
                email : email
            }
            console.log(email);
            model.varifyLogin(query,{})
                .then((value) => {
                if(value != null){
                    res.redirect(config.PATH());
                }else{
                    res.json({message:'invalid token'});
                }
                })
                .catch((error) => {
                res.json({httpCode: 400, message: error.message});
                })


        },

        checkIfSessionExist: (res) => {
            if(req.session && req.session.user){
                let email = req.session.user.email;
                let password = req.session.user.password;
                let query = {
                    email: email,
                    password: password
                }
                model.varifyLogin(query, {})
                    .then((value) => {
                    res.json({httpCode: 200, value: value});
                    })
                    .catch((error) => {
                        res.json({httpCode: 400, message: error.message});
                    })

            }
        },

        logout: (res) => {
            req.session.reset();
            res.redirect('/');
        }

    });
}

module.exports = controller;