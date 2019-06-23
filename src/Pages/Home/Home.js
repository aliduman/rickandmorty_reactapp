import React from 'react';
import {Link} from "react-router-dom";
import debounce from "lodash.debounce";
import loader from '../../loader.gif';
import './Home.css';

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
                        <Link to={'/character/' + data[i].id + '/' + data[i].pageNumber} className={'btn btn-success btn-sm'}>View Character</Link>
                    </div>
                </div>
            </div>
        )
    }

    return (box);
}

export default Home;
