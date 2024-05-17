import React, { useState, useEffect } from 'react';
import { ButtonGroup, Button, Table, Container } from 'reactstrap';
import { useNavigate } from 'react-router-dom';


const Design_Dashboard = () => {
    let [processDefinitions, setProcessDefinitions] = useState(null);

    const navigate = useNavigate();
    useEffect(() => {
        fetch("/flowable-ui/process-api/repository/process-definitions")
            .then(response => response.json())
            .then(data => setProcessDefinitions(data.data));
    }, [])

    if (processDefinitions === null) {
        return <>Loading...</>;
    }



    const processAppsCards = processDefinitions.map(processDefinition => {
        return <tr key={processDefinition.id}>
            <td>
                <img width={100} src={`/flowable-ui/process-api/repository/process-definitions/${processDefinition.id}/image`}></img>
            </td>
            <td style={{ whiteSpace: 'nowrap' }}>{processDefinition.key}</td>
            <td style={{ whiteSpace: 'nowrap' }}>{processDefinition.id}</td>
            <td>
                <ButtonGroup>
                    <Button size="sm" style={{ width: '100px', height: '30px' }} color="primary" onClick={() => navigate ("/modeller/" + processDefinition.id)}>Edit</Button>
                </ButtonGroup>
            </td>
        </tr>
    })

    return (
        <Container fluid>
            <br />
            <h3>Apps</h3>
            <Table className="mt-4">
                <thead>
                    <tr>
                        <th width="10%">Image</th>   
                        <th width="20%">App Definition Name</th>         
                        <th width="50%">Id</th>                 
                        <th width="20%">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {processAppsCards}
                </tbody>
            </Table>

        </Container>
    );
}

export default Design_Dashboard;