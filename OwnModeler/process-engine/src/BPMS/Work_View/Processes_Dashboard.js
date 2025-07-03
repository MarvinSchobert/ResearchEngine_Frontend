import React, { useState, useEffect } from 'react';
import { Button, ButtonGroup, Container, Col, Row, Table } from 'reactstrap';
import { Link  } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { Menu, MenuItem, Sidebar } from 'react-pro-sidebar';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AddTaskIcon from '@mui/icons-material/AddTask';
import SingleProcess_Dashboard from './SingleProcess_Dashboard';

const Processes_Dashboard = () => {
	let [processInstances, setProcessInstances] = useState(null);
	let [modal, setModal] = useState(false);
	let [viewItem, setViewItem] = useState ("blank"); // blank, process
	let { id } = useParams();

	
	useEffect(() => {
		if (id && id !== ""){
			setViewItem (id);
		}
		const params = {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
				'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
			},
		}
		fetch("/flowable-ui/process-api/runtime/process-instances?size=50")
			.then(response => response.json())
			.then(data => setProcessInstances(data.data) | console.log(data.data));

	}, [])

	if (processInstances === null) {
		return <>Loading...</>;
	}

	function deleteProcessInstance(processInstanceId, deleteReason) {
		fetch(`/flowable-ui/process-api/runtime/process-instances/${processInstanceId}?deleteReason=${deleteReason}`, {
			method: "DELETE",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		}).then(() => {
			window.location.reload();
		});
	}

	const toggleNewProcessModal = () => setModal(!modal);

	const processInstancesList = processInstances.map(processInstance => {
		return <tr key={processInstance.id}>
			<td style={{ whiteSpace: 'nowrap' }}>{processInstance.processDefinitionName}</td>
			<td>{processInstance.completed}</td>
			<td>{processInstance.startTime}</td>
			<td>{processInstance.startUserId}</td>
			<td>
				<ButtonGroup>
					<Button size="sm" style={{ width: '100px', height: '30px' }} color="primary" tag={Link} to={"/processes/" + processInstance.id}>View</Button>
					<Button size="sm" style={{ width: '100px', height: '30px' }} onClick={() => deleteProcessInstance(processInstance.id, "Clicked Delete Button")} color="danger">Delete</Button>
				</ButtonGroup>
			</td>
		</tr>
	});

	const SidebarWorkInstances = 
		processInstances.map(processInstance => {
			return <MenuItem
				style = {{height: '85px'}}
				component={<div onClick={() => { 
					setViewItem(processInstance.id); 
					window.history.replaceState (null, "", "/processes/" + processInstance.id)
				}} />}
				icon={<AssignmentIcon />}>
				<h6>{processInstance.processDefinitionName} </h6>
				{processInstance.startTime}
				
			</MenuItem>;
		});

	
	const StateDependentView = () => {
		if (viewItem == "blank"){
			return <Container fluid className='my-4' style={{display: 'flex', justifyContent: 'center', alignContent:'center'}}>
				<h3>Keine Prozessinstanz ausgewählt</h3>

			</Container>
		}
		else if (viewItem == "table") {
			return <Container fluid className='my-4'>
				
				<h3>Process Instances</h3>
				<Table className="mt-4" hover>
					<thead>
						<tr>
							<th width="30%">Process Name</th>
							<th width="20%">Completed</th>
							<th width="30%">Start Time</th>
							<th width="20%">Start User</th>
						</tr>
					</thead>
					<tbody>
						{processInstancesList}
					</tbody>
				</Table>
			</Container>
		}
		else {
			return <SingleProcess_Dashboard id = {viewItem}/>
		}
	}


	return (
		<div  style={{ marginTop: '0px', display: "flex", height: "100vh" }}>
			
			<Sidebar className='app'>
				<Menu>
					<MenuItem
						style = {{height: '85px'}}
						 component={<Link to="/startProcessInstance" className="link" />}
						icon={<AddTaskIcon />}
					>
						Neuen Prozess starten
					</MenuItem>
					<MenuItem
						style = {{height: '85px'}}
						 component={<div onClick={() =>{ 
							setViewItem("table");
							window.history.replaceState (null, "", "/processes");
						}}/>}
						icon={<AddTaskIcon />}
					>
						Tabellarische Prozessübersicht
					</MenuItem>
					{SidebarWorkInstances}
				</Menu>
			</Sidebar>
			<StateDependentView/>
				
		
		</div>

	);
}

export default Processes_Dashboard;