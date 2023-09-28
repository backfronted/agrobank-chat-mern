import React from 'react'
import './style.css'

const Input = ({
  label = '',
  name = '',
  type = 'text',
  isRequired = true,
  // placeholder = '',
  value = '',
  onChange = () => {},
}) => {
  return (
    <div className="input-con">
      <label for={name} className="input-info">
        {label}
      </label>
      <input
        type={type}
        id={name}
        required={isRequired}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

export default Input
