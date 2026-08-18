import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CourseList = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const result = await axios.get("http://localhost:5000/courses");
      setCourses(result.data);
    };
    fetchCourses();
  }, []);

  return (
    <div>
      <h1>Courses List</h1>
     <ul>
      {courses.map((course) => (
            <li  key={course.id}><Link to={`/course/${course.course_id}`}> {course.course_id} : {course.title}</Link></li>
      ))}
     </ul>
    </div>
  );
};

export default CourseList;
