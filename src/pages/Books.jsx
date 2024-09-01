import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import HocWrapper from "../components/HocWrapper";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Searchbar from "../components/Searchbar";
import BooksTable from '../components/BooksTable';
import '../styles/Pages.css';

function Books() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/addBooks");
  };

  return (
    <div className='pages-container'>
      <div className='controls-container'>
        <Searchbar/>
        <Button name= "Add Book" className="page-btn" onClick={handleButtonClick}/>
      </div>
      <BooksTable showPagination={true}/>
    </div>
  )
}

export default HocWrapper(Navbar, Header)(Books);
