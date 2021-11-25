import React from "react"

const Toast = ({ message, type }) => {

  return (
    <div className={`toast ${type}`}
      style={{
        width: "50vw",
        height: "50px",
        position: "fixed",
        top: "20px",
        left: "50%",
        opacity: `${type === "End" ? "0" : "1"}`,
        transform: `${type === "End" ? "translate(-50%, -200%)" : "translate(-50%, 0)" }`,
        transition: "opacity .3s, transform .3s",
        backgroundColor: "lightgray",
        display: "flex",
        padding: "5px",
        borderRadius: ".4em",
        border: `${type === "End" ? "0px" : "2px"} solid ${type === "Success" ? "green" : (type === "Error" ? "red" : (type === "Notification" ? "blue" : "gray"))}`,
      }}
    >
      <p><strong>{type !== "End" && type}:</strong> {type !== "End" && message}</p>
    </div>
  )
}

export default Toast
