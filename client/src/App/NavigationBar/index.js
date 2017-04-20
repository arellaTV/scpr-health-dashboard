import React from 'react';
import shortid from 'shortid';
import SpreadsheetInput from './SpreadsheetInput';
import Authentication from './Authentication';
import ShareButton from './ShareButton';

const NavigationBar = ({ signedIn, history, updateAccessToken, updateAuthenticationStatus }) =>
  <div>
    <div className="navigation-bar">
      <SpreadsheetInput
        signedIn={signedIn}
        history={history}
      />
      <div className="navigation-bar--right">
        <ShareButton signedIn={signedIn} />
        <Authentication
          updateAccessToken={updateAccessToken}
          updateAuthenticationStatus={updateAuthenticationStatus}
          signedIn={signedIn}
        />
      </div>
    </div>
    <div className="navigation-bar__title box-shadow">
      <span className="navigation-bar__title-text">SCPR DASHBOARDS</span>
    </div>
  </div>;

NavigationBar.propTypes = {
  signedIn: React.PropTypes.bool.isRequired,
  history: React.PropTypes.shape({ push: React.PropTypes.func }).isRequired,
  updateAccessToken: React.PropTypes.func.isRequired,
  updateAuthenticationStatus: React.PropTypes.func.isRequired,
};

export default NavigationBar;
