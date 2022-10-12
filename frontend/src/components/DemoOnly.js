import React from 'react'

const DemoOnly = ({ children }) => process.env.REACT_APP_DEMO_MODE === "true" ? children : null

export default DemoOnly