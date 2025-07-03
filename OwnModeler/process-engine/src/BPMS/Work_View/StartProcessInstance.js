import { DebounceInputModule } from '@bpmn-io/properties-panel';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';

const StartProcessInstance = ({ tenantId }) => {

    let [processDefinitions, setProcessDefinitions] = useState(null);
    let [newProcessItem, setNewProcessItem] = useState({
        processDefinitionKey: "oneTaskProcess"
    });
    const navigate = useNavigate();
    useEffect(() => {
        fetch("/flowable-ui/process-api/repository/process-definitions?latest=true")
            .then(response => response.json())
            .then(data => {
                setProcessDefinitions(data.data);
                if (data.data[0] && data.data[0].key){
                    setNewProcessItem({ processDefinitionKey: data.data[0].key });
                }
            });
    }, [])

    if (processDefinitions == null) {
        return <>Loading...</>;
    }

    function deleteProcessDeployment() {
        var deploymentId = "";
        processDefinitions.map(proDefKey => {
            if (proDefKey.key === newProcessItem.processDefinitionKey) {
                console.log("ProDefKey Depl: " + JSON.stringify(proDefKey));
                deploymentId = proDefKey.deploymentId;
            }
        });
        console.log("DeplID: " + deploymentId);
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

    async function handleSubmit(event) {
        event.preventDefault();
        const target = event.target;

        var startProcessBody = newProcessItem;

        // set correct tenant Id if applicable        
        processDefinitions.map(proDefKey => {
            if (proDefKey.key === newProcessItem.processDefinitionKey) {
                if (proDefKey.tenantId && proDefKey.tenantId !== "" && (tenantId === proDefKey.tenantId || tenantId === "admin" || tenantId === "marvin.schobert")) {
                    console.log("Same Tenant ID")
                    startProcessBody.tenantId = proDefKey.tenantId;
                }
            }
        });

        console.log("Submit: \n" + JSON.stringify(startProcessBody));
        var response = await fetch('/flowable-ui/process-api/runtime/process-instances', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(startProcessBody),
        });
        if (response.ok) {
            navigate('/processes');
        }
        else {
            alert("Error " + response.status + " (" + response.statusText + ") occured.\n\nPlease check Process Definition Key and Variable Correctness or write Bug Report to marvin.schobert@faps.fau.de.");
        }
    }

    function handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        setNewProcessItem({ ...newProcessItem, [name]: value });
        console.log(newProcessItem)
    }

    function handleChangeJSON(event) {

        const target = event.target;
        const value = target.value;
        const name = target.name;

        try {
            const value = JSON.parse(target.value);
            const name = target.name;

            setNewProcessItem({ ...newProcessItem, [name]: value });

        } catch (e) {
            alert("JSON Format incorrect. Please prepare JSON format and paste in here.")
            console.error(e); // error in the above string (in this case, yes)!
        }
    }

    const allProcessDefinitionsList = processDefinitions.map(proDefKey => {
        // check for tenants 
        if (tenantId === "marvin.schobert" || tenantId === "admin" || tenantId === proDefKey.tenantId) {
            if (proDefKey.name != null) {
                return <option value={proDefKey.key} key={proDefKey.id}>{proDefKey.name}</option>
            }
            else {
                return <option value={proDefKey.key} key={proDefKey.id}> {proDefKey.key} </option>
            }
        }


    });

    return (
        <Container className='my-4'>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label for="processDefinitionKey">Prozess auswählen</Label>
                    <Input id="processDefinitionKey" name="processDefinitionKey" type="select" onChange={handleChange}>
                        {allProcessDefinitionsList}
                    </Input>
                </FormGroup>
                <br></br>
                <FormGroup style={{ display: 'flex', justifyContent: 'space-between'}}>
                    <Button color="primary" type="submit" style={{width: '200px'}}>Start Process</Button>{' '}                   
                    <Button color="danger"   style={{width: '200px'}} onClick={() => deleteProcessDeployment()}>Delete</Button>
                </FormGroup>
            </Form>
        </Container>)
}

export default StartProcessInstance;