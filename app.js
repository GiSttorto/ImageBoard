const express = require("express");
const app = express();
const db = require("./db");
var multer = require('multer');
var uidSafe = require('uid-safe');
var path = require('path');
const s3 = require("./s3")
const bodyParser = require('body-parser')
// console.log("db: ", db);
// console.log("s3: ", s3);

//____________________________________________________________________________

app.use(bodyParser.json());

app.use(express.static('./public'));

var diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
      uidSafe(24).then(function(uid) {
          callback(null, uid + path.extname(file.originalname));
      });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});
//____________________________________________________________________________




app.get("/images", function(req, res){
    db.createImage()
        .then(results => {
            // console.log("results: ", results);
            res.json(results.rows);
        })
        .catch(err => {
            // console.log("error", err);
        });
});


app.post('/upload', uploader.single('file'), s3.upload, function(req, res) {
    // If nothing went wrong the file is already in the uploads directory
    // console.log('req.file: ', req.file);
    // console.log('req.body: ', req.body);

    if (req.file) {
        let title = req.body.title;
        let description = req.body.description;
        let username = req.body.username;
        let url = 'https://s3.amazonaws.com/01imageboard/' + req.file.filename;
        db.uploadImage(title, description, username, url)
            .then (results => {
                res.json(results.rows)
                })
                .catch(err => {
                    console.log("error: ", err);
                })
    } else {
        res.json({
            success: false
        });
    }
});


app.get("/get-image/:id", function(req, res){
    let id = req.params.id
    // console.log("req.params.id: ", req.params.id);
    db.getImage(id)
        .then(results => {
            // console.log("results: ", results);
            // console.log("results.rows", results.rows[0]);
            res.json(results.rows[0]);
        })
        .catch(err => {
            console.log("error:", err);
        });
});


app.post("/create-comment/:id", (req, res) => {
    let username = req.body.otherUser;
    let comment = req.body.comment;
    let id = req.params.id;
    // console.log("id:", id);
    // console.log("req.params.comment: ", req.body.comment);
    // console.log("req.params.otherUser: ", req.body.otherUser);

    db.createComment(username, comment, id)
        .then(results => {
            // console.log("results createComment: ", results);
            res.json(results);
        })
        .catch((err) => {
            console.log("error createComment:", err);
        });
});

app.get("/get-comment/:id", (req, res) => {
    let id = req.params.id;

    db.getComment(id)
        .then(results => {
            // console.log("results getComment: ", results.rows);
            res.json(results.rows);
    }).catch(err => {
        console.log("error: ", err);
    })
});


app.get("/more-img/:id", (req, res) => {
    var lastId = req.params.id;
    // console.log("lastId server: ", lastId);
    db.moreImg(lastId)
        .then(results => {
            console.log("results: ", results);
            res.json(results);
        });
});



app.listen(8080, () => console.log("I am here!!"))
