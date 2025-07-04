import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Header from "./components/Header.jsx";
import TaskInput from "./components/TaskInput.jsx";
import TaskList from "./components/TaskList.jsx";
import TodoApp from "./components/TodoApp.jsx";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-4">
      <div className="w-full max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-2 sm:p-6">
        <Header />
        <TodoApp />
      </div>
    </div>
  );
}

export default App;
