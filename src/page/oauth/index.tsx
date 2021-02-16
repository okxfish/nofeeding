import React from 'react';

const CLIENT_ID = '999999350';
const REDIRECT_URI = window.encodeURIComponent('https://uwpdver.github.io/');
const OPTIONAL_SCOPES = 'read%20write';
const CSRF_PROTECTION_STRING = '123';

const Oauth = () => {
  const url = `https://www.inoreader.com/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${OPTIONAL_SCOPES}&state=${CSRF_PROTECTION_STRING}`
  return (
    <div>
      <a href={url}>Sign in with Inoreader</a>
    </div>
  );
}

export default Oauth;