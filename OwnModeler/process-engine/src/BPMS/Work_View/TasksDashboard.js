import React, { useState, useEffect } from 'react';
import { Button, ButtonGroup, Container, Col, Row, Table } from 'reactstrap';
import { Link  } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { Menu, MenuItem, Sidebar } from 'react-pro-sidebar';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AddTaskIcon from '@mui/icons-material/AddTask';
import TaskView from './TaskView';


const TasksDashboard = ({ user }) => {
    let [tasks, setTasks] = useState(null);
    let [selectedTask, setSelectedTask] = useState(null);
    let [externalTasks, setExternalTasks] = useState(null);
    let [viewItem, setViewItem] = useState("blank"); // blank, process
    const navigate = useNavigate();

    let { id } = useParams();

    if (id && id !== "") {
        setViewItem(it);
    }

    useEffect(() => {
        fetch(`/flowable-ui/process-api/runtime/tasks?includeProcessVariables=true`)
            .then(response => response.json())
            .then(data => setTasks(data.data));
        fetch(`/flowable-ui/external-job-api/jobs`)
            .then(response => response.json())
            .then(data => setExternalTasks(data.data));


    }, [])

    useEffect(() => {
        if (tasks != null) {
            setSelectedTask(tasks[0])
        }
    }, [tasks])

    if (tasks === null || externalTasks === null || selectedTask === null) {
        return <div>Loading...</div>;
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

    function selectTask(taskId) {
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].id == taskId) {
                console.log("Found Task ID: " + tasks[i].name);
                setSelectedTask(tasks[i]);
                return;
            }
        }
    }

    const taskList = tasks.map(task => {
        return (<tr key={task.id} onClick={() => selectTask(task.id)} >
            <td style={{ whiteSpace: 'nowrap' }}>{task.name}</td>
            <td>{task.assignee}</td>
            <td>{task.createTime}</td>


        </tr>);
    });

    const externalTaskList = externalTasks.map(task => {
        return <tr key={task.id}>
            <td style={{ whiteSpace: 'nowrap' }}>{task.elementName}</td>
            <td>{task.assignee}</td>
            <td>{task.createTime}</td>
        </tr>
    });

    
        const SidebarWorkInstances = 
        tasks.map(task => {
                return <MenuItem
                    style = {{height: '85px'}}
                    component={<div onClick={() => { 
                        setViewItem(task.id); 
                        selectTask(task.id);
                        window.history.replaceState (null, "", "/tasks/" + task.id)
                    }} />}
                    icon={<AssignmentIcon />}>
                    <h6>{task.name} </h6>
                    {task.assignee}  {task.createTime}
                    
                </MenuItem>;
            });

    const StateDependentView = () => {
        if (viewItem == "blank") {
            return <Container fluid className='my-4' style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                <h3>Keine Aufgabe ausgewählt</h3>

            </Container>
        }
        else if (viewItem == "table") {
            return <Container fluid className='my-4'>

                <h3>Task Instances</h3>
                <Table className="mt-4" hover>
                    <thead>
                        <tr>
                            <th width="30%">Task Name</th>
                            <th width="20%">Completed</th>
                            <th width="30%">Start Time</th>
                            <th width="20%">Start User</th>
                        </tr>
                    </thead>
                    <tbody>
                        {taskList}
                    </tbody>
                </Table>
            </Container>
        }
        else {            
            return <TaskView task={selectedTask} />
        }
    }


    return (
        <div style={{ marginTop: '0px', display: "flex", height: "100vh" }}>

            <Sidebar className='app'>
                <Menu>
                    <MenuItem
                        style={{ height: '85px' }}
                        component={<Link to="/startProcessInstance" className="link" />}
                        icon={<AddTaskIcon />}
                    >
                        Neue Aufgabe erstellen
                    </MenuItem>
                    <MenuItem
                        style={{ height: '85px' }}
                        component={<div onClick={() => {
                            setViewItem("table");
                            window.history.replaceState(null, "", "/tasks");
                        }} />}
                        icon={<AddTaskIcon />}
                    >
                        Tabellarische Aufgabenübersicht
                    </MenuItem>
                    {SidebarWorkInstances}
                </Menu>
            </Sidebar>
            <StateDependentView />


        </div>

    );

    return <Container className="my-4 mx-4">
        <h3>Open Tasks</h3>
        <Row>
            <Col sm='6'>
                <Container fluid>

                    <Table className="mt-4" hover>
                        <thead>
                            <tr>
                                <th width="50%">Task Name</th>
                                <th width="20%">Assignee</th>
                                <th width="30%">Create Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {taskList}
                        </tbody>
                    </Table>
                    <br />
                    <br />

                </Container>
            </Col>
            <Col>

                <TaskView task={selectedTask} />

            </Col>
        </Row>

    </Container>
}

export default TasksDashboard;