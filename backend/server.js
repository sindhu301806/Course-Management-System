const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express();
const PORT = 5000;

const db = require('./data');
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(cors());

app.post('/login', db.getUserById);
app.get('/departments',db.departmentlist);
app.get('/coursesindept/:dname',db.coursesindept);
app.get('/courses',db.courses);
app.get('/courses/:courseId',db.courseinfo);
app.get('/courses/:courseId/prereqs',db.prereqs);
app.get('/courses/:courseId/instructors',db.instructsforcourse);
app.post('/student',db.student);
app.get('/instructor/:iid',db.instructor);
app.delete('/student/drop/:studentId/:courseId',db.dropcourse);
app.get('/instructor',db.instrlist);
app.get('/alldepts',db.alldepts);
app.get('/coursesindep/:dname',db.coursesindeptcr);
app.get('/coursesrunning/:cs',db.coursesrunning);
app.post('/register',db.registration);
app.get('/coursesrunning',db.rcourses);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});