function model(db) {
    const userCollection = "users";
    const uuid = require('uuid');
    let uuid_email = uuid() + '@facebook.com';
    return ({
        login: (query) => {
            return new Promise((resolve, reject) => {
                db.collection(userCollection).find(query).toArray((err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (response.length > 0) {
                            if(response[0].verify == true)
                            resolve(response);
                            else{
                                reject({message: "please verify your email"});
                            }
                        } else {
                            reject({message: "user not found"});
                        }
                    }
                });
            });
        },

        signUp: (query) => {
            return new Promise((resolve, reject) => {
                db.collection(userCollection).insert(query, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response);
                    }
                })
            });
        },

        checkEmailExist: (body) => {
            return new Promise((resolve, reject) => {
                let query = {email: body.email}
                db.collection(userCollection).find(query).toArray((err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (response.length > 0) {
                            reject({message: "email already exist"});
                        } else {
                            resolve(body);
                        }
                    }
                });
            });
        },

        getAllUsers: (responseObject) => {
            return new Promise((resolve, reject) => {
                let query = {
                    "friends.email": {$ne: responseObject.email},
                    email:{$ne: responseObject.email},
                    socialMediaConnect: ""
                }
                let pageNumber = responseObject.pageNumber;
                db.collection(userCollection).find(query).sort({date: -1}).skip((pageNumber - 1) * 10).limit(10).toArray((err, response) => {
                    if(err){
                        reject(err);
                    }else {
                        resolve(response)
                    }
                })
            })
        },

        getTotalCount: (members) => {
            return new Promise((resolve, reject) => {
                db.collection(userCollection).find({}).count((err, response) => {
                    if(err){
                        reject(err);
                    }else {
                        resolve({totalElements: response, members: members});
                    }
                })
            })
        },

        updateUser: (query, update, option,bulkQuery, bulkUpdate, pageNumber, userEmail) => {
            return new Promise((resolve, reject) => {
                var bulkUpdateProfile = db.collection(userCollection).initializeUnorderedBulkOp();
                bulkUpdateProfile.find(query).update(update);
                bulkUpdateProfile.find(bulkQuery).update(bulkUpdate);
                bulkUpdateProfile.execute((err, response)=> {
                  if(err){
                      reject(err);
                  }else {
                      resolve({pageNumber: pageNumber, email: userEmail});
                  }

                })
            })
        },

        getSingleFriendList: (query, option) => {
            return new Promise((resolve, reject) => {
                db.collection(userCollection).findOne(query, option, (err, response) => {
                    if(err){
                        reject(err);
                    }else {
                        if(response == null){
                            response = {};
                            response.friends = [];
                        }
                        let friendsArray = new Array();
                        for(let friendName of response.friends){
                            friendsArray.push(friendName.name + "(" + friendName.email + ")");
                        }
                        response.friends = friendsArray;
                        resolve(response);
                    }
                })
            })
        },

        facebookLogin: (name, id, email) => {
            return new Promise((resolve, reject) => {
                db.collection(userCollection).findOne({socialMediaConnect: id}, (err, response) => {
                    if(err) {
                        reject(err);
                    }else {
                        var email = response != null ? response.email : uuid_email;
                        if(response == null) {
                            db.collection(userCollection).insert({
                                email: email,
                                firstName: "",
                                lastName: "",
                                password: "",
                                fullName: name,
                                socialMediaConnect: id,
                                friends: [],
                                date: new Date(),
                                verify: true
                            });

                        }
                                resolve({id: id,  email: email});
                    }
                });
            });
        },

        afterFacebookLogin: (object) => {
            return new Promise((resolve, reject) => {

                let query = {
                    socialMediaConnect:  {$ne: object.id},
                    "friends.email":{$ne : object.email}
                }

                let pageNumber = 1;
                db.collection(userCollection).find(query).sort({date: -1}).skip((pageNumber - 1) * 10).limit(10).toArray((err, response) => {
                    if(err){
                        reject(err);
                    }else {

                        resolve({members: response, email: object.email});
                    }
                })
            })
        },

        varifyLogin: (query , option) => {
            return new Promise((resolve, reject) => {
                db.collection(userCollection).findOne(query, option, (err, response) => {
                    if(err){
                        reject(err);
                    }else{
                        if(response != null){
                            db.collection(userCollection).update({email: response.email},{$set:{verify: true}});
                        }
                        resolve(response);
                    }
                })
            })
        }
    });
}
module.exports = model;