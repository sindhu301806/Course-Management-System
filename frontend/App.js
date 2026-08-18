import React from 'react';
import './App.css';
import Nav from './nav';
import Login from './login.js';
import Homepage from './homepage';
import CourseList from './CourseList';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CoursePage from './courseinfo';
import Instructor from './instructor';
import Rcdl from './rcdl';
import Courseindept from './courseindept';
import Aline from './aline';
import InstrList from './instructorlist';
import Register from './register';
function App() {
  return (
    <div>    
      <BrowserRouter>
      <Aline />
      <Routes>
        <Route path='/' element={<Nav />} />
        <Route path="/course/" element={<CourseList />} />
        <Route path="/course/running/:dept" element={<Courseindept />} />
        <Route path="/course/:course_id" element={<CoursePage />} />
        <Route path="/instructor/:iid" element={<Instructor />} />
        <Route path="/login/" element={<Login />} />
        <Route path="/home/" element={<Homepage />} />
        <Route path="/course/running" element={<Rcdl />} />
        <Route path="/instructor" element={<InstrList />} /> 
        <Route path="/registration" element={<Register />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
