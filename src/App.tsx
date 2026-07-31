// import { useState } from "react";
import {Routes, Route } from "react-router-dom";
import Header from "./components/header"
import Home from "./pages/home"
import Programs from "./pages/programs";
import Footer from "./components/footer"
import Admission from "./pages/admission";
import About from "./pages/about";
import Contact from "./pages/contactUs";
import PortalLogin from "./pages/PortalLogin";
function App(){
  
 return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} ></Route>
        <Route path="/program" element={<Programs />} ></Route>
        <Route path='/admission' element= {<Admission />}></Route>
        <Route path="/about" element= {<About />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
        <Route path="/portal" element={<PortalLogin />}></Route>
      </Routes>
      <Footer />
    </div>
  )
}
export default App