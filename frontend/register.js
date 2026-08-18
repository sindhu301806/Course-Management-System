import React, { useState } from 'react';


const Register = () => {
  const auth=localStorage.getItem("user");
  const ID=JSON.parse(auth);
  const sid= ID[0].id;
  console.log(sid);
  const [courses, setCourses] = useState([]);
  
  const cdata = async() =>{
    let response= await fetch(`http://localhost:5000/coursesrunning`);
    response=await response.json();
    console.log(response); 
    setCourses(response); 
};

  const handleSearch = async (event) => {
    let search=event.target.value;
    if(search){
        let response = await fetch(`http://localhost:5000/coursesrunning/${search}`);
        response= await response.json();
        console.log(search, response);
        setCourses(response);   
    }
    else{
         cdata();
    }
    console.log(courses);
  };
//   const handleSelect = (selectedCourse) => {
//     setSelectedCourse(selectedCourse);
//   };

//   handleSelect();
  const handleRegister = async (course_id,sec_id) => {
    let response = await fetch('http://localhost:5000/register', {
        method:'post',
        body: JSON.stringify({sid,course_id,sec_id}),
        headers:{
            'Content-Type':'application/json'
        }
    });
    if (response.data.success) {
        console.log("Success");
    } else {
      alert("Error Occured");
    }
  };
  return (
    <div>
      <h1>Registration Details</h1>
      <input className='inputBox' type="text" placeholder="Search for courses here"  onChange={handleSearch} />
      <table>
        <thead className='tablehead'>
          <tr>
            <th>Course ID</th>
            <th>Title</th>
            <th>Section</th>
            <th>Credits</th>
            <th>Register</th>
          </tr>
        </thead>
        <tbody>
        {courses.map((course_i) => (
            <tr key={course_i.course_id}>
              <td>{course_i.course_id}</td>
              <td>{course_i.title}</td>
              <td>{course_i.sec_id}</td>
              <td>{course_i.credits}</td>
              <td>
              <button onClick={handleRegister(course_i.course_id,course_i.sec_id)}>Register</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
  );
};

export default Register;
