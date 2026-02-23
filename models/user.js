const db = require('../config/db');

exports.findByEmail = (email) => {
    return db.query(
        "SELECT * FROM users WHERE email=$1",
        [email]
    );
};

exports.createUser = (email, password) => {
    return db.query(
        "INSERT INTO users(email,password) VALUES($1,$2)",
        [email,password]
    );
};

exports.saveRefreshToken = (token, id) => {
    return db.query(
        "UPDATE users SET refresh_token=$1 WHERE id=$2",
        [token,id]
    );
};

exports.findByRefreshToken = (token) => {
    return db.query(
        "SELECT * FROM users WHERE refresh_token=$1",
        [token]
    );
};