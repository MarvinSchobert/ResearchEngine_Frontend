import React from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import { Button, Container, Card, CardHeader, CardBody, CardTitle, CardText, Row, Col } from 'reactstrap';
import FormatListNumberedRoundedIcon from '@mui/icons-material/FormatListNumberedRounded';
import DesignServicesRoundedIcon from '@mui/icons-material/DesignServicesRounded';
import AddTaskIcon from '@mui/icons-material/AddTask';
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate();
    return (
        <div>
            <Container fluid className="mx-2 my-4">
                <Row>
                    <Col>

                        <Card
                            onClick={() => navigate('/processes')}
                            color="primary"
                            inverse
                            style={{
                                width: '18rem',
                                cursor: "pointer"
                            }}
                        >
                            <CardHeader>
                                <Row>
                                    <Col xs="2">
                                        <FormatListNumberedRoundedIcon />
                                    </Col>
                                    <Col>
                                        Connect
                                    </Col>
                                </Row>

                            </CardHeader>
                            <CardBody>
                                <CardTitle tag="h5">
                                    Process Dashboard
                                </CardTitle>
                                <CardText>
                                    Manage all running process instances and tasks.
                                </CardText>
                            </CardBody>
                        </Card>

                    </Col>
                    <Col>
                        <Card
                            onClick={() => navigate('/tasks')}
                            color="primary"
                            inverse
                            style={{
                                width: '18rem',
                                cursor: "pointer"
                            }}
                        >
                            <CardHeader>
                                <Row>
                                    <Col xs="2">
                                        <AddTaskIcon />
                                    </Col>
                                    <Col>
                                        Work
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <CardTitle tag="h5">
                                    Task Dashboard
                                </CardTitle>
                                <CardText>
                                    Manage all running tasks with one view.
                                </CardText>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col>

                        <Card
                            onClick={() => navigate('/design')}
                            color="secondary"
                            inverse
                            style={{
                                width: '18rem',
                                cursor: "pointer"
                            }}
                        >
                            <CardHeader>
                                <Row>
                                    <Col xs="2">
                                        <DesignServicesRoundedIcon />
                                    </Col>
                                    <Col>
                                        Design
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <CardTitle tag="h5">
                                    App Designer
                                </CardTitle>
                                <CardText>
                                    Design all current apps, processes and forms.
                                </CardText>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );

}
export default Home;