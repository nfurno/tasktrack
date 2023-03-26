import './App.css';
import { Container, Navbar, Nav, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { createTask, getTasks, updateTask, deleteTask } from './api';
import { Auth } from 'aws-amplify';
import SignIn from './Auth';

function App() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const response = await getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }

  function selectTask(task) {
    setSelectedTask(task);
  }

  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      await Auth.currentAuthenticatedUser();
      setAuthenticated(true);
    } catch (error) {
      setAuthenticated(false);
    }
  };

  return (
    <div className="App">
      {!authenticated ? (
        <SignIn setAuthenticated={setAuthenticated} />
      ) : (
        <div className="App">
          <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
              <Navbar.Brand href="#home">TaskTrack</Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link href="#tasks">Tasks</Nav.Link>
                  <Nav.Link href="#settings">Settings</Nav.Link>
                </Nav>
                <Nav>
                  {authenticated ? (
                    <Nav.Link
                      onClick={async () => {
                        await Auth.signOut();
                        setAuthenticated(false);
                      }}
                    >
                      Logout
                    </Nav.Link>
                  ) : (
                    <Nav.Link href="#login">Login</Nav.Link>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <Container>
            <Row>
              <Col md={4}>
                <h2>Tasks</h2>
                {tasks.map((task) => (
                  <Card key={task.id} className="mb-3">
                    <Card.Body>
                      <Card.Title>{task.name}</Card.Title>
                      <Card.Text>{task.notes}</Card.Text>
                      <Button variant="primary" onClick={() => selectTask(task)}>
                        View Details
                      </Button>
                    </Card.Body>
                  </Card>
                ))}
              </Col>
              <Col md={8}>
                {selectedTask && (
                  <div>
                    <h2>{selectedTask.name}</h2>
                    <p>{selectedTask.notes}</p>
                    <p>Due: {selectedTask.dueDate}</p>
                    <Form onSubmit={(e) => e.preventDefault()}>
                      <Form.Group className="mb-3" controlId="taskName">
                        <Form.Label>Task Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={selectedTask.name}
                          onChange={(e) =>
                            setSelectedTask({ ...selectedTask, name: e.target.value })
                          }
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="taskNotes">
                        <Form.Label>Notes</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={selectedTask.notes}
                          onChange={(e) =>
                            setSelectedTask({ ...selectedTask, notes: e.target.value })
                          }
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="taskDueDate">
                        <Form.Label>Due Date</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          value={selectedTask.dueDate}
                          onChange={(e) =>
                            setSelectedTask({ ...selectedTask, dueDate: e.target.value })
                          }
                        />
                      </Form.Group>

                      <Button
                        variant="primary"
                        type="submit"
                        onClick={async () => {
                          await updateTask(selectedTask);
                          fetchTasks();
                        }}
                      >
                        Update Task
                      </Button>
                    </Form>
                    <Button variant="danger" onClick={() => deleteTask(selectedTask.id)}>
                      Delete Task
                    </Button>
                  </div>
                )}
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </div>
  );
}

export default App;
