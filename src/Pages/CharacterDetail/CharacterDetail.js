import React from 'react';
import {Link} from "react-router-dom";
import './CharacterDetail.css';

class CharacterDetail extends React.Component {

    // Karakter'e ait bölümleri getiriyoruz.
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

    // Karakterleri listeliyoruz.
    episodeListView() {
        const list = [];
        this.state.episodes.forEach((item, index) => {
                return list.push(<li className={'list-group-item'} key={index}>{index + 1} - {item.name}</li>)
            }
        );
        return list;
    }

    // Bir karakterin bilgilerini alıyoruz.
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

    render() {
        const {name, image, location} = this.state.user;
        const episodes = this.state.episodes;
        return (
            <div className={"CharacterDetail"}>
                <header className={"CharacterDetail-header text-left mb-3"}>
                    <div className={'container'}>
                        <Link to={'/' + this.props.match.params.page} className={'btn btn-primary'}> Back</Link>
                    </div>
                </header>
                <article className={'Main'}>
                    <div className={'container'}>
                        <div className={'row'}>
                            <div className={'col-sm-3'}>
                                <img className={'card-img mb-3'} src={`${image}`} alt={location.name}/>
                                <h1>{name}</h1>
                                <h2>{location.name}</h2>
                            </div>
                            <div className={'col-sm-9'}>
                                <h3>Episodes</h3>
                                <ul className="list-group">
                                    {this.episodeListView(episodes)}
                                </ul>
                            </div>
                        </div>
                    </div>
                </article>
            </div>)
    }
}

export default CharacterDetail;
