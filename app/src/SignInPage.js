import React from 'react';
import SignIn from './SignIn';

const SignInPage = ({ setAuthenticated }) => {
  return (
    <div className="SignInPage">
      <h2>Login</h2>
      <SignIn setAuthenticated={setAuthenticated} />
    </div>
  );
};

export default SignInPage;
