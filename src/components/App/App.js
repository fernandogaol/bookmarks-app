import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import AddBookmark from '../../routes/AddBookmark/AddBookmark';
import EditBookmark from '../../routes/EditBookmark/EditBookmark';
import BookmarkList from '../../routes/BookmarkList/BookmarkList';
import BookmarksContext from '../../contexts/BookmarksContext';
import Nav from '../../components/Nav/Nav';
import NotFoundPage from '../../routes/NotFoundPage/NotFoundPage';
import config from '../../config';
import './App.css';

class App extends Component {
  state = {
    bookmarks: [],
    error: null
  };

  setBookmarks = bookmarks => {
    this.setState({
      bookmarks,
      error: null
    });
  };

  addBookmark = bookmark => {
    this.setState({
      bookmarks: [...this.state.bookmarks, bookmark]
    });
  };

  deleteBookmark = bookmarkId => {
    const newBookmarks = this.state.bookmarks.filter(
      bm => bm.id !== bookmarkId
    );
    this.setState({
      bookmarks: newBookmarks
    });
  };

  componentDidMount() {
    fetch(config.API_ENDPOINT, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(error => Promise.reject(error));
        }
        return res.json();
      })
      .then(this.setBookmarks)
      .catch(error => {
        console.error(error);
        this.setState({ error });
      });
  }

  updateBookmark = updatedBookmark => {
    this.setState({
      bookmarks: this.state.bookmarks.map(bm =>
        bm.id !== updatedBookmark.id ? bm : updatedBookmark
      )
    });
  };

  render() {
    const contextValue = {
      bookmarks: this.state.bookmarks,
      addBookmark: this.addBookmark,
      deleteBookmark: this.deleteBookmark,
      updateBookmark: this.updateBookmark
    };
    return (
      <main className="App">
        <Link to={'/'} className="bookmark-home">
          Bookmarks!
        </Link>
        <BookmarksContext.Provider value={contextValue}>
          <Nav />
          <div className="content" aria-live="polite">
            <Switch>
              <Route exact path="/" component={BookmarkList} />
              <Route path="/add-bookmark" component={AddBookmark} />
              <Route path="/edit/:bookmarkId" component={EditBookmark} />
              <Route component={NotFoundPage} />
            </Switch>
          </div>
        </BookmarksContext.Provider>
      </main>
    );
  }
}

export default App;
