import React from 'react';

const ShareButton = (props) => {
  const copyToClipboard = () => {
    const link = document.getElementById('sharebutton__link');
    link.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.log('Copying to clipboard failed.');
    }
  };

  let shareButton;
  if (props.signedIn) {
    shareButton = (
      <div className="sharebutton">
        <span>Shareable link:
          <input type="text" id="sharebutton__link" value={window.location.href} readOnly="true" />
        </span>
        <button onClick={copyToClipboard}>Copy to clipboard</button>
      </div>
    );
  } else {
    shareButton = <div />;
  }

  return shareButton;
};

export default ShareButton;
