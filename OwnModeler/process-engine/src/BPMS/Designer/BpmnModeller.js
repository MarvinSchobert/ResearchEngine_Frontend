import {
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule,
    CamundaPlatformPropertiesProviderModule
} from 'bpmn-js-properties-panel';
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Modeler from 'bpmn-js/lib/Modeler';
import axios from 'axios';
import { Button, Container, Row, Col, ButtonGroup } from 'reactstrap';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import '@bpmn-io/properties-panel/assets/properties-panel.css';
import CamundaBpmnModdle from 'camunda-bpmn-moddle/resources/camunda.json'
var minDash = require("min-dash")

function BpmnModeller() {
    const [diagram, diagramSet] = useState("");
    const [modeler, modelerSet] = useState("");
    const [diagramXML, diagramXMLSet] = useState("Hallo");
    const { id } = useParams();
    const container = document.getElementById("container");
    let processDefUrl = "";
    if (id != null && id != "123") {
        processDefUrl = `/flowable-ui/process-api/repository/process-definitions/${id}/resourcedata`;
    } else if (id == "123") {
        processDefUrl = "https://cdn.statically.io/gh/bpmn-io/bpmn-js-examples/dfceecba/url-viewer/resources/pizza-collaboration.bpmn"
    }
    else {
        diagramSet("");
    }

    useEffect(() => {
        if (modeler) return;
        if (processDefUrl != "" && diagram.length === 0) {
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
        }

        const modelerInstance = new Modeler({
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
            diagramXMLSet(diagram);

        }
    }, [diagram]);
    const exportCallback = () => {
        modeler.saveXML({ format: true }).then(xml => {
            diagramXMLSet(xml.xml);
            console.log(diagramXML)
            console.log("Downloading File")
            var filename = "diagram-xml";
            var pom = document.createElement('a');
            var bb = new Blob([diagramXML], { type: 'application/xml' });

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
            diagramXMLSet(xml.xml);

            console.log("Deploying to Engine!");



        });

        var bb = new Blob([diagramXML], { type: 'application/xml' });

        const fd = new FormData();
        fd.append("diagramFile.bpmn20.xml", bb);

        fetch("/flowable-ui/process-api/repository/deployments", {
            method: "POST",

            body: fd

        }).then((response) => {
            // history.push('/processes');		
            // history.push('/processes/' + id);
            // window.location.reload();
            console.log("response: " + response);
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
                            
                            <Button onClick={exportCallback}>Export XML</Button>
                        
                    </div>
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
