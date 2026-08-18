import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const InstrList = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const result = await axios.get("http://localhost:5000/instructor");
      setCourses(result.data);
    };
    fetchCourses();
  }, []);

  return (
    <div>
      <h1>Instructors List</h1>
     <ul>
      {courses.map((course) => (
            <li  key={course.id}>ID:<Link to={`/instructor/${course.id}`}> {course.id}, </Link>Name  : {course.name}</li>
      ))}
     </ul>
    </div>
  );
};

export default InstrList;
