import React from 'react'
import Button from './Button'
import './styles/Header.css'

function Header() {
  return (
    <div className='header'>
      <h1>Welcome Admin</h1>
      <div className='header-btn'>
         <Button name="logout"/>
      </div>
    
    </div>
  )
}

export default Header