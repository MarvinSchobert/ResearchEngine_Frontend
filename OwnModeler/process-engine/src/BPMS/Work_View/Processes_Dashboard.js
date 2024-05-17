import React, { useState, useEffect } from 'react';
import { Button, ButtonGroup, Container, Modal, ModalBody, ModalFooter, ModalHeader, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import StartProcessInstance from './StartProcessInstance';

const Processes_Dashboard = () => {
	let [processInstances, setProcessInstances] = useState(null);
	let [modal, setModal] = useState(false);

	useEffect(() => {
		const params = {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
				'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
			},
		}
		fetch("/flowable-ui/process-api/runtime/process-instances")
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

	return (
		<Container className='my-4'>
			<Container fluid>
				<div className="float-right">
					<Button color="success" tag={Link} to="/startProcessInstance">Start New Process</Button>
					
				</div>
				<br />
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
		</Container>
	);
}

export default Processes_Dashboard;