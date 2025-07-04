import React from 'react';
import './App.css';
import {  Container, Card, CardHeader, CardBody, CardTitle, CardText, Row, Col} from 'reactstrap';
import FormatListNumberedRoundedIcon from '@mui/icons-material/FormatListNumberedRounded';
import DesignServicesRoundedIcon from '@mui/icons-material/DesignServicesRounded';
import AddTaskIcon from '@mui/icons-material/AddTask';
import { useNavigate } from 'react-router-dom'

const Home = ({ loggedIn }) => {
    const navigate = useNavigate();

    const LoggedInStateDependentView = () => {
        if (loggedIn) {
            return (
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
                            onClick={() => navigate('/apps')}
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
            );
        }
        else {
            return (
                <Container>
                    <img width="100%" style={{width:'100%'}}
                    src='https://content.r9cdn.net/rimg/dimg/8c/27/2734909c-city-6518-159ad43913d.jpg?crop=true&width=1020&height=498' />                    
                </Container>
            );
        }
    }


    return (
        <div>
            <Container fluid className="mx-2 my-4">
                <LoggedInStateDependentView />
            </Container>
        </div>
    );

}
export default Home;