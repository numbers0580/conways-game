import React, {Component} from 'react';
import './App.css';
import Board from "./components/Board";

function App() {
    // Found steps to deploy React App to Heroku (which required setting up server.js -- see commented out code below) here:
    // https://medium.com/better-programming/how-to-deploy-your-react-app-to-heroku-aedc28b218ae
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

/*
class App extends Component {
    // Found instructions to set up Express server here:
    // https://medium.com/@maison.moa/setting-up-an-express-backend-server-for-create-react-app-bc7620b20a61
    state = {data: null};

    componentDidMount() {
        this.callBackendAPI()
            .then(res => this.setState({ data: res.express }))
            .catch(err => console.log(err));
    }

    callBackendAPI = async () => {
        const response = await fetch('/express_backend');
        const body = await response.json();

        if(response.status !== 200) {
            throw Error(body.message);
        }
        return body;
    };

    render() {
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
}
*/

export default App;
