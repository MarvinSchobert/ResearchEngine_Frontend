import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container, Table, ButtonGroup, Row, Col, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import TaskView from './TaskView';


const SingleProcess_Dashboard = ({id}) => {
    let [processDiagram, setProcessDiagram] = useState("");
    let [processInstance, setProcessInstance] = useState(null);
    let [tasks, setTasks] = useState(null);
    let [selectedTask, setSelectedTask] = useState(null);
    let [activeTab, setActiveTab] = useState ('1');
  
    const navigate = useNavigate();


    useEffect(() => {
        if (tasks != null) {
            setSelectedTask(tasks[0])
        }
    }, [tasks])

    useEffect(() => {

        fetch(`/flowable-ui/process-api/runtime/process-instances/${id}`)
            .then((response) => {
                if (!response.ok) {
                    console.error("Process Instance not existing. Redirecting.");
                    navigate('/processes');
                }
                else {
                    response.json()
                }
            });

        fetch(`/flowable-ui/process-api/runtime/process-instances/${id}`)
            .then(response => response.json())
            .then(response => setProcessInstance(response) | response.processDefinitionId)
            ;



        fetch(`/flowable-ui/process-api/runtime/tasks?&includeProcessVariables=true&processInstanceId=${id}`)
            .then(response => response.json())
            .then(data => setTasks(data.data));
        setProcessDiagram(`http://localhost:8080/flowable-ui/process-api/runtime/process-instances/${id}/diagram`);
    }, [])



    if (id === null || id === "" || tasks === null || processInstance === null) {
        return <>Loading...</>;
    }

    // TODO: Ab hier das Taskview-Fenster einbetten (Siehe TasksDashboard)

    function completeTask(taskId) {
        fetch(`/flowable-ui/process-api/runtime/tasks/${taskId}`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: "complete" })
        }).then(() => {
            window.location.reload();
        });
    }

    const taskList = tasks.map(task => {
        console.log("Form ID: " + task.formKey)
        return (<tr key={task.id} onClick={() => {setSelectedTask(task); console.log ("Clicked " + task.name)}}>
            <td style={{ whiteSpace: 'nowrap' }}>{task.name}</td>
            <td>{task.assignee}</td>
            <td>{task.createTime}</td>
        </tr>);
    });

    return <div class="my-4 mx-4">
        <Container>
            <Row style={{border: '2px solid rgb(175, 174, 174)'}}>
                <Col xs="auto">
               
                    <img style={{ verticalAlign:'center', width:'100%'}}  src={processDiagram} alt='No Process Diagram available.'></img>
                    
                </Col>
                <Col >
                    <Row>
                        {//<Button onClick={() => { navigate("/modeller/" + processInstance.processDefinitionId) }}>Edit Process Definition</Button>
                        }
                        <Table hover>
                            <thead>
                                <tr>
                                    <th width="30%"></th>
                                    <th width="70%"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr key="1">
                                    <td>Prozessname:</td>
                                    <td>{processInstance.processDefinitionName}</td>
                                </tr>
                                <tr key="2">
                                    <td>Starteruser:</td>
                                    <td>{processInstance.startUserId}</td>
                                </tr>
                                <tr key="3">
                                    <td>Startdatum:</td>
                                    <td>{new Date(processInstance.startTime).toLocaleString()}</td>
                                </tr>
                                <tr key="4">
                                    <td>Prozess-Id:</td>
                                    <td>{processInstance.id}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Row>
                </Col>
            </Row>
            <br></br>
            <Row>
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            active= {activeTab === '1'}
                            onClick={() => setActiveTab ('1')}
                        >
                            Offene Aufgaben
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                           active= {activeTab === '2'}
                            onClick={() => setActiveTab ('2')}
                        >
                            Personen
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                           active= {activeTab === '3'}
                            onClick={() => setActiveTab ('3')}
                        >
                            Audit
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                           active= {activeTab === '4'}
                            onClick={() => setActiveTab ('4')}
                        >
                            Kommentare und Anhänge
                        </NavLink>
                    </NavItem>
                </Nav>  
                <TabContent activeTab= {activeTab}>
                    <TabPane tabId="1">
                        <Row>
                        <Col>
                    <Table className="mt-4" hover>
                        <thead>
                            <tr>
                                <th width="20%">Task Name</th>
                                <th width="10%">Assignee</th>
                                <th width="20%">Create Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {taskList}
                        </tbody>
                    </Table>
                </Col>
                <Col>
                    <TaskView task={selectedTask} />
                </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="2">
                        <Row>
                            <Col sm="12">
                                <h4 className='mt-4'>Tab 2 Contents</h4>
                            </Col>
                        </Row>
                    </TabPane>
                </TabContent>



                
            </Row>
        </Container>
    </div>
}

export default SingleProcess_Dashboard;