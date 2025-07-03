import {
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule,
    CamundaPlatformPropertiesProviderModule
} from 'bpmn-js-properties-panel';
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Modeler from 'bpmn-js/lib/Modeler';
import axios from 'axios';
import { Button, Container, Row, Col, ButtonGroup, Table } from 'reactstrap';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import '@bpmn-io/properties-panel/assets/properties-panel.css';
import CamundaBpmnModdle from 'camunda-bpmn-moddle/resources/camunda.json'
var minDash = require("min-dash")

function BpmnModeller({ tenantId }) {
    const [diagram, diagramSet] = useState("");
    const [modeler, modelerSet] = useState();
    const { id } = useParams();
    const container = document.getElementById("container");
    let processDefUrl = "";
    if (id != null) {
        processDefUrl = `/flowable-ui/process-api/repository/process-definitions/${id}/resourcedata`;
    } else {
       // processDefUrl = "https://cdn.statically.io/gh/bpmn-io/bpmn-js-examples/dfceecba/url-viewer/resources/pizza-collaboration.bpmn"       
    }
    
    useEffect(() => {
        if (processDefUrl != "") {
            console.log ("Diagram is to be overwritten. ProcessDefUrl is: " + processDefUrl)
            axios
                .get(
                    processDefUrl
                )
                .then((r) => {
                    diagramSet(r.data);
                })
                .catch((e) => {
                    console.log(e);
                });
        } else {
            diagramSet (`   
                <?xml version="1.0" encoding="UTF-8"?>
                <bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:zeebe="http://camunda.org/schema/zeebe/1.0" xmlns:modeler="http://camunda.org/schema/modeler/1.0" id="Definitions_0yubdha" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="5.18.0" modeler:executionPlatform="Camunda Cloud" modeler:executionPlatformVersion="8.3.0">
                <bpmn:process id="NewProcess" name="New Process" isExecutable="true" />
                <bpmndi:BPMNDiagram id="BPMNDiagram_1">
                    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="NewProcess" />
                </bpmndi:BPMNDiagram>
                </bpmn:definitions>
        `);
        }
    }, []);

    useEffect(() => {
        var modelerInstance;
        if (modeler) return;
        modelerInstance = new Modeler({
            container,
            keyboard: {
                bindTo: document
            },
            propertiesPanel: {
                parent: '#js-properties-panel'
            },
            additionalModules: [
                BpmnPropertiesPanelModule,
                BpmnPropertiesProviderModule,
                CamundaPlatformPropertiesProviderModule
            ],
            moddleExtensions: {
                camunda: CamundaBpmnModdle
            }
        });   
        if (diagram.length > 0) {
            console.log("Instantiate BPMN Diagram:")
            console.log (diagram);
            modelerInstance
                .importXML(diagram)
                .then(({ warnings }) => {
                    if (warnings.length) {
                        console.log("Warnings", warnings);
                    }
                    const canvas = modelerInstance.get("modeling");
                    modelerInstance.get("canvas").zoom('fit-viewport');
                    canvas.setColor("CalmCustomerTask", {
                        stroke: "green",
                        fill: "yellow"
                    });
                })
                .catch((err) => {
                    console.log("error", err);
                });
            modelerSet(modelerInstance);
        }        
    }, [diagram])
    const exportCallback = () => {
        modeler.saveXML({ format: true }).then(xml => {            
            console.log("Downloading File")
            var filename = "diagram-xml";
            var pom = document.createElement('a');
            var bb = new Blob([xml.xml], { type: 'application/xml' });
            pom.setAttribute('href', window.URL.createObjectURL(bb));
            pom.setAttribute('download', filename);
            pom.dataset.downloadurl = ['application/xml', pom.download, pom.href].join(':');
            pom.draggable = true;
            pom.classList.add('dragout');
            pom.click();
        });
    }
    const deployCallback = () => {
        modeler.saveXML({ format: true }).then(xml => { 
            console.log("Deploying to Engine!");
            var bb = new Blob([xml.xml], { type: 'application/xml' });
            const fd = new FormData();
            fd.append("diagramFile.bpmn20.xml", bb);    
            var url = "/flowable-ui/process-api/repository/deployments";
            if (tenantId) url = "/flowable-ui/process-api/repository/deployments?tenantId="+ tenantId;
            fetch(url, {
                method: "POST",    
                body: fd    
            }).then((response) => {
                // history.push('/processes');		
                // history.push('/processes/' + id);
                // window.location.reload();
                console.log("response: " + response);
            });
        });     
    }
    return (
        <Container>
            <Row style={{ height: "80%" }}>
                <Col
                    xs="8"
                    style={{
                        height: "100%",
                    }}
                ><div id="container"
                    style={{
                        border: "1px solid #000000",
                        height: "100%",
                        width: "100%",
                        margin: "auto"
                    }}>
                    </div></Col>
                <Col
                    xs="4"
                >
                    <div
                        class="m-2"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Button onClick={deployCallback}>Deploy Model</Button>    
                            <h2>|</h2>                        
                            <Button onClick={exportCallback}>Export XML</Button>                        
                    </div>
                    {/*}
                    <div>
                        Task overviews
                        <Table responsive striped>
                            <thead>
                                <tr>
                                    <th>
                                        Item
                                    </th>
                                    <th>
                                        Description
                                    </th>
                                    <th>
                                        Configuration
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>
                                        User Task
                                    </th>
                                    <th>
                                        A form based Task for the user with complete, save and cancel options.
                                    </th>
                                    <th>
                                        ...
                                    </th>
                                </tr>
                                <tr>
                                    <th>
                                        HTTP Task
                                    </th>
                                    <th>
                                        A task for API-Integration. Either GET (request data) or POST (send data)
                                    </th>
                                    <th>
                                        Service Task.
                                        Implementation: Java Class
                                        ClassName: org.faps.flowableEngine.HttpTask
                                        Field injections (Add with +):
                                        requestBody
                                        requestUrl
                                        requestMethod
                                        responseVariableName
                                    </th>
                                </tr>
                                <tr>
                                    <th>
                                        Collapsed Sub-Process
                                    </th>
                                    <th>
                                        Hide detailed logic in sub model and navigate between model hierachies
                                    </th>
                                    <th>
                                        Configure activity as a collapsed sub-process in modelling panel.
                                    </th>
                                </tr>

                            </tbody>
                            
                            
                        </Table>
                    </div>
                    {*/}
                    <div
                        id="js-properties-panel"
                        style={{
                            margin: "auto"
                        }}
                    >
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
export default BpmnModeller;