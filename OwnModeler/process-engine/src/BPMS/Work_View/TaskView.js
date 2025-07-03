import { CardGiftcardRounded } from '@mui/icons-material';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, ButtonGroup, Button, Card, CardHeader, CardFooter, CardBody,
    CardTitle, CardText} from 'reactstrap';
import FormViewer from './FormViewer';

let variables = {};

const TaskView = ({task}) => {
    if (task == null) {
        variables = {};
    }
    else {
        // Die Variablen entsprechend ins Form-Format parsen:
        for (var i = 0; i < task.variables.length; i++){
            variables[task.variables[i].name] = task.variables[i].value;

        }        
    }
    
    let [formData, setFormData] = useState({}); // Zustand, um die Form-Daten zu speichern
    let [taskVariables, setTaskVariables] = useState(variables);
    const navigate = useNavigate();       
      
    useEffect(() => { }, [formData]);
  
    if (task == null) {
        return <>No task selected...</>;
    }

    function saveTask(taskId){
        // Updating variables on Process
        console.log ("Saving variables with schema: " + JSON.stringify(formData.schema.components));
        var updateVariables = [];
        var createVariables = [];
        // if variable is existent in process data already, update. Otherwise, create new variable according to schema.
        for (var s = 0; s < formData.schema.components.length; s++){
            var temp = formData.schema.components[s];
            var variableAvailable = false;
            for (var t = 0; t < taskVariables.length; t++){
                if (temp.key == taskVariables[t].name){ // Variable is available already
                    variableAvailable = true;
                    break;
                }
            }

        }


        fetch(`/flowable-ui/process-api/runtime/tasks/${taskId}/variables/variables`, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: "myTaskVariable", value: JSON.stringify(formData)})
        }).then(() => {
            window.location.reload();
        });

    }


    function completeTask(taskId) {       
        var variables = [];
        if (formData != null && formData.schema != null){
            for (var s = 0; s < formData.schema.components.length; s++){
                var temp = formData.schema.components[s]; 
                var item = {};
                item.name = temp.key;
                // item.type = temp.type;
                item.value = formData.data[temp.key]
                if (!item.name || !item.value) continue;
                item.scope = "global";
                variables.push(item);
            }
        }
        console.log ("Completing Task with the following variables: " + JSON.stringify(variables));
        fetch(`/flowable-ui/process-api/runtime/tasks/${taskId}`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: "complete", variables: variables})
        }).then(() => {
            window.location.reload();
        });
    }

    return <Container className="mx-4 my-4">
        <Container fluid>   
            <Card>
                <CardHeader> {task.name} 
                    </CardHeader>
                <CardBody>
                    <CardTitle>{task.assignee}</CardTitle>
                    <Button 
                        size="sm" 
                        style={{ width: '150px', height: '30px' }} 
                        color="primary" 
                        onClick={() => completeTask(task.id)}>
                            Complete
                        </Button>
                        <Button 
                        size="sm" 
                        style={{ width: '150px', height: '30px' }} 
                        color="secondary" 
                        onClick={() => saveTask(task.id)}>
                            Save
                        </Button>
                        <br/><br/>
                    <FormViewer formId={task.formKey} onDataChange={setFormData} data={taskVariables}/>
                    
                        
                    
                </CardBody>
            </Card>
        </Container>
    </Container>
}

export default TaskView;