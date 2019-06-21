import React from 'react';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import debounce from "lodash.debounce";
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

class Main extends React.Component {
    render() {
        return (
            <Router>
                <Route path="/" exact component={Home}/>
                <Route path="/character/:id" component={CharacterDetail}/>
            </Router>
        )
    }
}

class Home extends React.Component {

    getCharacters = () => {
        fetch('https://rickandmortyapi.com/api/character/?page=' + this.state.page)
            .then(res => res.json())
            .then(res => {
                console.log(res.results);
                let page = this.state.page;
                this.setState({
                    page: ++page,
                    characters: [
                        ...this.state.characters,
                        ...res.results]
                })
            });
    };

    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            characters: []
        };

        window.onscroll = debounce(() => {
            if (
                window.innerHeight + document.documentElement.scrollTop + 200
                >= document.documentElement.offsetHeight
            ) {
                console.log(window.innerHeight);
                console.log(document.documentElement.scrollTop);
                this.getCharacters();
            }
        }, 200);
    }

    componentDidMount() {
        this.getCharacters();
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <div className={"App"}>
                <header className={"App-header text-center"}>
                    <div className={'container'}>
                        <div className={'row'}>
                            <div className="col-sm-12">
                                <h1> All Characters</h1>
                            </div>
                            {Card(this.state.characters)}
                        </div>
                    </div>
                </header>
            </div>)
    }
}

class CharacterDetail extends React.Component {

    getEpisodes(episodes) {
        for (let item of episodes) {
            fetch(item)
                .then(resEpisode => resEpisode.json())
                .then(res => {
                    this.setState({
                        user: this.state.user,
                        episodes: this.state.episodes.concat(res)
                    })
                });
        }
    }

    getCharacter(id) {
        fetch('https://rickandmortyapi.com/api/character/' + id)
            .then(res => res.json())
            .then(res => {
                if (res) {
                    this.setState({
                        user: res,
                        episodes: []
                    });
                    this.getEpisodes(res.episode);

                }
            }).catch(error => console.warn(error));
    }

    constructor(props) {
        super(props);

        this.state = {
            user: this.props,
            episodes: []
        };
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        this.getCharacter(id);
    }

    componentWillUnmount() {
        this.setState({
            user: this.props,
            episodes: []
        })
    }

    episodeListView() {
        const list = [];
        this.state.episodes.forEach((item, index) => {
                return list.push(<li className={'list-group-item'} key={index}>{item.name}</li>)
            }
        );
        return list;
    }

    render() {
        const {name, image, location} = this.state.user;
        const episodes = this.state.episodes;
        return (<div className={"App"}>
            <header className={"App-header text-center"}>
                <div className={'container'}>
                    <div className={'row'}>
                        <div className={'col-sm-3'}>
                            <img className={'card-img-top mb-3'} src={`${image}`} alt=""/>
                            <Link to={'/'} className={'btn btn-primary'}> Back</Link>
                        </div>
                        <div className={'col-sm-9'}>
                            <h1>{name}</h1>
                            <h2>{location.name}</h2>
                            <br/>
                            <h3>Episode List</h3>
                            <ul className="list-group">
                                {this.episodeListView(episodes)}
                            </ul>
                        </div>

                    </div>
                </div>
            </header>
        </div>)
    }
}

function Card(data) {
    let box = [];
    for (let i = 0; i < data.length; i++) {
        box.push(
            <div className={'col-sm-3 mb-3'} key={i}>
                <img className={'card-img-top'} src={`${data[i].image}`} alt=""/>
                <div className={"card"}>
                    <div className={"card-body"}>
                        <h5 className={"card-title"}>{data[i].name}</h5>
                        <p className={"card-text"}>{data[i].location.name}</p>
                        <Link to={'/character/' + data[i].id}>View Character</Link>
                    </div>
                </div>
            </div>
        )
    }

    return (box);
}

export default Main;
