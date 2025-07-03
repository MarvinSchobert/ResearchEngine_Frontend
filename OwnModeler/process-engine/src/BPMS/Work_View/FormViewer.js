
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { Form, getSchemaVariables } from '@bpmn-io/form-js' 

import "@bpmn-io/form-js/dist/assets/form-js.css";
import "@bpmn-io/form-js/dist/assets/form-js-editor.css";

import axios from 'axios';
import { Button, Container, Row, Col, ButtonGroup } from 'reactstrap';
import CamundaBpmnModdle from 'camunda-bpmn-moddle/resources/camunda.json'

var minDash = require("min-dash")

const schema = { }   




function FormViewer( {formId, onDataChange, data}) {  
    const [viewer, viewerSet] = useState("");
    const [schemaObj, schemaObjSet] = useState(schema);
    const [dataObj, dataObjSet] = useState(data);
    useEffect(() => {               
        if (viewer) { return; }
        if (dataObj.length === 0) { 
            dataObjSet(data)
        }
        const formInstance = new Form ({
            container: document.querySelector('#form'),           
            moddleExtensions: {
                camunda: CamundaBpmnModdle
            }
        })        
        var query = "MATCH (n:Form) WHERE n.id = \""+ formId +"\" RETURN n.Schema"
        // Form raussuchen:
        fetch("https://e78fcbf0.databases.neo4j.io/db/neo4j/query/v2", {
            method: "POST",
            headers: {
                "Authorization": "Basic bmVvNGo6am5fdG0xZzdqYUlRd0lrM1d4YS1Mdm9pQ3Z3LTRtYzNjbHFUTGpCcTFsQQ==",
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ statement: query })
        }).then(response => response.json())
            .then (parsedValue => { 
                console.log (parsedValue);  
                let s_;               
                for (var i = 0; i < parsedValue.data.values.length; i++) {                    
                        
                    // s_ = JSON.stringify(parsedValue.data.values[i][0]);
                    s_ = JSON.parse (parsedValue.data.values[i][0])
                    console.log(s_)
                       
                    schemaObjSet(s_);
                    formInstance                    
                    .importSchema (s_, dataObj)
                    .then(({ warnings }) => {
                        if (warnings.length) {
                            console.log("Warnings", warnings);
                        }                  
                    })
                    .catch((err) => {
                        console.log("error", err);
                    });    
                    viewerSet(formInstance);   
                    formInstance.on('changed', 500, (event) => {
                        onDataChange (event);
                      }); 
                    break;
                }    
                        
            }) 
            
            
         
    }, []);
    
   
    function removeElementsByClass(className){
        const elements = document.getElementsByClassName(className);
        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
        }
    }

    removeElementsByClass ("fjs-powered-by fjs-form-field")


    return (
        <Container>
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

export default FormViewer;
