import React, { useEffect, useState } from 'react';
import './App.css';
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Route, Link, Routes } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DesignServicesRoundedIcon from '@mui/icons-material/DesignServicesRounded';
import AddTaskIcon from '@mui/icons-material/AddTask';
import App_Navbar from './App_Navbar';
import App_Home from './App_Home';
import Processes_Dashboard from '../BPMS/Work_View/Processes_Dashboard';
import SingleProcess_Dashboard from '../BPMS/Work_View/SingleProcess_Dashboard';
import StartProcessInstance from '../BPMS/Work_View/StartProcessInstance';
import BpmnModeller from '../BPMS/Designer/BpmnModeller';
import Design_Dashboard from '../BPMS/Designer/DesignDashboard';
import TasksDashboard from '../BPMS/Work_View/TasksDashboard';





const App = () => {
 
 
 
  return (
    <div>  
      <App_Navbar />
      <div style={{ display: "flex", height: "100vh" }}>
        <Sidebar className='app'>
          <Menu>
            <MenuItem
              component={<Link to="/" className="link" />}
              className="menu1"
              icon={<HomeIcon />}
            >
              Home
            </MenuItem>
            <MenuItem
              component={<Link to="/processes" className="link" />}
              icon={<AssignmentIcon />}
            >
              Process Instances
            </MenuItem>
            <MenuItem
              component={<Link to="/tasks" className="link" />}
              icon={<AddTaskIcon />}
            >
              Tasks
            </MenuItem>
            <MenuItem
              component={<Link to="/design" className="link" />}
              icon={<DesignServicesRoundedIcon />}
            >
              Designer
            </MenuItem>            
          </Menu>
        </Sidebar>
        <Routes>
          <Route path='/' exact element={<App_Home />} />
          <Route path='/modeller' exact element={<BpmnModeller/>} />
          <Route path='/design' exact element={<Design_Dashboard/>} />
          <Route path='/tasks' exact element={<TasksDashboard/>} />
          <Route path='/modeller/:id' element={<BpmnModeller/>} />
          <Route path='/processes' exact element={<Processes_Dashboard/>} />
          <Route path='/processes/:id' element={<SingleProcess_Dashboard/>}/>
          <Route path='/startProcessInstance' exact element={<StartProcessInstance/>}/>
        </Routes>
      </div>
    </div>
  );
}


export default App;
