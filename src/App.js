import React from 'react';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import debounce from "lodash.debounce";
import 'bootstrap/dist/css/bootstrap.css';
import loader from './loader.gif';
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

class Home extends React.Component {
    getCharacters = () => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.remove('d-none');
            loader.classList.add('d-flex');
        }
        fetch('https://rickandmortyapi.com/api/character/?page=' + this.state.page)
            .then(res => res.json())
            .then(res => {
                res.results.map(item => item.pageNumber = this.state.page);
                this.setState({
                    characters: [
                        ...this.state.characters,
                        ...res.results]
                });
                if (loader) {
                    loader.classList.remove('d-flex');
                    loader.classList.add('d-none');
                }
            });
    };

    constructor(props) {
        super(props);

        // Eğer page parametresi varsa değişkene ekliyoruz.
        const urlParams = this.props.match.params;
        let page = 1;
        if (urlParams.hasOwnProperty('page')) {
            page = parseInt(urlParams.page);
        }

        this.state = {
            page: page,
            characters: []
        };

        window.onscroll = debounce(() => {
            if (
                window.innerHeight + document.documentElement.scrollTop + 200
                >= document.documentElement.offsetHeight
            ) {
                let page = this.state.page;
                this.setState({
                    page: ++page
                });
                this.getCharacters();
            }
        }, 200);
    }


    componentDidMount() {
        this.getCharacters();
    }

    componentWillUnmount() {
        this.setState({
            page: 1,
            characters: []
        });
    }

    render() {
        return (
            <div className={'container'}>
                <div className={'row'}>
                    <div className="col-sm-12 mb-4">
                        <h1> All Characters</h1>
                    </div>
                    {Card(this.state.characters, this.state.page)}
                    <div id="loader" className={'d-flex justify-content-center align-items-center'}>
                        <img src={loader} alt="{'loader'}" className={'mr-3'}/>
                        Loading more..
                    </div>
                </div>
            </div>
        )
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
            user: [],
            episodes: []
        });
    }

    episodeListView() {
        const list = [];
        this.state.episodes.forEach((item, index) => {
                return list.push(<li className={'list-group-item'} key={index}>{index + 1} - {item.name}</li>)
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
                            <Link to={'/' + this.props.match.params.page} className={'btn btn-primary'}> Back</Link>
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
                        <Link to={'/character/' + data[i].id + '/' + data[i].pageNumber}>View Character</Link>
                    </div>
                </div>
            </div>
        )
    }

    return (box);
}

export default Main;
