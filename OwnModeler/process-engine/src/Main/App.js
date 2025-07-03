import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import App_Navbar from './App_Navbar';
import App_Home from './App_Home';
import Processes_Dashboard from '../BPMS/Work_View/Processes_Dashboard';
import SingleProcess_Dashboard from '../BPMS/Work_View/SingleProcess_Dashboard';
import StartProcessInstance from '../BPMS/Work_View/StartProcessInstance';
import BpmnModeller from '../BPMS/Designer/BpmnModeller';
import FormModeller from '../BPMS/Designer/FormModeller';
import FormViewer from '../BPMS/Work_View/FormViewer';
import Design_Dashboard from '../BPMS/Designer/DesignDashboard';
import App_Dashboard from '../BPMS/Designer/AppDashboard';
import TasksDashboard from '../BPMS/Work_View/TasksDashboard';

import Login from './Login';
import useToken from './useToken';
import App_Sidebar from './App_Sidebar';


const App = () => {
  const { token, setToken } = useToken();  
  if (!token) {
    return (
      <div>
        <App_Navbar loggedIn={false}/>
        <div style={{ display: "flex", height: "100vh" }}>
        <App_Sidebar loggedIn={false} setToken={setToken}/>   
        <App_Home loggedIn={false}/>    
        </div>
      </div>
    );
  }
  return (
    <div>
      <App_Navbar loggedIn={true}/>
  
      <div style={{ display: "flex", height: "100vh" }}>
        <App_Sidebar loggedIn={true}/>
        <Routes>
          <Route path='/' exact element={<App_Home loggedIn={true}/>} />
          <Route path='/bpmnModeller' exact element={<BpmnModeller tenantId={token} />} />
          <Route path='/formModeller' exact element={<FormModeller />} />
          <Route path='/apps' exact element={<App_Dashboard tenantId={token}/>} />
          <Route path='/tasks' exact element={<TasksDashboard />} />
          <Route path='/bpmnModeller/:id' element={<BpmnModeller tenantId={token} />} />
          <Route path='/formModeller/:id' exact element={<FormModeller />} />
          <Route path='/formViewer/:id' exact element={<FormViewer />} />
          <Route path='/processes' exact element={<Processes_Dashboard />} />
          <Route path='/processes/:id' element={<Processes_Dashboard />} /> 
          <Route path='/startProcessInstance' exact element={<StartProcessInstance tenantId={token} />} />
        </Routes>
      </div>
    </div>
  );
}


export default App;
