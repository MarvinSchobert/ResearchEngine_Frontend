import React, {Component} from 'react';
import {Navbar, NavbarBrand, Container, Button} from 'reactstrap';
import {Link} from 'react-router-dom';


export default function App_Navbar ({loggedIn}) {
  const logOut =  e => {
    e.preventDefault();
    sessionStorage.removeItem('token');
    window.location.reload();
  }
    
  const LoggedInStateDependentView = () => {
      if (loggedIn){
        return (
          <div className="position-absolute end-0" style={{ marginRight : 10}}>
            <Button tag={Link} onClick={logOut} style = {{ marginLeft : 10}}>Logout</Button>
          </div>
        );
      }
      else {
        return      

      }
    }
    

    return (
        <Navbar color="dark" dark expand="md"> 
        <img
                alt="logo"
                src="https://www.faps.fau.de/wp-content/uploads/2022/08/FAPS-Logo_RGB.jpg"
                style={{
                  height: 40,
                  width: 40,
                  marginLeft : 10,
                  marginRight : 20
                }}
            />
            <img
                alt="logo"
                src="https://assets-global.website-files.com/6420757f37bbdb8646aac617/642e8a35a99b2bd422ee80e3_Process%20academy%20Logo%20(500%20%C3%97%20357%20px).png"
                style={{
                  height: 40,
                  width: 40,
                  marginLeft : 10,
                  marginRight : 20
                }}
            />
            <NavbarBrand tag={Link} to="/" style = {{ marginLeft : 10 }}>Home</NavbarBrand>
            <LoggedInStateDependentView/>
            
        </Navbar>
    );
}