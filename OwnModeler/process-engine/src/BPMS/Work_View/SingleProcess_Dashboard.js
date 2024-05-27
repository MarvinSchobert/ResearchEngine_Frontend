import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container, Table, ButtonGroup, Row, Col } from 'reactstrap';


const SingleProcess_Dashboard = () => {
    let [processDiagram, setProcessDiagram] = useState("");
    let [processInstance, setProcessInstance] = useState(null);
    let [tasks, setTasks] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

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
            .then(response => setProcessInstance(response) | console.log(processInstance) | response.processDefinitionId)
            ;



        fetch(`/flowable-ui/process-api/runtime/tasks?&includeProcessVariables=true&processInstanceId=${id}`)
            .then(response => response.json())
            .then(data => setTasks(data.data));
        setProcessDiagram(`http://localhost:8080/flowable-ui/process-api/runtime/process-instances/${id}/diagram`);
    }, [])



    if (tasks === null || processInstance === null) {
        return <>Loading...</>;
    }

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
        return (<tr key={task.id}>
            <td style={{ whiteSpace: 'nowrap' }}>{task.name}</td>
            <td>{task.assignee}</td>
            <td>{task.createTime}</td>
            <td>{JSON.stringify(task.variables, null, 2)}</td>

            <td>
                <ButtonGroup>
                    <Button size="sm" style={{ width: '100px', height: '30px' }} color="primary" onClick={() => completeTask(task.id)}>Complete</Button>
                </ButtonGroup>
            </td>

        </tr>);
    });

    return <div class="my-4 mx-4">
        <Container>
            <Row>
                <Col >
                    <img src={processDiagram} alt='No Process Diagram available.'></img>
                </Col>
                <Col xs="4">
                    <Row>
                        <Button onClick={() => { navigate("/modeller/" + processInstance.processDefinitionId) }}>Edit Process Definition</Button>

                        <Table hover>
                            <thead>
                                <tr>
                                    <th width="30%"></th>
                                    <th width="70%"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr key="1">
                                    <td>Prozess-Name:</td>
                                    <td>{processInstance.processDefinitionName}</td>
                                </tr>
                                <tr key="2">
                                    <td>Starter (User):</td>
                                    <td>{processInstance.startUserId}</td>
                                </tr>
                                <tr key="3">
                                    <td>Start (Datum):</td>
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

            <Table className="mt-4" hover>
                <thead>
                    <tr>
                        <th width="20%">Task Name</th>
                        <th width="10%">Assignee</th>
                        <th width="20%">Create Time</th>
                        <th width="40%">Variables</th>
                        <th width="10%">Complete</th>
                    </tr>
                </thead>
                <tbody>
                    {taskList}
                </tbody>
            </Table>
        </Container>
    </div>
}

export default SingleProcess_Dashboard;