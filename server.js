const mysql = require('mysql');
const express = require('express');
const cors = require("cors");
const bodyparser = require('body-parser');
var session = require('express-session');
const multer = require('multer');
//const sharp = require('multer-sharp')
const path = require('path')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySql Connected...');
});

const app = express();


app.use(bodyparser.json());

app.use(express.static('public'))
app.use('/thumbnail', express.static('public/thumbnail'));
app.use('/videofile', express.static('public/videofile'));

const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration

// The server object listens on port 8080.
app.listen(8080, () => {
    console.log('Server started on port 8080');
});

app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE IF NOT EXISTS nodejs';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Database created...');
    });
});

app.get('/createtable', (req, res) => {
    let sql = 'CREATE TABLE IF NOT EXISTS CustomerDetails(id int AUTO_INCREMENT, Name VARCHAR(255), Mobile INT(10), Email VARCHAR(255), Department VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('table created...');
    });
});

/***Create Admin Table*****/
app.get('/createAdminTable', (req, res) => {
    let sql = 'CREATE TABLE IF NOT EXISTS AdminLogin(id int AUTO_INCREMENT, UserName VARCHAR(255), Password VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        else {
            console.log(result);
            res.send('table created...');
            // let sqlinsert = "INSERT INTO `AdminLogin` (`id`, `UserName`, `Password`) VALUES (1, 'test', 'test')";
            // console.log(sqlinsert)
            // db.query(sqlinsert, (err, result) => {
            //     if (err) throw err;

            //     console.log(result);
            //     res.send('Post added...');
            // });
        }
    });
})

app.post('/getLoginAuth', function (request, response) {

    // Capture the input fields
    let username = request.body.Username;
    let password = request.body.Password;
    console.log("un :", username, "pwd : ", password)
    // Ensure the input fields exists and are not empty
    if (username && password) {
        var checksql = 'SELECT * FROM AdminLogin WHERE UserName = ? AND Password = ?'
        db.query(checksql, [username, password], function (error, results) {
            console.log(results)
            if (error) throw error;
            // If the account exists
            if (results.length > 0) {
                // Redirect to home page
                response.send("true")
            } else {
                console.log("Incorrect Username and/or Password!")
                response.send('Incorrect Username and/or Password!');
            }
            response.end();
        });
    } else {
        console.log('Please enter Username and Password!');

        response.send('Please enter Username and Password!');
        response.end();
    }
});

/****Pagination***/
app.get('/', function (req, res) {

    const { page, perPage } = req.query;

    const pageNumber = parseInt(page) || 1;
    const itemsPerPage = parseInt(perPage) || 3;
    const offset = (pageNumber - 1) * itemsPerPage;

    db.query(
        'SELECT * FROM CustomerDetails LIMIT ? OFFSET ?',
        [itemsPerPage, offset],
        (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal server error' });
            }
            else {
                db.query('SELECT COUNT(*) AS totalCount FROM CustomerDetails', (error, countResult) => {

                    if (error) {
                        console.error(error);
                        res.status(500).json({ error: 'Internal server error' });
                    } else {
                        const totalCount = countResult[0].totalCount;
                        const totalPages = Math.ceil(totalCount / itemsPerPage);
                        // console.log("posts: " + results)
                        res.json({ posts: results, totalPages });
                    }
                });
            }
        }
    );
});


/****View Employee Details******/
/* Read whole Data  . */
app.get('/select', (req, res) => {
    let sql = 'SELECT * FROM CustomerDetails ORDER BY id asc';
    db.query(sql, (err, result) => {
        if (err) throw err;
        //console.log("View Customer Details:", result)
        console.log("View Customer Details:", JSON.parse(JSON.stringify(result)));
        res.send(result);
    });
});

/****Insert Details*****/
app.post('/insert', (req, res) => {
    console.log(req.body);
    let form = req.body;
    let sql = `INSERT INTO CustomerDetails(EmpId, Name, Mobile, Email, Department) VALUES ('${form.empid}','${form.name}', '${form.mobile}', '${form.email}', '${form.dropdown}')`;
    console.log(sql)
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Post added...');
    });
});

