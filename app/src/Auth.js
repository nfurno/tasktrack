import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { Form, Button } from 'react-bootstrap';

function SignIn({ setAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = async () => {
    try {
      await Auth.signIn(email, password);
      setAuthenticated(true);
    } catch (error) {
      console.log('error signing in', error);
    }
  };

  return (
    <Form onSubmit={(e) => e.preventDefault()}>
      <Form.Group className="mb-3" controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>

      <Button variant="primary" type="submit" onClick={signIn}>
        Sign In
      </Button>
    </Form>
  );
}

export default SignIn;