import React, { useState, useEffect } from 'react';
import { ButtonGroup, Button, Table, Container, Row, Col } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

let forms = [];
const App_Dashboard = ({ tenantId }) => {
    let [processDefinitions, setProcessDefinitions] = useState([]);
    let [formDefinitions, setFormDefinitions] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        // Process Definitions
        fetch("/flowable-ui/process-api/repository/process-definitions?size=50&latest=true")
            .then(response => response.json())
            .then(data => setProcessDefinitions(data.data));

        // Form Definitions
        fetch("https://e78fcbf0.databases.neo4j.io/db/neo4j/query/v2", {
            method: "POST",
            headers: {
                "Authorization": "Basic bmVvNGo6am5fdG0xZzdqYUlRd0lrM1d4YS1Mdm9pQ3Z3LTRtYzNjbHFUTGpCcTFsQQ==",
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ statement: "MATCH (n:Form) RETURN n.id, n.Name, n.Schema" })
        }).then(response => {
            response.json().then(json => {
                forms = [];
                for (var i = 0; i < json.data.values.length; i++) {
                    var obj = {};
                    obj.id = json.data.values[i][0];
                    obj.name = json.data.values[i][1];
                    // obj.schema = JSON.parse(json.data.values[i][2]);
                    forms.push(obj);
                }
                setFormDefinitions(forms);
            })
        }).catch(e => {
            console.log (e);
        })
    }, [])

    
    if (processDefinitions === null || formDefinitions === null) {
        return <>Loading...</>;
    }
    
    function deleteProcessDeployment(deploymentId) {

        console.log("Delete DeplID: " + deploymentId);
        fetch(`/flowable-ui/process-api/repository/deployments/${deploymentId}`, {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            window.location.reload();
        });
    }


    const formCards = formDefinitions.map(formDefinition => {
        return <tr key={formDefinition.id}>
            <td style={{ whiteSpace: 'nowrap' }}>{formDefinition.name}</td>
            <td style={{ whiteSpace: 'nowrap' }}>{formDefinition.id}</td>
            <td>
                <ButtonGroup>
                    <Button size="sm" style={{ width: '100px', height: '30px' }} color="primary" onClick={() => navigate("/formModeller/" + formDefinition.id)}>Edit</Button>
                </ButtonGroup>
            </td>
            <td>
                <ButtonGroup>
                    <Button size="sm" style={{ width: '100px', height: '30px' }} color="danger" onClick={() => navigate("/formModeller/" + formDefinition.id)}>Delete</Button>
                </ButtonGroup>
            </td>

        </tr>
    })


    const processAppsCards = processDefinitions.map(processDefinition => {
        if (processDefinition.tenantId != tenantId && tenantId != "admin" && tenantId != "marvin.schobert") {
            // Don't show objects that don't belong to the tenant
        }
        else {
            return <tr key={processDefinition.id}>
                <td>
                    <img width={100} src={`/flowable-ui/process-api/repository/process-definitions/${processDefinition.id}/image`}></img>
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>{processDefinition.key}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{processDefinition.version}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{processDefinition.tenantId}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{processDefinition.id}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" style={{ width: '100px', height: '30px' }} color="primary" onClick={() => navigate("/bpmnModeller/" + processDefinition.id)}>Edit</Button>
                    </ButtonGroup>
                </td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" style={{ width: '100px', height: '30px' }} color="danger" onClick={() => deleteProcessDeployment(processDefinition.deploymentId)}>Delete</Button>
                    </ButtonGroup>
                </td>
            </tr>
        }
    })


    const createFormCallback = () => {
        // add in neo4j:
        var rnd = Math.floor(Math.random() * 10000);
        const sma = {
            components: [
            ],
            "type": "default",
            "id": "Form_" + rnd,
            "schemaVersion": 17
        }
        var query = "CREATE (n:Form {id: \"Form_" + rnd + "\", Name: \"Neue Form\", Schema: '" + JSON.stringify(sma) + "'})";
        console.log("Query: " + query);
        // Form erstellen:
        fetch("https://e78fcbf0.databases.neo4j.io/db/neo4j/query/v2", {
            method: "POST",
            headers: {
                "Authorization": "Basic bmVvNGo6am5fdG0xZzdqYUlRd0lrM1d4YS1Mdm9pQ3Z3LTRtYzNjbHFUTGpCcTFsQQ==",
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ statement: query })
        }).then(() => navigate('/formModeller/Form_' + rnd));
    }


    return (
        <Container fluid>
            <br />
            <Row>
                <Col sm='3'><h1>Apps</h1></Col>
                <Col>
                    <Button color="success" style={{ width: '300px', height: '40px' }}> Neue App erstellen</Button>
                </Col>
            </Row>
            <Table className="mt-4">
                <thead>
                    <tr>
                        <th width="10%">Image</th>
                        <th width="20%">App Definition Name</th>
                        <th width="10%">Version</th>
                        <th width="40%">Id</th>
                        <th width="10%">Edit</th>
                        <th width="10%">Delete</th>
                    </tr>
                </thead>
            </Table>


            <br />
            <Row>
                <Col sm='3'><h3>Alle Prozesse</h3></Col>
                <Col>
                    <Button color="success" onClick={() => navigate('/bpmnModeller')} style={{ width: '300px', height: '40px' }}> Neuen Prozess erstellen</Button>
                </Col>
            </Row>

            <Table className="mt-4">
                <thead>
                    <tr>
                        <th width="10%">Image</th>
                        <th width="15%">App Definition Name</th>
                        <th width="5%">Version</th>
                        <th width="10%">Tenant</th>
                        <th width="40%">Id</th>
                        <th width="10%">Edit</th>
                        <th width="10%">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {processAppsCards}
                </tbody>
            </Table>
            <br />
            <Row>
                <Col sm='3'><h3>Formulare</h3></Col>
                <Col>
                    <Button color="success" onClick={() => createFormCallback()} style={{ width: '300px', height: '40px' }}> Neues Formular erstellen</Button>
                </Col>
            </Row>
            <Table className="mt-4">
                <thead>
                    <tr>
                        <th width="30%">Form Name</th>
                        <th width="50%">Id</th>
                        <th width="10%">Edit</th>
                        <th width="10%">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {formCards}
                </tbody>
            </Table>
        </Container>
    );
}

export default App_Dashboard;