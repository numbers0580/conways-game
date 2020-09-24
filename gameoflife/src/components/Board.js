import React, {useState, useCallback, useRef} from "react";
import SquareA from "./SquareA";
import {pattern1, pattern2, pattern3, pattern4, pattern5, pattern6} from "./presets";
import produce from "immer";

const surround = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

const blankGridVals = () => {
    const cellVal = [];
    // Making a grid of 40 rows
    for(let rows = 0; rows < 40; rows++) {
        // This grid also has 60 columns
        cellVal.push(Array.from(Array(60), () => 0));
        // This should create a double array cellVal[0][0] -> [39][59] = 0
    }

    return cellVal;
};

const makeGrid = () => {
    const grid = [];
    for(let row = 0; row < 40; row++) {
        grid.push([]);
        for(let col = 0; col < 60; col++) {
            grid[row].push(<SquareA key={`${col}${row}`} color="5" />)
        }
    }
    return grid;
};

const patternList = {
    pattern1: pattern1,
    pattern2: pattern2,
    pattern3: pattern3,
    pattern4: pattern4,
    pattern5: pattern5,
    pattern6: pattern6
};

const colorList = {
    color1: "#FFFFFF",
    color2: "#FF6600",
    color3: "#C0C0C0",
    color4: "#EEC900",
    color5: "#0000FF",
    color6: "#CC00FF",
    color7: "#00FF00",
    color8: "#66CCFF",
    color9: "#FF0000"
};

