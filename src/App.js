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

    onSearchChange = (event) => {
        this.setState({ searchTerm : event.target.value });
    }

    onDismiss = (objectID) => {
        const list = this.state.list.filter(item => item.objectID !== objectID);
        this.setState({ list });
    }

    render() {
        const { searchTerm, list } = this.state;
        return (
            <div className="App">
            <Search
                value = { searchTerm }
                onChange = { this.onSearchChange }
            >
                Search
            </Search>
            <Table
                list = { list }
                pattern = { searchTerm }
                onDismiss = { this.onDismiss }
            />
            </div>
        );
    }
}

class Search extends Component {
    render () {
        const { value, onChange } = this.props;
        return (
            <form>
                {/* { children } */}
                <input
                    type="text"
                    value = { value }
                    onChange = { onChange }
                / >
            </form>
        );
    }
};

class Table extends Component {
    render () {
        const { list, pattern, onDismiss } = this.props;
        return (
        <div>
            {
                list.filter(isSearched(pattern)).map(item =>
                        <div key={item.objectID}>
                            <span>
                                <a href={item.url}>{item.title}</a>
                            </span>
                            <span>{item.author}</span>
                            <span>{item.num_comments}</span>
                            <span>{item.points}</span>
                            <button
                                onClick = { () => onDismiss(item.objectID) }
                                type = "button"
                            >
                                Dismiss
                            </button>
                        </div>
                )
            }
        </div>
        );
    }
};

export default App;
