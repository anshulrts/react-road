import React, { Component } from 'react';
import './App.css';

//We cannot include a const/let variable inside JS class
// const list = [
//     {
//         title : 'React',
//         url : 'https://reactjs.org',
//         author : 'Jordan Walke',
//         num_comments : 3,
//         points : 4,
//         objectID : 0
//     },
//     {
//         title : 'Redux',
//         url : 'https://redux.js.org',
//         author : 'Don Abramov, Andrew Clark',
//         num_comments : 2,
//         points : 5,
//         objectID : 1
//     }
// ];

const isSearched = searchTerm => item => {
    return item.title.toLowerCase().includes(searchTerm.toLowerCase());
}

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

class App extends Component {

    constructor(props) {
        //All constructors must call super constructors in order to fill them with the value of props
        super(props);
        this.state = {
            //Since the name of list property is same as list variable, we can write it directly
            //list,
            result : null,
            searchTerm : DEFAULT_QUERY,
        }
    }

    onSearchChange = (event) => {
        this.setState({ searchTerm : event.target.value });
    }

    onDismiss = (objectID) => {
        const updatedHits = this.state.result.hits.filter(item => item.objectID !== objectID);
        //Since hits is a property of this.state.result, we need to use Spread Operator
        //(or could have used Object.assign() JS method) to update it
        this.setState({ 
            result : {...this.state.result, hits : updatedHits}
         });
    }

    setsearchTopStories = result => {
        this.setState({ result });
    }

    componentDidMount() {
        const { searchTerm } = this.state;
        this.fetchSearchTopStories(searchTerm);
    }

    onSearchSubmit = (event) => {
        const { searchTerm } = this.state;
        this.fetchSearchTopStories(searchTerm);
        event.preventDefault();
    }

    fetchSearchTopStories = (searchTerm) => {
        //fetch() is the native browser API call which is more powerful than XmlHttpRequest
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
        .then(response => response.json())
        .then(result => this.setsearchTopStories(result))
        .catch(error => { alert("Hello"); return error; });
    } 

    render() {
        const { searchTerm, result } = this.state;

        //We do this because of there isn't any result, then we should not display anything
        //if(!result) { return null; }

        return (
            <div className="page">
                <div className="interactions">
                    <Search
                        value = { searchTerm }
                        onChange = { this.onSearchChange }
                        onSubmit = { this.onSearchSubmit }
                    >
                        {/* Implementing Composable Component using the concept of children */}
                        Search
                    </Search>
                </div>
                {/* There are several ways of doing conditional rendering in React. The one below is using
                truthy and falsy way. In JS, (true && 'Hello') will always return 'Hello' and 
                (false && 'Hello') will always return false */}
                { result && 
                    <Table
                        list = { result.hits }
                        onDismiss = { this.onDismiss }
                    />
                }
            </div>
        );
    }
}

const Search = ({ value, onChange, onSubmit, children }) =>
        <form onSubmit={onSubmit}>
            { children }
            <input
                type="text"
                value = { value }
                onChange = { onChange }
            / >
            <button
                type = "submit"
            >
                { children }
            </button>
        </form>

const Table = ({ list, onDismiss }) =>
        <div className = "table">
            {
                list.map(item =>
                        <div key={item.objectID} className="table-row">
                            <span style={{ width: '40%' }}>
                                <a href={item.url}>{item.title}</a>
                            </span>
                            <span style={{ width: '30%' }}>
                                {item.author}
                            </span>
                            <span style={{ width: '10%' }}>
                                {item.num_comments}
                            </span>
                            <span style={{ width: '10%' }}>
                                {item.points}
                            </span>
                            <span style={{ width: '10%' }}>
                                <Button
                                    onClick = { () => onDismiss(item.objectID) }
                                    className = "button-inline"
                                >
                                    Dismiss
                                </Button>
                            </span>
                        </div>
                )
            }
        </div>

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
