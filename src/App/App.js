import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import Home from '../../Pages/Home/Home';
import CharacterDetail from '../../Pages/CharacterDetail/CharacterDetail';
import './App.css';

class Main extends React.Component {
    render() {
        return (
            <Router>
                <Route path="/" exact component={Home}/>
                <Route path="/:page" exact component={Home}/>
                <Route path="/character/:id/:page" component={CharacterDetail}/>
            </Router>
        )
    }
}

export default Main;
