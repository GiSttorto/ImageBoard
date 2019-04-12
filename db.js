var spicedPg = require('spiced-pg');


var db = spicedPg('postgres:giovannags:Naosabe1007@localhost:5432/imageboard');


module.exports.createImage = function createImage() {
    let q =  `SELECT * FROM images ORDER BY id DESC LIMIT 6 `;
    return db.query(q);
}


module.exports.uploadImage = function insertNewImages(title, description, username, amazonURL) {
    let q = `INSERT INTO images (title, description, username, url)
        VALUES ($1, $2, $3, $4) RETURNING *`;
    let params =  [title, description, username, amazonURL];
    return db.query(q, params)};


module.exports.getImage = function getImage (id){
    let q = `SELECT * FROM images WHERE id = $1`;
    let params = [id];
        return db.query(q, params);
    };

module.exports.createComment = function createComment(username, comment, image_id) {
    let q = `INSERT INTO comments (username, comment, image_id) VALUES ($1, $2, $3) RETURNING *`;
    let params = [username, comment, image_id];
        return db.query(q, params);
};


module.exports.getComment = function getComment(image_id) {
    let q = `SELECT * FROM comments WHERE image_id = $1`;
    let params = [image_id];
        return db.query(q, params);
};


module.exports.moreImg = function moreImg (lastId){
    let q = `SELECT * FROM images WHERE id < $1 ORDER BY id DESC LIMIT 6`;
    let params = [lastId];
    return db.query(q, params)
        .then(results => {
            return results.rows;
        }).catch (err => {
            console.log("error: ", err);
        })
};
