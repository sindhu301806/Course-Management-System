import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CourseList = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const result = await axios.get("http://localhost:5000/departments");
      setCourses(result.data);
    };
    fetchCourses();
  }, []);

  return (
    <div>
      <h1>Departments running this semester</h1>
     <ul>
      {courses.map((course) => (
            <li  key={course.dept_name}><Link to={`/course/running/${course.dept_name}`}> {course.dept_name} </Link></li>
      ))}
     </ul>
    </div>
  );
};

export default CourseList;
