import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Auth } from 'aws-amplify';

const Callback = () => {
  const history = useHistory();

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        await Auth.currentAuthenticatedUser();
        history.push('/'); // Redirect to the main application page after successful authentication
      } catch (error) {
        console.error('Error fetching authentication data:', error);
      }
    };

    fetchAuthData();
  }, [history]);

  return (
    <div>
      <h1>Authenticating...</h1>
    </div>
  );
};

export default Callback;
