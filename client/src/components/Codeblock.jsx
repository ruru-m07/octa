import React, { useEffect, useState } from "react";

const Codeblock = () => {

  useEffect(() => {
    shiki
    .getHighlighter({
      theme: "github-dark-dimmed",
      langs: ["jsx", "javascript"],
    })
    .then((highlighter) => {
      const code = highlighter.codeToHtml(
        `            import React from "react";
            import ReactDOM from "react-dom/client";
            import App from "./App.jsx";
            import "./index.css";
            import { BrowserRouter } from "react-router-dom";
            import { AuthProvider } from "./context/AuthContext.jsx";
            
            ReactDOM.createRoot(document.getElementById("root")).render(
              <React.StrictMode>
                <BrowserRouter>
                  <AuthProvider>
                    <App />
                  </AuthProvider>
                </BrowserRouter>
              </React.StrictMode>
            );`,
        { lang: "jsx" }
      );
      document.getElementById("output").innerHTML = code;
    });
  }, [])
  

  return (
    <div>
      <div id="output"></div>
    </div>
  );
};

export default Codeblock;
