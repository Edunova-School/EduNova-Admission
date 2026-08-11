// import { useState } from "react";
import {Routes, Route } from "react-router-dom";
import AdmissionPortal from "./assets/pages/signup";
function App(){
  
 return (
    <div>
      <Routes>
        <Route path="/" element={<AdmissionPortal />} ></Route>
        
      </Routes>
    </div>
  )
}
export default App