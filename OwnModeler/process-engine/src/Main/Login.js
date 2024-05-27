import React, { useState } from 'react';
import PropTypes from 'prop-types'
import { Container, Form, FormGroup, Input, Label, Button } from 'reactstrap';


function loginUser(credentials) {
    if (credentials.password == "password"){
        return {token: "123"}
    }
}


export default function Login({ setToken }) {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

    const handleSubmit =  e => {
        e.preventDefault();
        const token = loginUser({
          username,
          password
        });
        setToken(token);
      }


    return (
        <div>
        <Container fluid style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Form onSubmit={handleSubmit} style={{margin: '5px', border: '2px solid #d3d3d3', padding: '10px'}} >
                <FormGroup>
                    <Label for="userName">Username</Label>
                    <Input id="userName" name="userName" type="text" onChange={e => setUserName(e.target.value)}>                       
                    </Input>
                </FormGroup>
                <br/>
                <FormGroup>
                    <Label for="password">Password</Label>
                    <Input id="password" name="password" type="password" onChange={e => setPassword(e.target.value)}>                       
                    </Input>
                </FormGroup>
                <br/>
                <FormGroup>
                    <Button color="primary" type="submit">Login</Button>{' '}
                </FormGroup>                
            </Form>
        </Container>
        </div>
    );
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
}