app.post('/insertReapt', (req, res) => {
    console.log(req.body);
    var form = req.body
    var valuesform = [form]
    var duplicateSql = "SELECT * FROM CustomerDetails WHERE EmpId = ? or Mobile = ? or Email = ?";
    valuesform.forEach((row) => {
        db.query(duplicateSql, [req.body.empid, req.body.mobile, req.body.email], (err, result) => {
            console.log(result, result.length)
            if (err) throw err;
            if (result.length === 0) {
                let sql = `INSERT IGNORE INTO CustomerDetails(EmpId, Name, Mobile, Email, Department) VALUES ('${form.empid}','${form.name}', '${form.mobile}', '${form.email}', '${form.dropdown}')`;
                db.query(sql, (err, result) => {
                    if (err) throw err;
                    console.log('Data inserted:' + result.affectedRows);
                    res.send('true');
                });
            } else {
                console.log('Data already exists: ' + result.length);
                res.send('Data already exists');
            }
        });
    });

});

/****Update View Details****/

/* Read Data  given id. */
app.get('/select/:eid', (req, res) => {
    var getId = req.params.eid
    console.log("ID passing : ", getId)
    let sql = 'SELECT * FROM CustomerDetails WHERE EmpId = ?';
    db.query(sql, getId, (err, result) => {
        if (err) throw err;
        console.log("View Customer Details:", JSON.parse(JSON.stringify(result)));
        res.send(JSON.parse(JSON.stringify(result)));
    });
});


/****Update Employee Details*****/

app.put('/update/:eid', (req, res) => {
    const getId = req.params.eid;
    var uname = req.body.name
    var mail = req.body.email
    var mobile = req.body.mobile
    var dept = req.body.department
    console.log("Update ID passing : ", getId + uname + mail + mobile + dept)
    db.query('UPDATE CustomerDetails SET Name = ?,Email = ?,Mobile = ?, Department = ? WHERE EmpId = ?', [uname, mail, mobile, dept, getId], (err, result) => {
        if (err) throw err;
        console.log("Successfully updated Customer Details. ", (result))
        res.send('ok');
    });

});

/****Delete Employee Details****/
app.delete('/delete/:eid', (req, res) => {
    var getId = req.params.eid
    console.log("ID passing : ", getId)
    let sql = 'DELETE FROM CustomerDetails WHERE EmpId = ?';
    db.query(sql, getId, (err, result) => {
        if (err) throw err;
        console.log("Delete:", JSON.parse(JSON.stringify(result)));
        res.send(JSON.parse(JSON.stringify(result)));
    });
});

/**Upload Image and add file in directory path **/
//! Use of Multer
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        console.log("directory name where save the file")
        callBack(null, './uploads/')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({
    storage: storage
});

/***Upload image //route for post data***/
app.post("/upload", upload.single('file'), (req, res) => {
    console.log("welcome: ")
    if (!req.file) {
        console.log("No file upload");
        res.send('No file upload')
    } else {
        console.log(req.file.filename)
        //var imgsrc = 'http://127.0.0.1:3000/uploads/' + req.file.filename
        var imgsrc = req.file.filename
        var insertData = "INSERT INTO images (path) VALUES (?)"
        db.query(insertData, [imgsrc], (err, result) => {
            if (err) throw err
            console.log("file uploaded")
            res.send('File uploaded successfully!');
        })
    }
});

/**video upload file name in dir path */
// Configure Multer for video file uploads
const videostorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/videofile'); // Folder to store uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    },

});


const videoupload = multer({ storage: videostorage });

// Handle file upload endpoint
app.post('/vupload', videoupload.single('video'), (req, res) => {

    if (!req.file) {
        console.log("No file upload");
        res.send('No file upload')
    }
    else {
        console.log("file name: " + req.file.filename)
        const title = req.body.title
        var fname = req.file.filename
        var imgsrc = req.file.path
       // const thumbnailPath = `${req.file.filename}.png`;
        const thumbnailPath = `${Date.now()}.png`;
        console.log("Thumbnil Path : " + thumbnailPath)
        // Generate a thumbnail using Fluent-FFmpeg
        ffmpeg(imgsrc)
            .screenshots({
                timestamps: ['00:00:05'],
                filename: thumbnailPath,
                folder: 'public/thumbnail',
                size: '320x240',
            })
            .on('end', () => {

                //Insert file details into the database
                var insertData = 'INSERT INTO videos (title, filename, thumbnailpath) VALUES (?, ?, ?)';
                db.query(insertData, [title, imgsrc, thumbnailPath], (err, result) => {
                    if (err) throw err
                    console.log("video uploaded - " + imgsrc)
                    res.json({ fname, thumbnailPath, Status: "Succuss" });// Send the thumbnail path as the response                 
                })
                // res.json({ fname, thumbnailPath, Status: "Succuss" });
            });
    }
});



