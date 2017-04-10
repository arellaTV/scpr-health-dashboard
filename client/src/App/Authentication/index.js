import React from 'react';

class Authentication extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticationButton: '',
      ingestStatus: '',
    };

    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  componentDidMount() {
    this.fetchCredentials();
  }

  fetchCredentials() {
    const options = {
      method: 'GET',
      credentials: 'same-origin',
    };

    fetch('/credentials', options)
      .then(response => response.json())
      .then((responseJson) => {
        gapi.load('auth2', () => {
          const GoogleAuth = gapi.auth2.init(responseJson.credentials);
          this.checkIfAlreadySignedIn(responseJson.current_user);
          this.setState({ GoogleAuth });
        });
      });
  }

  checkIfAlreadySignedIn(sessionUser) {
    if (sessionUser) {
      const GoogleUser = sessionUser;
      const AuthResponse = GoogleUser.Zi;
      this.props.updateAccessToken(AuthResponse.access_token);
      this.setState({ GoogleUser, authenticationButton: 'Sign out' });
    } else {
      this.setState({ authenticationButton: 'Sign in' });
    }
  }

  handleSignIn() {
    const GoogleAuth = this.state.GoogleAuth;
    const options = { prompt: 'select_account' };

    GoogleAuth.signIn(options).then(() => {
      const GoogleUser = GoogleAuth.currentUser.get();
      const AuthResponse = GoogleUser.getAuthResponse(true);
      this.setState({ authenticationButton: 'Sign out' });
      this.props.updateAccessToken(AuthResponse.access_token);

      const body = JSON.stringify(GoogleUser);
      fetch('/signin', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
    });
  }

  handleSignOut() {
    const GoogleAuth = this.state.GoogleAuth;
    GoogleAuth.signOut().then(() => {
      this.setState({ authenticationButton: 'Sign in' });
      this.props.updateAccessToken(null);

      fetch('/signout', {
        method: 'POST',
        credentials: 'same-origin',
      });
    });
  }

  handleAuthentication() {
    const GoogleUser = this.state.GoogleAuth.currentUser.get();
    if (GoogleUser.isSignedIn()) {
      this.handleSignOut();
    } else {
      this.handleSignIn();
    }
  }

  render() {
    return (
      <button id="authorize-button" onClick={this.handleAuthentication}>
        {this.state.authenticationButton}
      </button>
    );
  }
}

Authentication.propTypes = {
  updateAccessToken: React.PropTypes.func.isRequired,
};

export default Authentication;
