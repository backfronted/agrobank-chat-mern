import React from 'react'
import './send.css'

const sendInput = ({
  label = '',
  name = '',
  type = 'text',
  isRequired = true,
  // placeholder = '',
  value = '',
  onChange = () => {},
}) => {
  return (
    <div className="input-send">
      <label for={name} className="input-inf">
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

export default sendInput
