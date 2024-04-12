import React from 'react';
import './App.css';
import FileUpload from './components/Receipt/HomeUpload';
import 'bootstrap/dist/css/bootstrap.min.css';
import{Routes, Route} from 'react-router-dom';
import Home from './components/Home/Home';
import ReceiptList from './components/Receipt/ReceiptList';
import ReceiptDetails from './components/Receipt/ReceiptDetails';
import Navbar from './components/Navbar/Navbar';
import About from './components/About/About';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<FileUpload />} />
        {/* /receipts */}
        <Route path="/receipts" element={<ReceiptList/>} />
        {/* /receipts:/id */}
        <Route path="/receipts/:id" element={<ReceiptDetails />} />

        {/* /upload */}
        <Route path="/upload" element={<FileUpload />} />
        {/* About */}
        <Route path="/about" element={<About/>} />

      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
