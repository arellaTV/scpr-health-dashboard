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

  handleSignIn(event) {
    event.preventDefault();
    const username = event.target[0];
    const password = event.target[1];

    const options = {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    };

    fetch('/signin', options)
      .then(response => response.json())
      .then((authenticationResponse) => {
        if (authenticationResponse.signedIn) {
          this.props.updateAuthenticationStatus(authenticationResponse);
        } else {
          password.classList.add('authentication__input--invalid-credentials');
        }
      });
  }

  handleSignOut() {
    const options = { method: 'POST', credentials: 'same-origin' };
    fetch('/signout', options)
      .then(response => response.json())
      .then(() => this.props.updateAuthenticationStatus({ signedIn: false }));
  }

  render() {
    let AuthenticationDOMNode;

    if (this.props.signedIn) {
      AuthenticationDOMNode = <button onClick={this.handleSignOut}>Log out</button>;
    } else {
      AuthenticationDOMNode = (
        <div id="underlay">
          <div className="authentication box-shadow">
            <h2>WELCOME</h2>
            <form onSubmit={this.handleSignIn}>
              <p>USERNAME: <input className="authentication__input" type="text" /></p>
              <p>PASSWORD: <input className="authentication__input" type="password" /></p>
              <input type="submit" value="Log in" />
            </form>
          </div>
        </div>
      );
    }

    return AuthenticationDOMNode;
  }
}

Authentication.propTypes = {
  signedIn: React.PropTypes.bool.isRequired,
  updateAuthenticationStatus: React.PropTypes.func.isRequired,
};

export default Authentication;
