
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { FormEditor } from '@bpmn-io/form-js' 

import "@bpmn-io/form-js/dist/assets/form-js.css";
import "@bpmn-io/form-js/dist/assets/form-js-editor.css";

import { Button, Container, Row, Col, ButtonGroup } from 'reactstrap';
import CamundaBpmnModdle from 'camunda-bpmn-moddle/resources/camunda.json'

var minDash = require("min-dash")

const data = { }

const default_schema = {
    type: 'default',
    components: [
      {
        key: 'creditor',
        label: 'Creditor',
        type: 'textfield',
        validate: {
          required: true,
        },
      },
    ],
  };

function FormModeller() {  
    const [modeler, modelerSet] = useState("");
    const [schema, setSchema] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();
    
    useEffect(() => {               
        if (modeler) { return; }
        const formEditorInstance = new FormEditor ({
            container: document.querySelector('#form'),            
            moddleExtensions: {
                camunda: CamundaBpmnModdle
            }
        })    
        var query = "MATCH (n:Form) WHERE n.id = \""+ id +"\" RETURN n.Schema"
        // Form raussuchen:
        fetch("https://e78fcbf0.databases.neo4j.io/db/neo4j/query/v2", {
            method: "POST",
            headers: {
                "Authorization": "Basic bmVvNGo6am5fdG0xZzdqYUlRd0lrM1d4YS1Mdm9pQ3Z3LTRtYzNjbHFUTGpCcTFsQQ==",
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ statement: query })
        }).then(response => {
            response.json().then (json => {   
                let s_;               
                for (var i = 0; i < json.data.values.length; i++) {
                    console.log (json.data.values[i][0]);
                    if (json.data.values[i][0] == "Init") {
                        s_ = default_schema;
                        console.log ("Set default values")
                    }
                    else {
                        s_ = JSON.parse(json.data.values[i][0]);                        
                    }
                    setSchema(s_);
                    formEditorInstance                    
                    .importSchema (s_, data)
                    .then(({ warnings }) => {
                        if (warnings.length) {
                            console.log("Warnings", warnings);
                        }     
                        console.log ("Init form")                     
                    })
                    .catch((err) => {
                        console.log("error", err);
                    });    
                    modelerSet(formEditorInstance);    
                    break;
                }    
                        
            }) 
            
            
        }) 
    }, []);
    
    if (schema == null) {
        return <>Loading...</>;
    }

    console.log(JSON.stringify(schema));

    const exportCallback = () => {
        const schemaNew = modeler.saveSchema(schema);
        console.log('exported schema:', JSON.stringify(schemaNew));
    }

    const saveCallback = () => {
        const schemaNew = modeler.saveSchema(schema);
        let stringifiedSchema = JSON.stringify(schemaNew);       
        stringifiedSchema = stringifiedSchema.replace ("\\","\\\\");
        const n_id = schemaNew.id;
        // save in neo4j:
        var query = "MATCH (n:Form) WHERE n.id = \"" + id + "\" SET n.Schema = '" + stringifiedSchema + "', n.id = '" + n_id + "'";
       
        // Form raussuchen:
        fetch("https://e78fcbf0.databases.neo4j.io/db/neo4j/query/v2", {
            method: "POST",
            headers: {
                "Authorization": "Basic bmVvNGo6am5fdG0xZzdqYUlRd0lrM1d4YS1Mdm9pQ3Z3LTRtYzNjbHFUTGpCcTFsQQ==",
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ statement: query })
        })

        
    }

    const deleteCallback = () => {
       
        // delete in neo4j:
        var query = "MATCH (n:Form) WHERE n.id = \"" + id + "\" DELETE n";
        
        // Form löschen:
        fetch("https://e78fcbf0.databases.neo4j.io/db/neo4j/query/v2", {
            method: "POST",
            headers: {
                "Authorization": "Basic bmVvNGo6am5fdG0xZzdqYUlRd0lrM1d4YS1Mdm9pQ3Z3LTRtYzNjbHFUTGpCcTFsQQ==",
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ statement: query })
        }).then (() =>  navigate('/design') );

        
    }
    return (        
        <Container>
            <Container>
                <Button style={{ width: "30%", marginTop: 5, marginBottom: 5 }} onClick={() => exportCallback()}> Export </Button>
                <Button style={{ width: "30%", marginLeft: 15, marginTop: 5, marginBottom: 5 }} onClick={() => saveCallback()}> Save </Button>
                <Button style={{ width: "30%", marginLeft: 15, marginTop: 5, marginBottom: 5 }} onClick={() => deleteCallback()}> Delete </Button>
            </Container>
           <div id="form" style={{
                        border: "1px solid #000000",
                        height: "100%",
                        width: "100%",
                        margin: "auto"
                    }}    
            >             
            </div>          
            
        </Container>
    );
}

export default FormModeller;
