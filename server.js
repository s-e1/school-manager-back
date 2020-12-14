const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const multer = require('multer');
if (process.env.JAWSDB_URL) {
    console.log("works:", process.env.JAWSDB_URL);
} else {
    console.log("doesn't work");
}
// var connection = mysql.createConnection('mysql://user:pass@host/db?debug=true&charset=BIG5_CHINESE_CI&timezone=-0700');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'project4'
});
const app = express();
app.use(express.json());
app.use(express.static('uploads'));
app.use(cors());
//connect to db
connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});
//image uploading
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname.replace(/ /g, "_"))
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype.split('/')[0] !== 'image') {
        cb(new Error('Image only'), false);
    } else {
        cb(null, true);
    }
}
var upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: fileFilter
})

/*
functions:
1 school
2 administration
3 course
4 student

endpoints:
1 login
2 get school
3 get administration
4 get course
5 add course
6 edit course
7 delete course
8 get student
9 add student
10 edit student
11 delete student
12 get admin
13 add admin
14 edit admin
15 delete admin
*/

// data needed for school page
const school = (req, res) => {
    //get all courses
    let sql = `SELECT * FROM course`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        else {
            //get all students
            let sql2 = `SELECT * FROM student`;
            connection.query(sql2, (err2, result2) => {
                if (err2) throw err2;
                else {
                    //get total of courses and students
                    let sql3 = `SELECT ( SELECT COUNT(*) FROM course ) AS courses, ( SELECT COUNT(*) FROM student ) AS students`;
                    connection.query(sql3, (err3, result3) => {
                        if (err3) throw err3;
                        else {
                            res.status(200).json([result, result2, result3]);
                        }
                    })
                }
            })
        }
    })
}
// data needed for administration page
const administration = (req, res) => {
    //get all admins
    let sql = `SELECT * FROM admin`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        else {
            //get total of admins
            let sql2 = `SELECT ( SELECT COUNT(*) FROM admin ) AS administraters`;
            connection.query(sql2, (err2, result2) => {
                if (err2) throw err2;
                else {
                    res.status(200).json([result, result2]);
                }
            })
        }
    })
}
//returns details of single course
const course = (req, res) => {
    //gets all details of course
    let sql = `SELECT * FROM course WHERE id = ${req.body.id}`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        else {
            //gets details of students enrolled in course
            let sql2 = `SELECT student.name, student.image FROM student INNER JOIN enrolled ON student.id = enrolled.student_id WHERE enrolled.course_id = ${req.body.id} `;
            connection.query(sql2, (err2, result2) => {
                if (err2) throw err2;
                else {
                    res.status(200).json([result[0], result2, result2.length]);
                }
            })
        }
    })
}
//returns details of single student
const student = (req, res) => {
    let id = req.body.id;
    //get student details
    let sql = `SELECT * FROM student WHERE id = ${id}`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        else {
            //get details of courses student's enrolled to
            let sql2 = `SELECT course.id, course.name, course.image FROM course INNER JOIN enrolled ON course.id = enrolled.course_id WHERE enrolled.student_id = ${id} `;
            connection.query(sql2, (err2, result2) => {
                if (err2) throw err2;
                else {
                    //get all courses
                    let sql3 = 'SELECT id, name FROM course';
                    connection.query(sql3, (err3, result3) => {
                        if (err) throw err3;
                        else {
                            res.status(200).json([result[0], result2, result3]);
                        }
                    })
                }
            })
        }
    })
}

//1 login (name,pw) => check credentials => return role, name, image
app.post('/login', (req, res) => {
    var { email, password } = req.body;
    if (!email || !password) {
        return res.status(404).json('fill all fields')
    }
    //get info about user from db
    let sql = `SELECT * FROM admin WHERE email like '${email}'`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        if (result[0] && password == result[0].password) {
            res.status(200).json([result[0].name, result[0].role, result[0].image, result[0].id]);
        } else {
            res.status(400).json('wrong credentials');
        }
    })
})

//2 get school return list of all courses and students, and total of both
app.get('/school', (req, res) => school(req, res));

//3 get all admin return all admins and their total
app.get('/administration', (req, res) => administration(req, res));

//4 get single course return course details and list of students enrolled and their total
app.get('/course/:id', (req, res) => {
    req.body.id = req.params.id;
    course(req, res);
});

//5 add course, return course data, and list of all courses and students, and total of both
app.post('/course', upload.single('imageFile'), (req, res) => {
    //req.body - name, description, image
    req.body = JSON.parse(req.body.text);
    //checks for image file
    if (req.file) {
        var path = 'http://localhost:3001/' + req.file.filename;
        req.body.image = path;
    }
    //adds data to db
    let sql = 'INSERT INTO course SET ?';
    connection.query(sql, req.body, (err, result) => {
        if (err) throw err;
        else {
            req.body.id = result.insertId;
            //gets course data
            let sql2 = `SELECT * FROM course WHERE id = ${req.body.id}`;
            connection.query(sql2, (err2, result2) => {
                if (err) throw err;
                else {
                    //gets enrolled student's data
                    let sql3 = `SELECT student.name FROM student INNER JOIN enrolled ON student.id = enrolled.student_id WHERE enrolled.course_id = ${req.body.id} `;
                    connection.query(sql3, (err3, result3) => {
                        if (err2) throw err3;
                        else {
                            res.status(200).json([result2[0], result3, result3.length]);
                        }
                    })
                }
            })
        }
    })
})

