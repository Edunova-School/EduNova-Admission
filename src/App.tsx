// import { useState } from "react";
import {Routes, Route } from "react-router-dom";
import AdmissionPortal from "./pages/signup";
import UndergraduateAdmission from "./pages/undergraduate";
// import { ApplicationProvider } from "./pages/ApplicationContext";
// import ApplicantLayout from "./pages/ApplicantLayout";
// import PersonalInformation from "./pages/PersonalInformation";
// import AcademicInformation from "./pages/AcademicInformation";
// import DocumentsPage from "./pages/DocumentsPage";
// import ReviewApplication from "./pages/ReviewApplication";
// import ApplicationFeePage from "./pages/ApplicationFeePage";
// import SubmitApplicationPage from "./pages/SubmitApplicationPage";
import { ApplicationProvider } from "./pages/admission/ApplicationContext"
import AdmissionFlow from "./pages/admission/Admissionflow"
import ApplicantLayout from "./pages/admission/ApplicantLayout"
import PersonalInformation from "./pages/admission/PersonalInformation"
import EducationPage from "./pages/admission/EducationPage"

function App(){
  
 return (
    <div>
      <ApplicationProvider>
  <Routes>
    <Route path="/" element={<AdmissionPortal />} />
    <Route path="/admission/apply/undergraduate" element={<UndergraduateAdmission />} />
    <Route element={<ApplicantLayout />}>
      <Route path="/admission/apply/:track/personal-information" element={<PersonalInformation />} />
      <Route path="/admission/apply/:track/education" element={<EducationPage />} />
      <Route path="/admission/apply/:track/documents" element={<DocumentsPage />} />
      <Route path="/admission/apply/:track/review" element={<ReviewApplication />} />
      <Route path="/admission/apply/:track/fee" element={<ApplicationFeePage />} />
      <Route path="/admission/apply/:track/submit" element={<SubmitApplicationPage />} />
    </Route>
  </Routes>
</ApplicationProvider>
    </div>
  )
}
export default App