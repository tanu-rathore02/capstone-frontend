import React from 'react'
import '../styles/Card.css'

function Card({name, value, image}) {
  return (
    <div className='card-container'>
        <img src={image} alt='logo' className='card-img'></img>
        <h3 className='card-h'>{name}</h3>
        <p className='card-p'>{value}</p>
    </div>
  )
}

export default Card