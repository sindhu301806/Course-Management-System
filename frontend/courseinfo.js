import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';

const CoursePage = () => {
  const {course_id} = useParams();
  const [coursedetails, setCoursedetails] = useState([]);
  const [prerequisites, setPrerequisites] = useState([]);
  const [instructors_i, setInstructors] = useState([]);

  const fetchData = async () => {
    let coursedetails= await fetch(`http://localhost:5000/courses/${course_id}`);
    coursedetails = await coursedetails.json();  
    setCoursedetails(coursedetails[0]);
  };

  const fetchPrerequisites = async () => {
    let prerequisites = await fetch(`http://localhost:5000/courses/${course_id}/prereqs`);
    prerequisites = await prerequisites.json();
    setPrerequisites(prerequisites);
  };

  const fetchInstructors = async () => {
    let instructors_i = await fetch(`http://localhost:5000/courses/${course_id}/instructors`);
     instructors_i = await instructors_i.json();
     console.warn(instructors_i);
    setInstructors(instructors_i);
  };
  useEffect(() => {
    fetchData();
    fetchPrerequisites();
    fetchInstructors();
  }, [course_id]);

  return (
    <div>
      <h1>Course Name : {coursedetails.title}</h1>
      <p>Course ID: {coursedetails.course_id}</p>
      <p>Credits: {coursedetails.credits}</p>
      <h2>Prerequisites</h2>
      <ul>
        {prerequisites.map((prerequisite) => (
          <li key={prerequisite.prereq_id}><a href={`http://localhost:3000/course/${prerequisite.prereq_id}`}>{prerequisite.prereq_id}</a></li>
        ))}
      </ul>
      
          <h2>Instructors</h2>
          <ul>
            {instructors_i.map((instructor) => (
              <li key={instructor.id}>Instructor ID:<Link to={`http://localhost:3000/instructor/${instructor.id}`}>{instructor.id}</Link></li>
            ))}
            {instructors_i.map((instructor) => (
              <p key={instructor.id}>Name:{instructor.name}</p>
            ))}
          </ul>


    </div>
  );
};

export default CoursePage;
