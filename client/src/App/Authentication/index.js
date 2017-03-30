import React from 'react';

class Authentication extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticationButton: 'Sign in',
      ingestStatus: '',
    };

    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.fetchCredentials = this.fetchCredentials.bind(this);
  }

  componentDidMount() {
    this.fetchCredentials();
  }

  fetchCredentials() {
    fetch('http://localhost:8080/credentials')
      .then(response => response.json())
      .then((credentials) => {
        gapi.load('auth2', () => {
          const GoogleAuth = gapi.auth2.init(credentials);
          this.setState({ GoogleAuth });
        });
      });
  }

  handleSignIn() {
    const GoogleAuth = this.state.GoogleAuth;
    const options = { prompt: 'select_account' };
    GoogleAuth.signIn(options).then(() => {
      const GoogleUser = GoogleAuth.currentUser.get();
      const AuthResponse = GoogleUser.getAuthResponse(true);
      this.setState({ authenticationButton: 'Sign out' });
      this.props.updateAccessToken(AuthResponse.access_token);
    });
  }

  handleSignOut() {
    const GoogleAuth = this.state.GoogleAuth;
    GoogleAuth.signOut().then(() => {
      this.setState({ authenticationButton: 'Sign in' });
      this.props.updateAccessToken(null);
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
