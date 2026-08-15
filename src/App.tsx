// import { useState } from "react";
import {Routes, Route } from "react-router-dom";
import AdmissionPortal from "./pages/signup";
import UndergraduateAdmission from "./pages/undergraduate";
// import PersonalInformation from "./admission/PersonalInformation"
// import AcademicInformation from "./admission/AcademicInformation"
// import DocumentsPage from "./admission/DocumentsPage"
// import ReviewApplication from "./admission/ReviewApplication"
// import ApplicationFeePage from "./admission/ApplicationFeePage"
// import SubmitApplicationPage from "./admission/SubmitApplicationPage"
function App(){
  
 return (
    <div>
      <Routes>
        <Route path="/" element={<AdmissionPortal />} ></Route>
        <Route path= "admission/apply/undergraduate" element={<UndergraduateAdmission />}></Route>
        {/* <Route element={<ApplicantLayout />}>
            <Route path="/admission/personal-information" element={<PersonalInformation />} />
            <Route path="/admission/academic-information" element={<AcademicInformation />} />
            <Route path="/admission/documents" element={<DocumentsPage />} />
            <Route path="/admission/review" element={<ReviewApplication />} />
            <Route path="/admission/fee" element={<ApplicationFeePage />} />
            <Route path="/admission/submit" element={<SubmitApplicationPage />} />
          </Route> */}
      </Routes>
    </div>
  )
}
export default App