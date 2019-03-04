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

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';

class App extends Component {

    constructor(props) {
        //All constructors must call super constructors in order to fill them with the value of props
        super(props);
        this.state = {
            //Since the name of list property is same as list variable, we can write it directly
            //list,
            results : null,
            searchKey : '',
            searchTerm : DEFAULT_QUERY,
        }
    }

    onSearchChange = (event) => {
        this.setState({ searchTerm : event.target.value });
    }

    onDismiss = (objectID) => {
        const { searchKey, results } = this.state;
        const { hits, page } = results[searchKey];


        const updatedHits = hits.filter(item => item.objectID !== objectID);
        //Since hits is a property of this.state.result, we need to use Spread Operator
        //(or could have used Object.assign() JS method) to update it
        this.setState({ 
            results : {
                ...results,
                [searchKey] : { hits : updatedHits, page }
            }
         });
    }

    needsToSearchTopStories = (searchTerm) => {
        return !this.state.results[searchTerm];
    }

    setsearchTopStories = result => {
        const { hits, page } = result;
        const { searchKey, results } = this.state;

        const oldHits = results && results[searchKey] ? result[searchKey].hits : [];
        const updatedHits = [...oldHits, ...hits];

        this.setState({ results : {
                ...results,
                [searchKey] : { hits : updatedHits, page }
            }
        });
    }

    componentDidMount() {
        const { searchTerm } = this.state;
        this.setState({searchKey : searchTerm});
        this.fetchSearchTopStories(searchTerm);
    }

    onSearchSubmit = (event) => {
        const { searchTerm } = this.state;
        this.setState({searchKey : searchTerm});

        if(this.needsToSearchTopStories(searchTerm)) {
            this.fetchSearchTopStories(searchTerm);
        }
        event.preventDefault();
    }

    fetchSearchTopStories = (searchTerm, page = 0) => {
        //fetch() is the native browser API call which is more powerful than XmlHttpRequest
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`)
        .then(response => response.json())
        .then(result => this.setsearchTopStories(result))
        .catch(error => { alert("Error"); return error; });
    } 

    render() {
        const {
            searchTerm,
            results,
            searchKey
        } = this.state;
        
        const page = (
            results &&
            results[searchKey] &&
            results[searchKey].page
            ) || 0;

        const list = (
            results &&
            results[searchKey] &&
            results[searchKey].hits
        ) || [];

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
                <Table
                    list = { list }
                    onDismiss = { this.onDismiss }
                />
                <div className="interactions">
                    {/* Clicking on More button will load more news feeds of same searchTerm. Each result is 
                    assgined a page number */}
                    <Button
                        onClick = { () => this.fetchSearchTopStories(searchTerm, page+1) }
                    >
                        More
                    </Button>
                </div>
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
