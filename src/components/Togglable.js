import React, { useState, useImperativeHandle, forwardRef } from "react"

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return { toggleVisibility }
  })

  return (
    <div>
      <div style={{
        display: visible ? "none" : "",
      }}>
        <button id="togglable-toggler" onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={{
        display: visible ? "" : "none",
      }}>
        {props.children}
        <button id="togglable-cancel" onClick={toggleVisibility}>Cancel</button>
      </div>
    </div>
  )
})

Togglable.displayName = "Togglable"

export default Togglable
