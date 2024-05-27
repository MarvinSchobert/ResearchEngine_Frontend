import React, { useEffect, useState } from 'react';
import './App.css';
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Route, Link, Routes } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DesignServicesRoundedIcon from '@mui/icons-material/DesignServicesRounded';
import AddTaskIcon from '@mui/icons-material/AddTask';
import Login from './Login';
import PropTypes from 'prop-types'


export default function App_Sidebar({ loggedIn, setToken }) {
    const LoginStateDependentView = () => {
        if (!loggedIn) {
            return (
                <Login setToken={setToken} />
            );
        } else {
            return (
                <div>
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
                </div>
            );
        }
    }


    return (
        <Sidebar className='app'>
            <Menu>
                <MenuItem
                    component={<Link to="/" className="link" />}
                    className="menu1"
                    icon={<HomeIcon />}
                >
                    Home
                </MenuItem>
                <LoginStateDependentView />
            </Menu>

        </Sidebar>
    );
}

App_Sidebar.propTypes = {
    setToken: PropTypes.func.isRequired
}