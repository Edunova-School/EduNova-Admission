// import { useState } from "react";
import {Routes, Route } from "react-router-dom";
import AdmissionPortal from "./pages/signup";
import UndergraduateAdmission from "./pages/undergraduate";
function App(){
  
 return (
    <div>
      <Routes>
        <Route path="/" element={<AdmissionPortal />} ></Route>
        <Route path= "admission/apply/undergraduate" element={<UndergraduateAdmission />}></Route>
      </Routes>
    </div>
  )
}
export default App