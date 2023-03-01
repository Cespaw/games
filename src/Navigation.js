import { Navbar } from "react-bootstrap";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import About from "./About";
import Home from "./Home";
import MultiGame from "./MultiGame/MultiGame";

function Navigation() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/about" element={<About />} />
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/multigame" element={<MultiGame />} />

            </Routes>
        </BrowserRouter>);
}

export default Navigation;