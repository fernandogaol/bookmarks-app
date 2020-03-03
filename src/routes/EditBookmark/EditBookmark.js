import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BookmarksContext from '../../contexts/BookmarksContext';
import config from '../../config';
import BookmarkForm from '../../components/BookmarkForm/BookmarkForm';

class EditBookmark extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object
    }),
    history: PropTypes.shape({
      push: PropTypes.func
    }).isRequired
  };

  static contextType = BookmarksContext;

  state = {
    error: null,
    id: null,
    title: null,
    url: null,
    description: null,
    rating: null
  };

  componentDidMount() {
    const { bookmarkId } = this.props.match.params;
    fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) return res.json().then(error => Promise.reject(error));

        return res.json();
      })
      .then(responseData => {
        this.setState({
          id: responseData.id,
          title: responseData.title,
          url: responseData.url,
          description: responseData.description,
          rating: responseData.rating
        });
      })
      .catch(error => {
        console.error(error);
        this.setState({ error });
      });
  }

  handleSubmit = (bookmark, callback) => {
    this.setState({ error: null });
    const { bookmarkId } = this.props.match.params;
    fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
      method: 'PATCH',
      body: JSON.stringify(bookmark),
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) return res.json().then(error => Promise.reject(error));
      })
      .then(() => {
        callback(callback);
        this.context.updateBookmark(bookmark);
        this.props.history.push('/');
      })
      .catch(error => {
        console.error(error);
        this.setState({ error });
      });
  };

  handleClickCancel = () => {
    this.props.history.push('/');
  };

  render() {
    const { error, id, title, url, description, rating } = this.state;
    const bookmark = { id, title, url, description, rating };
    return (
      <section className="EditBookmark">
        <h2>Edit bookmark</h2>
        {id && (
          <BookmarkForm
            onSubmit={this.handleSubmit}
            onCancel={this.handleClickCancel}
            error={error}
            bookmark={bookmark}
          />
        )}
      </section>
    );
  }
}

export default EditBookmark;
