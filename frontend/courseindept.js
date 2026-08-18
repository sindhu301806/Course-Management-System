import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

const Courseindept = () => {
  const {dept} = useParams();
  console.log(dept);
;  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const result = await axios.get(`http://localhost:5000/coursesindept/${dept}`);
      setCourses(result.data);
    };
    fetchCourses();
  }, []);

  return (
    <div>
      <h1>Courses List running this semester</h1>
     <ul>
      {courses.map((course) => (
            <li  key={course.course_id}><Link to={`/course/${course.course_id}`}> {course.course_id} </Link></li>
      ))}
     </ul>
    </div>
  );
};

export default Courseindept;
