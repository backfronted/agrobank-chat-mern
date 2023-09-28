import React from 'react'
import './style.css'

const Button = ({ label = 'Button', type = 'button', disabled = false }) => {
  return (
    <button className="into-btn" type={type} disabled={disabled}>
      {label}
    </button>
  )
}

export default Button
