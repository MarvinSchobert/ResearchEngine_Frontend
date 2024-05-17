import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container, Table, ButtonGroup, Row, Col } from 'reactstrap';


const TasksDashboard = () => {
    let [tasks, setTasks] = useState(null);
    let [externalTasks, setExternalTasks] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`/flowable-ui/process-api/runtime/tasks?includeProcessVariables=true`)
            .then(response => response.json())
            .then(data => setTasks(data.data));
        fetch(`/flowable-ui/external-job-api/jobs`)
            .then(response => response.json())
            .then(data => setExternalTasks(data.data));

    }, [])



    if (tasks === null) {
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
        return <tr key={task.id}>
            <td style={{ whiteSpace: 'nowrap' }}>{task.name}</td>
            <td>{task.assignee}</td>
            <td>{task.createTime}</td>
            <td>{JSON.stringify(task.variables, null, 2)}</td>

            <td>
                <ButtonGroup>
                    <Button size="sm" style={{ width: '100px', height: '30px' }} color="primary" onClick={() => completeTask(task.id)}>Complete</Button>
                </ButtonGroup>
            </td>

        </tr>
    });

    const externalTaskList = externalTasks.map(task => {
        return <tr key={task.id}>
            <td style={{ whiteSpace: 'nowrap' }}>{task.elementName}</td>
            <td>{task.assignee}</td>
            <td>{task.createTime}</td>
            <td>{JSON.stringify(task.variables, null, 2)}</td>

            <td>
                <ButtonGroup>
                    <Button size="sm" style={{ width: '100px', height: '30px' }} color="primary" onClick={() => completeTask(task.id)}>Complete</Button>
                </ButtonGroup>
            </td>

        </tr>
    });

    return <div class="my-4 mx-4">
        <Container fluid>
            <h3>Open Tasks</h3>
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
            <h3>Open External Worker Tasks</h3>
            <Table className="mt-4" hover>
                <thead>
                    <tr>
                        <th width="20%">Element Name</th>
                        <th width="10%">Assignee</th>
                        <th width="20%">Create Time</th>
                        <th width="40%">Variables</th>
                        <th width="10%">Complete</th>
                    </tr>
                </thead>
                <tbody>
                    {externalTaskList}
                </tbody>
            </Table>
        </Container>
    </div>
}

export default TasksDashboard;