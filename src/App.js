import React, { Component } from 'react';
import './App.css';

const list = [
    {
        title : 'React',
        url : 'https://reactjs.org',
        author : 'Jordan Walke',
        num_comments : 3,
        points : 4,
        objectID : 0
    },
    {
        title : 'Redux',
        url : 'https://redux.js.org',
        author : 'Don Abramov, Andrew Clark',
        num_comments : 2,
        points : 5,
        objectID : 1
    }
];

const isSearched = searchTerm => item => {
    return item.title.toLowerCase().includes(searchTerm.toLowerCase());
}

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            list,
            searchTerm : '',
        }
    }

    onSearchChange(event) {
        this.setState({ searchTerm : event.target.value });
    }

    render() {
        const {searchTerm, list} = this.state;
        return (
            <div className="App">
                <form>
                    <input
                        type="text"
                        onChange = { evt => this.onSearchChange(evt) }
                    / >
                </form>
                {
                    list.filter(isSearched(searchTerm)).map(item =>
                        {
                            return (
                                <div key={item.objectID}>
                                    <span>
                                        <a href={item.url}>{item.title}</a>
                                    </span>
                                    <span>{item.author}</span>
                                    <span>{item.num_comments}</span>
                                    <span>{item.points}</span>
                                </div>
                            )
                        }
                    )
                }
            </div>
        );
    }
}

export default App;
