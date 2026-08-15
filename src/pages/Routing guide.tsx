// /*
//   HOW TO WIRE THIS INTO YOUR APP
//   ------------------------------
//   1. Copy these files into your project, e.g. under `src/admission/`:
//        ApplicationContext.tsx
//        ApplicantLayout.tsx
//        PersonalInformation.tsx
//        AcademicInformation.tsx
//        DocumentsPage.tsx
//        ReviewApplication.tsx
//        ApplicationFeePage.tsx
//        SubmitApplicationPage.tsx

//   2. Wrap your app (or at least the /admission/* subtree) in ApplicationProvider,
//      and nest the form pages under ApplicantLayout so the sidebar persists
//      across every step. Example using react-router-dom v6:
// */

// import { BrowserRouter, Routes, Route } from "react-router-dom"
// import { ApplicationProvider } from "./admission/ApplicationContext"
// import ApplicantLayout from "./admission/ApplicantLayout"
// import UndergraduateAdmission from "./UndergraduateAdmission" // entry/login/faculty/department/programme/requirements/account/created/dashboard — all internal steps, one component
// import PersonalInformation from "./admission/PersonalInformation"
// import AcademicInformation from "./admission/AcademicInformation"
// import DocumentsPage from "./admission/DocumentsPage"
// import ReviewApplication from "./admission/ReviewApplication"
// import ApplicationFeePage from "./admission/ApplicationFeePage"
// import SubmitApplicationPage from "./admission/SubmitApplicationPage"

// export default function App() {
//   return (
//     <BrowserRouter>
//       <ApplicationProvider>
//         <Routes>
//           {/* Entire "choose programme + create account" wizard lives in ONE component,
//               switching between internal steps via useState — same pattern as before,
//               intentionally kept as-is rather than split into routes. */}
//           <Route path="/admission" element={<UndergraduateAdmission />} />

//           {/* Personal Information onward gets a real URL per step + a persistent
//               sidebar (ApplicantLayout), since this part benefits from resumability
//               once Flask-backed saves exist. */}
//           <Route element={<ApplicantLayout />}>
//             <Route path="/admission/personal-information" element={<PersonalInformation />} />
//             <Route path="/admission/academic-information" element={<AcademicInformation />} />
//             <Route path="/admission/documents" element={<DocumentsPage />} />
//             <Route path="/admission/review" element={<ReviewApplication />} />
//             <Route path="/admission/fee" element={<ApplicationFeePage />} />
//             <Route path="/admission/submit" element={<SubmitApplicationPage />} />
//           </Route>
//         </Routes>
//       </ApplicationProvider>
//     </BrowserRouter>
//   )
// }

// /*
//   FLOW SUMMARY
//   ------------
//   /admission                     -> entry / faculty / department / programme / requirements /
//                                      account creation / "Account Created" screen
//                                      (this is your existing UndergraduateAdmission.tsx)
//        |
//        v  "Go to Applicant Dashboard" button navigates to:
//   /admission/dashboard            -> shows progress stepper, "Continue: Personal Information" button
//        |
//        v
//   /admission/personal-information -> Step 3, saves into ApplicationContext, then navigate() to:
//   /admission/academic-information -> Step 4, same pattern
//   /admission/documents            -> Step 5, same pattern
//   /admission/review               -> Step 6, shows a read-only summary of steps 3-5 with Edit links
//   /admission/fee                  -> Step 7, mock payment, sets feePaid=true
//   /admission/submit               -> Step 8, final confirmation checkbox -> setSubmitted(true)
//                                       -> shows "Application Submitted / Under Review" status screen

//   Every page under ApplicantLayout reads/writes the same ApplicationContext, so:
//     - Data entered on step 3 is available for review on step 6
//     - The sidebar's checkmarks and % progress update live via the context's
//       isPersonalComplete / isAcademicComplete / isDocumentsComplete / feePaid / submitted flags
//     - Steps are "locked" in the sidebar (NavLink prevented) until the previous
//       step is complete, keeping the funnel linear
// */