/**
 * Local Authentication Protocol
 *
 * The most widely used way for websites to authenticate users is via a username
 * and/or email as well as a password. This module provides functions both for
 * registering entirely new users, assigning passwords to already registered
 * users and validating login requesting.
 */

/**
 * Register a new user
 *
 * This method creates a new user from a specified email, username and password
 * and assign the newly created user a local Passport.
 */

 var validator = require('validator');

exports.register = function (req, res, next) {

    console.log('LOCAL REGISTER');

    var newMember = {
        email:req.param('email'),
        username:req.param('username'),
    };

    if (req.param('firstName')){newMember.firstName = req.param('firstName');}
    if (req.param('lastName')){newMember.lastName = req.param('lastName');}
    if (req.param('dateOfBirth')){newMember.dateOfBirth  = req.param('dateOfBirth');}

    //HAK
    newMember.balance = {cre8:8, UNIVERSALTOKEN:1};
    newMember.reputation = {cre8:8, UNIVERSALTOKEN:1};

    if (!newMember.email) {
        req.flash('error', 'Error.Passport.Email.Missing');
        return next(new Error('No email was entered.'));
    }
    if (!newMember.username) {
        req.flash('error', 'Error.Passport.Username.Missing');
        return next(new Error('No username was entered.'));
    }
    if (!req.param('password')) {
        req.flash('error', 'Error.Passport.Password.Missing');
        return next(new Error('No password was entered.'));
    }

    User.create(newMember, function (err, user) {
        if (err) {
            if (err.code === 'E_VALIDATION') {
                if (err.invalidAttributes.email) {req.flash('error', 'Error.Passport.Email.Exists');} 
                else {req.flash('error', 'Error.Passport.User.Exists');}
            }
            return next(err);
        }

        console.log('CREATE USER LOCAL');

        Passport.create({protocol : 'local', password : req.param('password'), user: user.id}, function (err, passport) {
            if (err) {
                if (err.code === 'E_VALIDATION') {
                    console.log('PASSWORD')
                    req.flash('error', 'Error.Passport.Password.Invalid');
                }
                return user.destroy(function (destroyErr) {
                    next(destroyErr || err);
                });
            }

            console.log('CREATE PASSPORT LOCAL');


            //TODO: DEPRECIATE?
            //TODO: ORDER CREATE HERE!!!!
            //WOK ON FLOW :)
            if (req.body.order && req.body.order.length > 0){
                console.log('THERE IS AN ORDER!', req.body.order);
                
                //var order = req.body.order;
                //PROTECT FROM MALFORMED REQUESTS...

                if (order.length > 0){
                    order.map(function(obj){
                        obj.user = user.id;
                        delete obj.$$hashKey;
                        console.log(obj)
                        obj.setBeta.map(function(obj1){
                        //REPLACE KEYS.. ADDRESS.. ETC
                            obj1.replace('[ADDRESS]', user.id);
                        });
                        return obj;
                    });
                    //UPDATE ORDER.. VALUE MAP SPECIFICATIONS
                    Order.create(order).then(function(){
                        next(null, user);
                    });
                }
            }

            else{next(null, user);}

        });

    });
};

/**
 * Assign local Passport to user
 *
 * This function can be used to assign a local Passport to a user who doens't
 * have one already. This would be the case if the user registered using a
 * third-party service and therefore never set a password.
 *
 */
exports.connect = function (req, res, next) {
    var user = req.user
    var password = req.param('password');
    Passport.findOne({protocol : 'local', user: user.id}, function (err, passport) {
        if (err) {return next(err);}
        console.log('THE TRUE CONNECT')
        if (!passport) {
            Passport.create({protocol : 'local', password : password, user: user.id}, function (err, passport) {
                next(err, user);
            });
        }
        else {next(null, user);}
    });
};

/**
 * Validate a login request
 *
 * Looks up a user using the supplied identifier (email or username) and then
 * attempts to find a local Passport associated with the user. If a Passport is
 * found, its password is checked against the password supplied in the form.
 */
exports.login = function (req, identifier, password, next) {
    var isEmail = validator.isEmail(identifier)
    var query = {};

    if (isEmail) {query.email = identifier;}
    else {query.username = identifier;}

    User.findOne(query, function (err, user) {
        if (err) {return next(err);}

        if (!user) {
            if (isEmail) {req.flash('error', 'Error.Passport.Email.NotFound');} 
            else {req.flash('error', 'Error.Passport.Username.NotFound');}
            return next(null, false);
        }

        Passport.findOne({protocol : 'local', user: user.id}, function (err, passport) {
            if (passport) {
                passport.validatePassword(password, function (err, res) {
                    if (err) {return next(err);}
                    if (!res) {
                        req.flash('error', 'Error.Passport.Password.Wrong');
                        return next(null, false);
                    } 
                    else {
                        return next(null, user);
                    }
                });
            }
            else {
                req.flash('error', 'Error.Passport.Password.NotSet');
                return next(null, false);
            }
        });
    });
};
