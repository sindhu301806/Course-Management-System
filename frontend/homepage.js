import React, { useState, useEffect } from 'react';

const Homepage = () => {
  const auth=localStorage.getItem("user");
  console.log(auth);
  const ID=JSON.parse(auth);
  const sid= ID[0].id;
  console.log(sid);
  const [stud_details, setStudentdetails] = useState([]);
  const [prevSemesterCourses, setPrevSemesterCourses] = useState([]);
  const [currentSemesterCourses, setCurrentSemesterCourses] = useState([]);

  const studentpage =async() => {
        let result = await fetch('http://localhost:5000/student',{
            method:'post',
            body: JSON.stringify({sid}),
            headers:{
                'Content-Type':'application/json'
            } 
            })     
        result=await result.json();
        setStudentdetails(result.stud_details);
        setPrevSemesterCourses(result.prevSemesterCourses);
        setCurrentSemesterCourses(result.currentSemesterCourses);
        console.log(result);
        console.log(prevSemesterCourses);
        console.warn(currentSemesterCourses);
  }
  useEffect(() => {
    studentpage()
  });
  
   const handleDropCourse=async(courseId) => {
    try {
      const res = await fetch(`http://localhost:5000/student/drop/${sid}/${courseId}`, {
        method: 'DELETE',
      });
     console.log(res);
      if (!res.ok) {
        throw new Error('Failed to drop course');
      }
  
      const updatedCurrentSemesterCourses = currentSemesterCourses.filter(
        (course) => course.course_id !== courseId
      );
      setCurrentSemesterCourses(updatedCurrentSemesterCourses);
    } catch (err) {
      console.warn(err);
    }
  }

const groupedPrevSemesterCourses = prevSemesterCourses.reduce((acc, course_p) => {
    const semester = `${course_p.semester} ${course_p.year}`;
    if (!acc[semester]) {
      acc[semester] = [];
    }
    acc[semester].push(course_p);
    return acc;
  }, {});
  return (
    <div className='jaja'>
      <h1 className='tada'>Welcome to homepage!</h1>
      {
        stud_details.map((item,index)=>
        (<h1 className='tada'>{item.name}</h1>))}
        {stud_details.map((item,index)=>
        (<h1 className='tada'>ID : {item.id}</h1>))}
        {stud_details.map((item,index)=>
        (<h1 className='tada'>Department : {item.dept_name}</h1>))}
        {stud_details.map((item,index)=>
        (<h1 className='tada'>Total Credits : {item.tot_cred}</h1>))}

<h3>Running Courses</h3>
      <table>
        <thead>
          <tr>
            <th>Course ID</th>
            <th>Title</th>
            <th>Section</th>
            <th>Semester</th>
            <th>Year</th>
            <th>Credits</th>
            <th>Drop</th>
          </tr>
        </thead>
        <tbody>
        {currentSemesterCourses.map((course_i) => (
            <tr key={course_i.course_id}>
              <td>{course_i.course_id}</td>
              <td>{course_i.title}</td>
              <td>{course_i.sec_id}</td>
              <td>{course_i.semester}</td>
              <td>{course_i.year}</td>
              <td>{course_i.credits}</td>
              <td>
                <button className='appbutton'
                  onClick={() => {
                    // Implement logic to send a DELETE request to the server to drop the course
                    handleDropCourse(course_i.course_id);
                  }}
                >
                  Drop
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

{Object.keys(groupedPrevSemesterCourses).map((semester) => (
        <div key={semester}>
          <h4>Courses in {semester}</h4>
          <table>
            <thead>
              <tr>
                <th>Course ID</th>
            <th>Title</th>
            <th>Section</th>
            <th>Semester</th>
            <th>Year</th>
            <th>Credits</th>
            <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {groupedPrevSemesterCourses[semester].map((course) => (
                <tr key={course.course_id}>
                  <td>{course.course_id}</td>
              <td>{course.title}</td>
              <td>{course.sec_id}</td>
              <td>{course.semester}</td>
              <td>{course.year}</td>
              <td>{course.credits}</td>
              <td>{course.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

    </div>
  );
};

export default Homepage;