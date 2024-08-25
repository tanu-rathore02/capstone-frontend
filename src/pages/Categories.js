import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header';
import HocWrapper from '../components/HocWrapper';
import Button from '../components/Button';
import Searchbar from '../components/Searchbar';
import CategoryTable from '../components/CategoryTable';
import { useNavigate } from 'react-router-dom';

function Categories() {
  
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/addCategory");
  };
  return (
    <div>
      
    </div>
  )
}

export default HocWrapper(Navbar, Header)(Categories);