import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
const Instructor =() =>{
    const {iid} = useParams();
    const [i_details, setIdetails] = useState([]);
    const [prevSemesterCourses, setPrevSemesterCourses] = useState([]);
    const [currentSemesterCourses, setCurrentSemesterCourses] = useState([]);

    const instrpage =async() => {
        let result = await fetch(`http://localhost:5000/instructor/${iid}`);     
        result=await result.json();
        setIdetails(result.i_details);
        setPrevSemesterCourses(result.prevSemesterCourses);
        setCurrentSemesterCourses(result.currentSemesterCourses);
        console.log(result);
        console.log(prevSemesterCourses);
        console.warn(currentSemesterCourses);
  }
  useEffect(() => {
    instrpage()
  },[iid]);
    
//   const groupedPrevSemesterCourses = prevSemesterCourses.reduce((acc, course_p) => {
//     const semester = `${course_p.semester} ${course_p.year}`;
//     if (!acc[semester]) {
//       acc[semester] = [];
//     }
//     acc[semester].push(course_p);
//     return acc;
//   }, {});

  return (
    <div className='jaja'>
      {i_details.map((item,index)=>
        (<h1 className='tada'>Instructor Name : {item.name}</h1>))}
        {i_details.map((item,index)=>
        (<h1 className='tada'>Instructor ID : {item.id}</h1>))}
        {i_details.map((item,index)=>
        (<h1 className='tada'>Department : {item.dept_name}</h1>))}

<h3>Running Courses</h3>
      <table>
        <thead>
          <tr>
            <th>Course ID</th>
            <th>Title</th>
            <th>Section</th>
            <th>Semester</th>
            <th>Year</th>
          </tr>
        </thead>
        <tbody>
        {currentSemesterCourses.map((course_i) => (
            <tr key={course_i.course_id}>
              <td><Link to={`/course/${course_i.course_id}`}>{course_i.course_id}</Link></td>
              <td>{course_i.title}</td>
              <td>{course_i.sec_id}</td>
              <td>{course_i.semester}</td>
              <td>{course_i.year}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Courses taught previous</h3>
      <table>
        <thead>
          <tr>
            <th>Course ID</th>
            <th>Title</th>
            <th>Semester</th>
            <th>Year</th>
          </tr>
        </thead>
        <tbody>
        {prevSemesterCourses.map((course_i) => (
            <tr key={course_i.course_id}>
              <td>{course_i.course_id}</td>
              <td>{course_i.title}</td>
              <td>{course_i.semester}</td>
              <td>{course_i.year}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
  
}

export default Instructor;