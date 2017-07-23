var development =  {
    PORT: 3000,
    HOST: 'localhost',
    PATH: function () {
        return 'http://' + this.HOST + ':' + this.PORT;
    },
    DB: {
        PORT: 27017,
        HOST: 'localhost',
        PATH: function () {
            return 'mongodb://' + this.HOST + ':' + this.PORT + '/friendApp'
        }

    },
    SMTP:{
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // secure:true for port 465, secure:false for port 587
        auth: {
            user: 'info@getnvolv.com',
            pass: 'getNVOLV#409'
        }
    },
    PASSPORT:{
        clientID: "1972910886313573",
        clientSecret: "92cc472c8e8bc5c8d591eb58a06bcb88",
        callbackURL: "http://localhost:3000/auth/facebook/callback",
        profileFields:['email']
    },
    SECRET: 'ranawaqar'
}

var production = {
    PORT: 8888,
    HOST: 'localhost',
    PATH: function () {
        return 'http://' + this.HOST + ':' + this.PORT;
    },
    DB: {
        PORT: 6379,
        HOST: 'localhost',
        PATH: function () {
            return 'mongodb://' + this.HOST + ':' + this.PORT
        }

    }
}


function getEnviroment() {
    switch (process.env.NODE_ENV) {
        case 'development':
            return development;
            break;
        case  'production':
            return production;
            break;
        default:
            return development;
    }
}


module.exports = getEnviroment();