function Board() {
    // initial state for grid
    const [gridCells, setCells] = useState(() => {
        return blankGridVals();
    });

    // initial state for speed
    const [speed, setSpeed] = useState(200);
    const velocity = useRef(speed);
    velocity.current = speed;

    //initial state for generations
    const [generations, setGenerations] = useState(0);
    //const genRef = useRef(); // Ended up not using this
    //genRef.current = generations; // Ended up not using this

    // initial state for running set to false
    const [running, setRunning] = useState(false);
    const isRunning = useRef();
    isRunning.current = running;

    // For the Board!
    const [bStyle, setStyle] = useState("flat");
    const [sizing, setBoardSize] = useState(3);
    // colors
    const [cellsBG, setBG] = useState("#00FF00");
    const [cellsFG, setFG] = useState("#CC00FF");

    // useCallback hook allowing function created only once
    const runBoard = useCallback(() => {
        // Check if not running
        if(!isRunning.current) return;

        // setGenerations to iterate over item and increment
        setGenerations((count) => {
            return ++count;
        });

        // update value in the grid and mutate
        setCells((item) => {
            return produce(item, newCell => {
                for(let r = 0; r < 40; r++) {
                    for(let c = 0; c < 60; c++) {
                        let adjacent = 0;
                        // Walled
                        // surround.forEach(([x, y]) => {
                        //     const x1 = r + x;
                        //     const y1 = c + y;
                        //     if(x1 >= 0 && x1 < 40 && y1 >= 0 && y1 < 60) {
                        //         adjacent += item[x1][y1]
                        //     }
                        // })

                        //Wrapped
                        surround.forEach(([x, y]) => {
                            let x1 = r + x;
                            let y1 = c + y;

                            if(x1 < 0) {
                                x1 += 40;
                            }
                            if(x1 >= 40) {
                                x1 -= 40;
                            }
                            if(y1 < 0) {
                                y1 += 60;
                            }
                            if(y1 >= 60) {
                                y1 -= 60;
                            }

                            if(x1 >= 0 && x1 < 40 && y1 >= 0 && y1 < 60) {
                                adjacent += item[x1][y1]
                            }
                        })

                        // Dies due to underpopulation or overpopulation
                        if(adjacent < 2 || adjacent > 3) {
                            newCell[r][c] = 0;
                        // regardless if live or dead, set to live if exactly 3 adjacents are live
                        } else if(adjacent === 3) {
                            newCell[r][c] = 1;
                        }
                    }
                }
            });
        })

        // setTimeout using selected speed
        setTimeout(runBoard, velocity.current)
    }, [])

    const switchPattern = e => {
        let pName = e.target.value;

        if(pName === "None") {
            setCells(blankGridVals);
        } else {
            setCells(patternList[pName]);
        }
    }

    const accelerator = e => {
        setSpeed(e.target.value);
    }

    const stylize = e => {
        setStyle(e.target.value);
    };

    const magnify = e => {
        if(e.target.value === "large") {
            setBoardSize(5);
        }
        else if(e.target.value === "medium") {
            setBoardSize(4);
        }
        else {
            setBoardSize(3);
        }
    };

    const bgcontrol = e => {
        let bgName = e.target.value;
        setBG(colorList[bgName]);
    }

    const fgcontrol = e => {
        let fgName = e.target.value;
        setFG(colorList[fgName]);
    }

    return(
        <div style={{background: "#282c34", paddingTop: "10px", width: "100%", display: "flex", justifyContent: "space-around"}}>
            {/* <div className="grid-board" style={{width: "1204px", border: "2px solid black"}}>
                {makeGrid()}
            </div> */}

            <div style={{display: "flex", flexDirection: "column", alignItems: "start"}}>
                <div className="cells" style={{display: "grid", gridTemplateColumns: `repeat(60, ${sizing * 4}px)`}}>
                    {/*THE ORIGINAL METHOD I WANTED TO WORK */}
                    {/* {gridCells.map((rw, i) => rw.map((cl, j) => 
                        <SquareA key={`${i}-${j}`} onClick={() => {
                            if(!running) {
                                const newGrid = produce(gridCells, nextLayer => {
                                    nextLayer[i][j] = gridCells[i][j] ? 0 : 1;
                                });
                                setCells(newGrid);
                            }
                        }} color={gridCells[i][j] ? "4" : "5"} />
                    ))} */}

                    {/*THE METHOD THAT DOES WORK, BUT DOESN'T EXCITE ME */}
                    {/* {gridCells.map((rw, i) => rw.map((cl, j) => 
                        <div key={`${i}-${j}`} onClick={() => {
                            if(!running) {
                                const newGrid = produce(gridCells, nextLayer => {
                                    nextLayer[i][j] = gridCells[i][j] ? 0 : 1;
                                });
                                setCells(newGrid);
                            }
                        }} style={{width: "20px", height: "20px", background: gridCells[i][j] ? cellsFG : cellsBG, border: "1px solid #282c34"}}/>
                    ))} */}

                    {/*I'M GOING TO TRY TO CREATE THE STYLING MANUALLY */}
                    {/* {gridCells.map((rw, i) => rw.map((cl, j) => 
                        <div key={`${i}-${j}`} onClick={() => {
                            if(!running) {
                                const newGrid = produce(gridCells, nextLayer => {
                                    nextLayer[i][j] = gridCells[i][j] ? 0 : 1;
                                });
                                setCells(newGrid);
                            }
                        }} style={{
                            borderStyle: "solid",
                            width: `${sizing * 4}px`,
                            height: `${sizing * 4}px`,
                            borderWidth: `${sizing}px`,
                            backgroundColor: gridCells[i][j] ? cellsFG : cellsBG,
                            borderLeftColor: "#FFFFFF33",
                            borderTopColor: "#FFFFFF55",
                            borderRightColor: "#00000026",
                            borderBottomColor: "#00000080"
                        }} />
                    ))} */}

                    {/*FINAL */}
                    {gridCells.map((rw, i) => rw.map((cl, j) => 
                        <div key={`${i}-${j}`} onClick={() => {
                            if(!running) {
                                const newGrid = produce(gridCells, nextLayer => {
                                    nextLayer[i][j] = gridCells[i][j] ? 0 : 1;
                                });
                                setCells(newGrid);
                            }
                        }} style={bStyle === "flat" ? {
                            width: `${sizing * 4}px`,
                            height: `${sizing * 4}px`,
                            background: gridCells[i][j] ? cellsFG : cellsBG,
                            border: "1px solid #282c34"
                        } : {
                            borderStyle: "solid",
                            width: `${sizing * 4}px`,
                            height: `${sizing * 4}px`,
                            borderWidth: `${sizing}px`,
                            backgroundColor: gridCells[i][j] ? cellsFG : cellsBG,
                            borderLeftColor: "#FFFFFF33",
                            borderTopColor: "#FFFFFF55",
                            borderRightColor: "#00000026",
                            borderBottomColor: "#00000080"
                        }} />
                    ))}
                </div>
                <div style={sizing < 4 ? {
                    display: "block",
                    color: "#FDFD96"
                } : {
                    display: "none"
                }}>
                    <h3>The Rules:</h3>
                    <p>Each cell is in one of two possible states: live or dead.<br />Every cell interacts with its eight neighbors - horizontally, vertically, and diagonally adjacent.</p>
                    <ul>
                        <li>Any live cell with fewer than two live neighbors dies, as if by underpopulation.</li>
                        <li>Any live cell with two or three live neighbors lives on to the next generation.</li>
                        <li>Any live cell with more than three live neighbours dies, as if by overpopulation.</li>
                        <li>Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.</li>
                    </ul>
                </div>
            </div>
            <div style={{width: "2px", background: "#3ac1f1"}}></div>
            <div style={{width: "400px", display: "flex", background: "#282c34", flexDirection: "column", alignItems: "start"}}>
                <h2 style={{color: "white"}}>Menu Options</h2>
                <div style={{width: "240px", margin: "5px 0", display: "flex", justifyContent: "space-between"}}>
                    <label style={{color: "white"}}>Board Style:</label>
                    <select name="boardwalk" id="boardwalk" onChange={stylize}>
                        <option value="flat" selected>Flat</option>
                        <option value="textured">Textured</option>
                    </select>
                </div>
                <div style={{width: "240px", margin: "5px 0", display: "flex", justifyContent: "space-between"}}>
                    <label style={{color: "white"}}>Board Size:</label>
                    <select name="boardsize" id="boardsize" onChange={magnify}>
                        <option value="small" selected>Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                    </select>
                </div>
                <div style={{width: "240px", margin: "5px 0", display: "flex", justifyContent: "space-between"}}>
                    <label style={{color: "white"}}>Background Color:</label>
                    <select name="bgcolor" id="bgcolor" onChange={bgcontrol}>
                        <option value="color1">White</option>
                        <option style={{background: "#ff6600", color: "white"}} value="color2">Orange</option>
                        <option style={{background: "#c0c0c0"}} value="color3">Silver</option>
                        <option style={{background: "#eec900"}} value="color4">Yellow</option>
                        <option style={{background: "#0000ff", color: "white"}} value="color5">Blue</option>
                        <option style={{background: "#cc00ff", color: "white"}} value="color6">Purple</option>
                        <option style={{background: "#00ff00"}} value="color7" selected>Green</option>
                        <option style={{background: "#66ccff"}} value="color8">Light Blue</option>
                        <option style={{background: "#ff0000", color: "white"}} value="color9">Red</option>
                    </select>
                </div>
                <div style={{width: "240px", margin: "5px 0", display: "flex", justifyContent: "space-between"}}>
                    <label style={{color: "white"}}>Active Color:</label>
                    <select name="fgcolor" id="fgcolor" onChange={fgcontrol}>
                        <option value="color1">White</option>
                        <option style={{background: "#ff6600", color: "white"}} value="color2">Orange</option>
                        <option style={{background: "#c0c0c0"}} value="color3">Silver</option>
                        <option style={{background: "#eec900"}} value="color4">Yellow</option>
                        <option style={{background: "#0000ff", color: "white"}} value="color5">Blue</option>
                        <option style={{background: "#cc00ff", color: "white"}} value="color6" selected>Purple</option>
                        <option style={{background: "#00ff00"}} value="color7">Green</option>
                        <option style={{background: "#66ccff"}} value="color8">Light Blue</option>
                        <option style={{background: "#ff0000", color: "white"}} value="color9">Red</option>
                    </select>
                </div>
                <div style={{width: "240px", margin: "5px 0", display: "flex", justifyContent: "space-between"}}>
                    <label style={{color: "white"}}>Animation Speed:</label>
                    <select name="speeds" id="speeds" onChange={accelerator}>
                        <option value={800}>Slow</option>
                        <option value={200} selected>Normal</option>
                        <option value={50}>Fast</option>
                    </select>
                </div>
                <div style={{width: "240px", margin: "5px 0", display: "flex", justifyContent: "space-between"}}>
                    <label style={{color: "white"}}>Default Pattern:</label>
                    <select name="patterns" id="patterns" onChange={switchPattern}>
                        <option value="None">---</option>
                        <option value="pattern1">Smiley</option>
                        <option value="pattern2">Blossom</option>
                        <option value="pattern3">Derailed</option>
                        <option value="pattern4">Explosions</option>
                        <option value="pattern5">Dance</option>
                        <option value="pattern6">Starship</option>
                    </select>
                </div>
                <div style={{margin: "10px"}} />
                <button style={{margin: "5px"}} onClick={() => {
                    const randCells = [];
                    for(let rC = 0; rC < 40; rC++) {
                        randCells.push(Array.from(Array(60), () => (Math.random() > 0.75 ? 1 : 0)))
                    }
                    setCells(randCells);
                }}>
                    Random
                </button>
                <div style={{width: "240px", display: "flex", justifyContent: "space-between"}}>
                    <button style={{margin: "5px"}} onClick={() => {
                        setRunning(!running);
                        if(!running) {
                            isRunning.current = true;
                            runBoard();
                        }
                    }}>
                        {running ? 'Pause' : 'GO!'}
                    </button>
                    <button style={{margin: "5px"}} onClick={() => {
                        setCells(blankGridVals);
                        setGenerations(0);
                    }}>
                        Clear Board
                    </button>
                </div>
                <div style={{marginTop: `${(sizing - 3) * 160 + 60}px`, color: "white"}}>
                    <h3>Generations: {generations}</h3>
                </div>
            </div>
        </div>
    );

}

export default Board