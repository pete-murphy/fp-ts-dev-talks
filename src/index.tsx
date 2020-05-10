import React from "react"
import ReactDOM from "react-dom"
import "./index.scss"

import { BrowserRouter } from "react-router-dom"
import { App } from "src/App"

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root"),
)
