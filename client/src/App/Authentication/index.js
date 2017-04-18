import React from 'react';

class Authentication extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticationButton: '',
      ingestStatus: '',
    };

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
      .then(credentials => this.props.updateAuthenticationStatus(credentials));
  }

  initializeGoogleAuthentication(responseJson) {
    gapi.load('auth2', () => {
      const GoogleAuth = gapi.auth2.init(responseJson.credentials);
      this.checkIfAlreadySignedInWithGoogle(responseJson.current_user);
      this.setState({ GoogleAuth });
    });
  }

  checkIfAlreadySignedInWithGoogle(sessionUser) {
    if (sessionUser) {
      const GoogleUser = sessionUser;
      const AuthResponse = GoogleUser.Zi;
      this.props.updateAccessToken(AuthResponse.access_token);
      this.setState({ GoogleUser, authenticationButton: 'Sign out' });
    } else {
      this.setState({ authenticationButton: 'Sign in' });
    }
  }

  handleSignIn(event) {
    event.preventDefault();

    const body = JSON.stringify({
      username: event.target[0].value,
      password: event.target[1].value,
    });

    fetch('/signin', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
    .then(response => response.json())
    .then(authenticationResponse => this.props.updateAuthenticationStatus(authenticationResponse));
  }

  googleSignIn() {
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

  googleSignOut() {
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

  handleSignOut() {
    fetch('/signout', {
      method: 'POST',
      credentials: 'same-origin',
    })
    .then(response => response.json())
    .then((responseJson) => {
      console.log(responseJson.message);
      const authenticationResponse = {
        message: 'Signed out!',
        signedIn: false,
      };
      this.props.updateAuthenticationStatus(authenticationResponse);
    });
  }

  handleGoogleAuthentication() {
    const GoogleUser = this.state.GoogleAuth.currentUser.get();
    if (GoogleUser.isSignedIn()) {
      this.handleSignOut();
    } else {
      this.handleSignIn();
    }
  }

  render() {
    let AuthenticationDOMNode;

    if (this.props.signedIn) {
      AuthenticationDOMNode = <button onClick={this.handleSignOut}>Sign out</button>;
    } else {
      AuthenticationDOMNode = (
        <form onSubmit={this.handleSignIn}>
          <input type="text" />
          <input type="password" />
          <input type="submit" />
        </form>
      );
    }

    return AuthenticationDOMNode;
  }
}

Authentication.propTypes = {
  signedIn: React.PropTypes.bool.isRequired,
  updateAccessToken: React.PropTypes.func.isRequired,
  updateAuthenticationStatus: React.PropTypes.func.isRequired,
};

export default Authentication;
