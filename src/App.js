import React, { Component } from 'react';
import './App.css';

//We cannot include a const/let variable inside JS class
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
        //All constructors must call super constructors in order to fill them with the value of props
        super(props);
        this.state = {
            //Since the name of list property is same as list variable, we can write it directly
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
                {/* Implementing Composable Component using the concept of children */}
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

const Search = ({ value, onChange, children }) =>
        <form>
            { children }
            <input
                type="text"
                value = { value }
                onChange = { onChange }
            / >
        </form>

{/* class Search extends Component {
    render () {
        //children is used to implement Composable Components
        const { value, onChange, children } = this.props;
        return (
            <form>
                { children }
                <input
                    type="text"
                    value = { value }
                    onChange = { onChange }
                / >
            </form>
        );
    }
}; */}

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
                            <Button
                                onClick = { () => onDismiss(item.objectID) }
                                className = ''
                            >
                                Dismiss
                            </Button>
                        </div>
                )
            }
        </div>
        );
    }
};

class Button extends Component {
    render() {
        const { onClick, className, children } = this.props;

        return (
            <button
                onClick = { onClick }
                className = { className }
                type = "button"
            >
                {children}
            </button>
        )
    }
}

export default App;
