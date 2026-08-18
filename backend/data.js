const { request, response } = require('express');
const config = require('./config');
const Pool = require('pg').Pool;
const pool = new Pool({
  user: config.user,
  host: config.host,
  database: config.database,
  password: config.password,
  port: config.port,
});

const getUserById = (request, response) => {
  //console.log(request.body);
  const { ID, password } = request.body;
  console.log(ID, password);
  pool.query('SELECT * from user_password where ID=$1 AND hashed_password=$2',[ID,password], (error, results) => {
    if (!results.rowCount) {
      response.json("Invalid Credentials");
    }
    else {response.status(200).json(results.rows);}
  });
};

const departmentlist = async(_request, response) => {
      const current_semester_details = await pool.query(
      'SELECT semester,year FROM reg_dates WHERE start_time = (SELECT MAX(start_time) FROM reg_dates WHERE start_time <= CURRENT_DATE)'
    );
    const {csemester,cyear} = current_semester_details.rows;
    // const csemester='Fall';
    // const cyear = 2010;
  pool.query(
    'select distinct dept_name from takes natural left outer join course where semester=$1 and year=$2',[csemester,cyear],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).json(results.rows);
    }
  );
};

const coursesindept = async(request, response) => {
  const dname = request.params.dname;
      const current_semester_details = await pool.query(
      'SELECT semester,year FROM reg_dates WHERE start_time = (SELECT MAX(start_time) FROM reg_dates WHERE start_time <= CURRENT_DATE)'
    );
    const {csemester,cyear} = current_semester_details.rows;
    // const csemester='Fall';
    // const cyear = 2010;

  pool.query(
    'SELECT course_id from course natural left outer join section WHERE dept_name = $1 and semester=$2 and year=$3',[dname,csemester,cyear],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const courses = (_request, response) => {

  pool.query(
    'SELECT course_id,title FROM course order by course_id asc',
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const student = async (request,response) => {
  // console.log(request.body);
    const sstudentId = request.body;
    const studentId = sstudentId.sid;
    const student_detailsResult = await pool.query('SELECT distinct id,name,dept_name,tot_cred FROM student natural left outer join takes WHERE id=$1',[studentId]);

    const stud_details = student_detailsResult.rows;
    const current_semester_details = await pool.query(
      'SELECT semester,year FROM reg_dates WHERE start_time = (SELECT MAX(start_time) FROM reg_dates WHERE start_time <= CURRENT_DATE)'
    );
    const {csemester,cyear} = current_semester_details.rows;
    // const csemester='Fall';
    // const cyear = 2010;

    // Retrieve the student's previous semester courses from the database
    const prevSemesterCoursesResult = await pool.query(
      '(SELECT p.course_id,title,sec_id,semester,year,credits,grade FROM (student natural left outer join takes) as p,course WHERE id = $1 AND course.course_id=p.course_id) except (SELECT q.course_id,title,sec_id,semester,year,credits,grade FROM (student natural left outer join takes) as q,course WHERE id = $1 AND semester = $3 and year=$2 AND course.course_id=q.course_id) ORDER BY year desc',
      [studentId, cyear,csemester]
    );
    const prevSemesterCourses = prevSemesterCoursesResult.rows;

    // Retrieve the student's current semester courses from the database
    const currentSemesterCoursesResult = await pool.query(
      'SELECT p.course_id,title,sec_id,semester,year,credits,grade FROM (student natural left outer join takes) as p,course WHERE id = $1 AND semester = $2 and year=$3 and p.course_id=course.course_id',[studentId,csemester,cyear]
    );
    const currentSemesterCourses = currentSemesterCoursesResult.rows;

    // Return the student's information and courses
    response.json({
      stud_details,
      prevSemesterCourses,
      currentSemesterCourses,
    });
}

const instructor = async(request,response) => {
  const iid = request.params.iid;
  console.log(iid);
  const instructor_detailsResult = await pool.query('SELECT id,name,dept_name FROM instructor WHERE id=$1',[iid]);
  console.log(instructor_detailsResult);
  const i_details = instructor_detailsResult.rows;
  const current_semester_details = await pool.query(
    'SELECT semester,year FROM reg_dates WHERE start_time = (SELECT MAX(start_time) FROM reg_dates WHERE start_time <= CURRENT_DATE)'
  );
  const {csemester,cyear} = current_semester_details.rows;
  // const csemester='Fall';
  // const cyear = '2010';

  // Retrieve the student's previous semester courses from the database
  const prevSemesterCoursesResult = await pool.query(
    '(SELECT p.course_id,title,semester,year FROM (instructor natural left outer join teaches) as p,course WHERE id = $1 AND course.course_id=p.course_id) except (SELECT q.course_id,title,semester,year FROM (instructor natural left outer join teaches) as q,course WHERE id = $1 AND semester = $3 and year=$2 AND course.course_id=q.course_id) ORDER BY year desc',
    [iid, cyear,csemester]
  );
  const prevSemesterCourses = prevSemesterCoursesResult.rows;

  // Retrieve the student's current semester courses from the database
  const currentSemesterCoursesResult = await pool.query(
    'SELECT p.course_id,title,sec_id,semester,year FROM (instructor natural left outer join teaches) as p,course WHERE id = $1 AND semester = $2 and year=$3 and p.course_id=course.course_id order by p.course_id',[iid,csemester,cyear]
  );
  const currentSemesterCourses = currentSemesterCoursesResult.rows;

  // Return the student's information and courses
  response.json({
    i_details,
    prevSemesterCourses,
    currentSemesterCourses,
  });
}
const dropcourse = async (request, response) => {
  const studentId = request.params.studentId;
  const courseId = request.params.courseId;
  const csemester='Fall';
  const cyear = 2010;
    // Find the student with the specified id
    const studentResult = await pool.query(
      'SELECT * FROM student WHERE id = $1',
      [studentId]
    );
    if (studentResult.rows.length === 0) {
      return response.status(404).json({ error: 'Student not found' });
    }

    // Find the course with the specified id for the student
    const courseResult = await pool.query(
      'SELECT * FROM takes WHERE  id= $1 AND course_id = $2 and semester=$3 and year=$4',
      [studentId, courseId,csemester,cyear]
    );
    console.log(courseResult.rows)
    if (courseResult.rows.length === 0) {
      return response.status(404).json({ error: 'In Currrent Semester Course not found' });
    }

    // Remove the course from the student's courses
    await pool.query(
      'DELETE FROM takes WHERE id = $1 AND course_id = $2 and semester=$3 and year=$4',
      [studentId, courseId,csemester,cyear]
    );

    response.json({ success: true });
};

const courseinfo = async(request, response) => {
  const courseId = parseInt(request.params.courseId);
  pool.query(
    'select * from course where course_id=$1;',[courseId],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );

};
const prereqs = async(request,response) =>{
  const courseId = request.params.courseId;
  pool.query(
    'select prereq_id from prereq where course_id=$1;',[courseId],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
}
const instructsforcourse = async(request,response) => {
  const courseId = request.params.courseId;
      const current_semester_details = await pool.query(
      'SELECT semester,year FROM reg_dates WHERE start_time = (SELECT MAX(start_time) FROM reg_dates WHERE start_time <= CURRENT_DATE)'
    );
    const {csemester,cyear} = current_semester_details.rows;
    // const csemester='Fall';
    // const cyear = 2010;
  pool.query(
    'SELECT  id,name FROM instructor natural left outer join teaches WHERE course_id=$1 AND semester=$2 and year=$3',[courseId,csemester,cyear],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
}

const instrlist=(request,response) =>{
  pool.query(
    'SELECT  id,name,dept_name FROM instructor',
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
}
const alldepts=(request,response) =>{
  pool.query(
    'SELECT  dept_name FROM department',
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
}
const coursesindeptcr = (request, response) => {
  const dname = request.params.dname;

  pool.query(
    'SELECT course_id from course WHERE dept_name = $1',[dname],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const coursesrunning = async(request, response) => {
  const cstring = request.params.cs;
      const current_semester_details = await pool.query(
      'SELECT semester,year FROM reg_dates WHERE start_time = (SELECT MAX(start_time) FROM reg_dates WHERE start_time <= CURRENT_DATE)'
    );
    const {csemester,cyear} = current_semester_details.rows;
    // const csemester='Fall';
    // const cyear = 2010;
    
    console.log(request.params);
  pool.query(
    'SELECT course_id,title,credits,sec_id,time_slot_id FROM course natural left outer join section where (course_id ilike $3  OR title ilike $3) and semester=$1 and year=$2',[csemester,cyear,'%'+cstring+'%'],
    (error, results) => {
      if (error) {
        throw error;
      }
      console.log(results.rows);
      response.status(200).json(results.rows);
    }
  );
};
const registration=async(request,response)=>{
        const current_semester_details = await pool.query(
      'SELECT semester,year FROM reg_dates WHERE start_time = (SELECT MAX(start_time) FROM reg_dates WHERE start_time <= CURRENT_DATE)'
    );
    const {csemester,cyear} = current_semester_details.rows;
    // const csemester='Fall';
    // const cyear = 2010;
  const {sid,course_id, sec_id}  = request.body;
  pool.query(
    "SELECT * FROM course natural left outer join section WHERE course_id = $1 AND $2 = ANY(select sec_id from section where course_id=$1)",
    [course_id, sec_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      if (!results.rows.length) {
        return response.status(400).json({ error: "Invalid course or section" });
      }
      const selectedCourse = results.rows[0];
      pool.query(
        "SELECT * FROM takes WHERE id = $1 AND course_id = $2",
        [sid, selectedCourse.course_id],
        (error, results) => {
          if (error) {
            throw error;
          }
          if (results.rows.length) {
            return response.status(400).json({ error: "Course already registered" });
          }
          pool.query(
            '(select prereq_id from prereq where course_id=$1) except (select course_id from takes where id=$2)',[selectedCourse.course_id,sid],
             (error,results) => {
              if(results.rowCount){return response.status(400).json({ error:"Prerequisites not satisfied" });}
              pool.query(
                'select * from takes natural left outer join section where id=$3 and time_slot_id = (SELECT time_slot_id FROM section WHERE course_id=$1 and sec_id=$2)',[selectedCourse.course_id,selectedCourse.sec_id,sid],
                 (error,result) => {
                  console.log(result);
                  if(result.rowCount){
                    return response.status(400).json({ error: "Slot Crash With already taken courses" });
                 }
                 pool.query(
                  "INSERT INTO takes (id,course_id,sec_id,semester,year) VALUES ($1, $2,$3,$4,$5)",
                  [sid, selectedCourse.course_id,sec_id,csemester,cyear],
                  (error,result1) => {
                    if (error) {
                      throw error;
                    }
                    response.status(200).json({ success: "Course registered successfully" });
                  }
                 );
                 }
              );
             }
          );
         }
      );
    }
  );
  }

const rcourses = async(request,response) =>{
          const current_semester_details = await pool.query(
      'SELECT semester,year FROM reg_dates WHERE start_time = (SELECT MAX(start_time) FROM reg_dates WHERE start_time <= CURRENT_DATE)'
    );
    const {csemester,cyear} = current_semester_details.rows;
    // const csemester='Fall';
    // const cyear = 2010;
  pool.query(
    'SELECT course_id,title,credits,sec_id,time_slot_id from course natural left outer join section WHERE semester=$1 and year=$2 ',[csemester,cyear],
    (error, results) => {
      if (error) {
        throw error;
      }
      else{console.log(results.rows);
      response.status(200).json(results.rows);}
    }
  );
}

module.exports = {
  getUserById,
  departmentlist,
  coursesindept,
  courses,
  courseinfo,
  student,
  instructor,
  instructsforcourse,
  dropcourse,
  prereqs,
  instrlist,
  alldepts,
  coursesindeptcr,
  coursesrunning,
  registration,
  rcourses
};