import { DebounceInputModule } from '@bpmn-io/properties-panel';
import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';

const StartProcessInstance = () => {

    let [processDefinitions, setProcessDefinitions] = useState(null);
    let [newProcessItem, setNewProcessItem] = useState({
        processDefinitionKey: "oneTaskProcess",        
        variables: [{ name: "myVar", value: "This is a variable" }]
    });
    const navigate = useNavigate();
    useEffect(() => {
        fetch("/flowable-ui/process-api/repository/process-definitions")
            .then(response => response.json())
            .then(data => setProcessDefinitions(data.data));
    }, [])

    if (processDefinitions === null) {
        return <>Loading...</>;
    }

    function deleteProcessDeployment () {
        var deploymentId = "";
        processDefinitions.map(proDefKey => { 
            console.log(proDefKey.key + " vs. " + newProcessItem.processDefinitionKey);
            if (proDefKey.key == newProcessItem.processDefinitionKey) {
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
            alert ("OK");		
            window.location.reload();
		});
	}
    
    async function handleSubmit (event) {
        event.preventDefault();
        console.log("Submit: \n" + JSON.stringify(newProcessItem));
		var response = await fetch('/flowable-ui/process-api/runtime/process-instances', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newProcessItem),
		});
		if (response.ok){
			navigate('/processes');
		}
		else {
			alert("Error " + response.status + " ("+ response.statusText + ") occured.\n\nPlease check Process Definition Key and Variable Correctness or write Bug Report to marvin.schobert@faps.fau.de.");
		}
    }

    function handleChange (event) {
        const target = event.target;
		const value = target.value;
		const name = target.name;
		setNewProcessItem({...newProcessItem, [name]: value});	
    }

    function handleChangeJSON (event){
		const target = event.target;
		try {
	       const value = JSON.parse(target.value);
	       const name = target.name;
           setNewProcessItem({...newProcessItem, [name]: value});
          
	    } catch (e) {
			alert("JSON Format incorrect. Please prepare JSON format and paste in here.")
	        console.error(e); // error in the above string (in this case, yes)!
	    }		
	}

    const allProcessDefinitionsList = processDefinitions.map(proDefKey => {
        if (proDefKey.name != null) {
            return <option value={proDefKey.key} key={proDefKey.id}> {proDefKey.name} </option>
        }
        else {
            return <option value={proDefKey.key} key={proDefKey.id}> {proDefKey.key} </option>
        }
        
        
    });

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label for="processDefinitionKey">Prozess-ID</Label>
                    <Input id="processDefinitionKey" name="processDefinitionKey" type="select" onChange={handleChange}>
                        {allProcessDefinitionsList}
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label for="variablesField">
                        Variablen (as JSON)
                    </Label>
                    <Input
                        id="variablesField"
                        name="variables"
                        type="textarea"
                        style={{
                            minHeight: 160
                        }}
                        value={JSON.stringify(newProcessItem.variables, null, 2) || ''}
                        onChange={handleChangeJSON}
                    />
                </FormGroup>
                <FormGroup>
                    <Button color="primary" type="submit">Start Process</Button>{' '}
                    <Button color="danger" onClick={() => deleteProcessDeployment()}>Delete Process Definition</Button>
                </FormGroup>
            </Form>
        </Container>)
}

export default StartProcessInstance;