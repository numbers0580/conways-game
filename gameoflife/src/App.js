import React from 'react';
import './App.css';
import Board from "./components/Board";

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Conway's Game of Life</h1>
            </header>
            <div style={{height: "88.2vh", background: "#282c34"}}>
                <Board />
            </div>
        </div>
    );
}

export default App;