//6 update course return course data
app.put('/course', upload.single('imageFile'), (req, res) => {
    //req.body - id, name, description, image
    req.body = JSON.parse(req.body.text);
    let { id, name, description, image } = req.body;
    if (req.file) {
        var path = 'http://localhost:3001/' + req.file.filename;
        image = path;
    }

    let sql = `UPDATE course SET ? WHERE id = ${id}`;
    connection.query(sql, { name, description, image }, (err, result) => {
        if (err) throw err;
        else {
            var request = { body: req.body };
            course(request, res);
        }
    })
})

//7 delete course, return updated data
app.delete('/course/:id', (req, res) => {
    let sql = `DELETE FROM course WHERE id = ${req.params.id}`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        school(req, res);
    })
})

//8 get single student, return student data and list of his courses and list of all courses
app.get('/student/:id', (req, res) => {
    req.body.id = req.params.id;
    student(req, res);
});
//9 add student
app.post('/student', upload.single('imageFile'), (req, res) => {
    //req.body - name, phone, email, image, courses
    req.body = JSON.parse(req.body.text);
    let { name, phone, email, image, courses } = req.body;
    if (req.file) {
        var path = 'http://localhost:3001/' + req.file.filename;
        image = path;
    }

    let sql = 'INSERT INTO student SET ?';
    connection.query(sql, { name, phone, email, image }, (err, result) => {
        if (err) throw err;
        else {
            req.body.id = result.insertId;
            if (courses[0]) {
                let str = 'INSERT INTO enrolled (course_id, student_id) VALUES ';
                courses.forEach((e) => {
                    str += `(${e},${req.body.id}),`;
                })
                let sql2 = str.slice(0, -1);
                connection.query(sql2, (err2, result2) => {
                    if (err2) throw err2;
                })
            }
            var request = { body: req.body }
            console.log('request', request);
            student(request, res);
        }
    })
})

//10 update student
app.put('/student', upload.single('imageFile'), (req, res) => {
    //req.body - id, name, phone, email, image, courses
    req.body = JSON.parse(req.body.text);
    let { id, name, phone, email, image, courses } = req.body;
    if (req.file) {
        var path = 'http://localhost:3001/' + req.file.filename;
        image = path;
    }

    let sql = `UPDATE student SET ? WHERE id = ${id}`;
    connection.query(sql, { name, phone, email, image }, (err, result) => {
        if (err) throw err;
        else {
            connection.query(`DELETE FROM enrolled WHERE student_id=${id}`, (err2, result2) => {
                if (err2) throw err2;
                else {
                    if (courses[0]) {
                        let str = 'INSERT INTO enrolled (course_id, student_id) VALUES ';
                        courses.forEach((e) => {
                            str += `(${e},${id}),`;
                        })
                        let sql2 = str.slice(0, -1);
                        connection.query(sql2, (err3, result3) => {
                            if (err3) throw err3;
                        })
                    }
                    var request = { body: req.body };
                    student(request, res);
                }
            })
        }
    })
})

//11 delete student
app.delete('/student/:id', (req, res) => {
    let sql = `DELETE FROM student WHERE id = ${req.params.id}`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        school(req, res);
    })
})

//12 get single admin
app.get('/admin/:id', (req, res) => {
    let sql = `SELECT * FROM admin WHERE id = ${req.params.id}`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})
//13 add admin
app.post('/admin', upload.single('imageFile'), (req, res) => {
    //req.body - name, phone, email, role, password, image
    req.body = JSON.parse(req.body.text);
    if (req.file) {
        var path = 'http://localhost:3001/' + req.file.filename;
        req.body.image = path;
    }

    if (req.body.role !== "Manager" && req.body.role !== "Sales") {
        res.send('invalid data');
    }
    let sql = `SELECT * FROM admin WHERE email like '${req.body.email}'`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        else if (result[0]) {
            res.status(400).send('Username taken');
        } else {
            let sql2 = 'INSERT INTO admin SET ?';
            connection.query(sql2, req.body, (err, result2) => {
                if (err) throw err;
                var request = { body: req.body };
                administration(request, res);
            })
        }
    })
})

//14 update admin
app.put('/admin', upload.single('imageFile'), (req, res) => {
    //req.body - id, name, phone, email, role, password, image
    req.body = JSON.parse(req.body.text);
    let { id, name, phone, email, role, password, image } = req.body;
    if (req.file) {
        var path = 'http://localhost:3001/' + req.file.filename;
        image = path;
    }

    if (role != 'Manager' && role != 'Sales') {
        res.send('invalid data');
    }
    let sql = `UPDATE admin SET ? WHERE id = ${id}`;
    connection.query(sql, { name, phone, email, role, password, image }, (err, result) => {
        if (err) throw err;
        var request = { body: req.body };
        administration(request, res);
    })
})

//15 delete admin
app.delete('/admin/:id', (req, res) => {
    let sql = `DELETE FROM admin WHERE id = ${req.params.id}`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        administration(req, res);
    })
})
port = process.env.PORT || '3001';
app.listen(port, () => {
    console.log('works');
})