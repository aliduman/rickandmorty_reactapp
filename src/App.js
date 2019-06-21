import React from 'react';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import './App.css';

function App() {
    return (
        <Router>
            <div className={'header'}>
                <div className={'container'}>
                    <nav className={'nav'}>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/list">List</Link></li>
                            <li><Link to="/detail/abuziddin">Detail</Link></li>
                        </ul>
                    </nav>
                </div>
            </div>
            <div className={'container'}>
                <Route exact path="/" component={Home}/>
                <Route path="/list" component={List}/>
                <Route path="/detail/:id" component={Detail}/>
            </div>
        </Router>
    );
}

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            characters: []
        }
    }

    componentDidMount() {
        fetch('https://rickandmortyapi.com/api/character/')
            .then(res => res.json())
            .then(data => {
                console.log(data.results);
                this.setState(
                    {characters: data.results}
                )
            });
    }

    render() {
        return (
            <div className={'container'}>
                {characterList(this.state.characters)}
            </div>
        )
    }
}

function characterList(data) {
    console.log('function in data>>>', data);
    for (let i = 0; i > data.length; i++) {
        return (
            <div className={'box'}>
                {data[i].name}
            </div>
        );
    }
}

function List() {
    return (
        <div>
            <h1>List</h1>
        </div>
    )
}


function Detail({match}) {
    return (
        <div>
            <li><Link to="/">Back</Link></li>
            <h1>{match.params.id}</h1>
        </div>
    )
}

export default App;
