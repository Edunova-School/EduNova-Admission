// import { useState } from "react";
import {Routes, Route } from "react-router-dom";
import AdmissionPortal from "./pages/signup";
import UndergraduateAdmission from "./pages/undergraduate";
import { ApplicationProvider } from "./pages/ApplicationContext";
import ApplicantLayout from "./pages/ApplicantLayout";
import PersonalInformation from "./pages/PersonalInformation";
import AcademicInformation from "./pages/AcademicInformation";
import DocumentsPage from "./pages/DocumentsPage";
import ReviewApplication from "./pages/ReviewApplication";
import ApplicationFeePage from "./pages/ApplicationFeePage";
import SubmitApplicationPage from "./pages/SubmitApplicationPage";

// import PersonalInformation from "./admission/PersonalInformation"
// import AcademicInformation from "./admission/AcademicInformation"
// import DocumentsPage from "./admission/DocumentsPage"
// import ReviewApplication from "./admission/ReviewApplication"
// import ApplicationFeePage from "./admission/ApplicationFeePage"
// import SubmitApplicationPage from "./admission/SubmitApplicationPage"
function App(){
  
 return (
    <div>
      <ApplicationProvider>
  <Routes>
    <Route path="/" element={<AdmissionPortal />} />
    <Route path="/admission/apply/undergraduate" element={<UndergraduateAdmission />} />
    <Route element={<ApplicantLayout />}>
      <Route path="/admission/apply/undergraduate/personal-information" element={<PersonalInformation />} />
      <Route path="/admission/apply/undergraduate/academic-information" element={<AcademicInformation />} />
      <Route path="/admission/apply/undergraduate/documents" element={<DocumentsPage />} />
      <Route path="/admission/apply/undergraduate/review" element={<ReviewApplication />} />
      <Route path="/admission/apply/undergraduate/fee" element={<ApplicationFeePage />} />
      <Route path="/admission/apply/undergraduate/submit" element={<SubmitApplicationPage />} />
    </Route>
  </Routes>
</ApplicationProvider>
    </div>
  )
}
export default App