import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, List, ListItem, ListItemIcon, ListItemText, Collapse, Snackbar,Paper } from "@mui/material";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useDispatch } from 'react-redux';
import { logout } from '../state/index';
import { styled } from '@mui/system';
//import { Link as RouterLink } from 'react-router-dom';
import AddNewAdminForm from './AddNewAdminForm';
import ModifyAdminForm from './ModifyAdminForm';
import DeleteAdminForm from './DeleteAdminForm';
import AddNewOrganizationForm from './AddNewOrgForm';
//import OrganizationList from './GetListOfOrgs';
import ForgotPass from './ForgotPass';
import MyProfile from './MyProfile';

import OrganizationList from './GetListOfOrgs';

import ModifyOrganizationForm from './ModifyOrgForm';
import AddNewCustomerForm from './AddNewCustomerForm';
import AdminList from './TableDisplayAdmins';


import CreateAndAssignReport from './CreateAndAssignReport';

import ReportTable from './ReportTable';
import axios from 'axios';
import { useSelector } from 'react-redux';
import MuiAlert from '@mui/material/Alert';


// Import your logo image
import logo from './hbl3.png';


const AdminHome = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [reports, setReports] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [currentReportName, setCurrentReportName] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); // Get user from Redux store


  // const dispatch = useDispatch();
  const [openSubMenu1, setOpenSubMenu1] = React.useState(false);
  const [openSubMenu2, setOpenSubMenu2] = React.useState(false);
  const [openSubMenu3, setOpenSubMenu3] = React.useState(false);
  const [openSubMenu4, setOpenSubMenu4] = React.useState(false);
  const [openSubMenu5, setOpenSubMenu5] = React.useState(false);
  const [openSubMenu6, setOpenSubMenu6] = React.useState(false);
 


  const CustomAppBar = styled(AppBar)({
    backgroundColor: '#009688', // Change background color to green
  });

  const handleSubMenu1Click = () => {
    setOpenSubMenu1(!openSubMenu1);
  };

  const handleSubMenu2Click = () => {
    setOpenSubMenu2(!openSubMenu2);
  };

  const handleSubMenu3Click = () => {
    setOpenSubMenu3(!openSubMenu3);
  };

  const handleSubMenu4Click = () => {
    setOpenSubMenu4(!openSubMenu4);
  };

  const handleSubMenu5Click = () => {
    setOpenSubMenu5(!openSubMenu5);
  };

  const handleSubMenu6Click = () => {
    setOpenSubMenu6(!openSubMenu6);
  };

  const handleLogout = () => {
    // Handle logout logic here
    dispatch(logout());
    //navigate('/'); // Redirect to login page after logout
  };


  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setReportData(null); // Clear report data when changing options
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };


  const fetchReports = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/organization-reports', {
        organizationId: user.organization
      });
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setSnackbarMessage('Error fetching reports. Please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const fetchReportData = async (report) => {
    try {
      const response = await axios.post('http://localhost:3001/api/execute-report', {
        query: report.query
      });
      setReportData(response.data.data);
      setCurrentReportName(report.name);
      setSelectedOption('report');
    } catch (error) {
      console.error('Error fetching report data:', error);
      setSnackbarMessage('Error fetching report data. Please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [user.organization]);

  return (
    <div>
      <CustomAppBar position="fixed">
        <Toolbar>
          {/* Include your logo image here */}
          <img src={logo} alt="Logo" style={{ marginRight: '100px', height: '35px', width: 'auto' }} />
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          {user && (
            <Typography variant="body1" component="div" sx={{ marginRight: '20px' }}>
              {user.email}
            </Typography>
          )}
          <Button color="inherit" onClick={handleLogout}>
            <ExitToAppIcon />
            Logout
          </Button>
        </Toolbar>
      </CustomAppBar>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '240px', backgroundColor: '#f0f0f0', borderRight: '1px solid #ccc', position: 'fixed', top: '64px', bottom: '0', overflowY: 'auto' }}>
          <List>
            {/* List items for the sidebar */}
            <ListItem button onClick={handleSubMenu1Click}>
              <ListItemIcon>
                {openSubMenu1 ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
              </ListItemIcon>
              <ListItemText primary="Admin Management" />
            </ListItem>
            <Collapse in={openSubMenu1} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {/* <ListItem button onClick={handleAddNewAdminClick} sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="Add New Admin" />
                </ListItem> */}
                <ListItem button onClick={() => handleOptionClick('addNewAdmin')} sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="Add New Admin" />
                </ListItem>
                {/* <ListItem button onClick={handleModifyAdminClick} sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="Modify Existent Admin" />
                </ListItem> */}
                <ListItem button onClick={() => handleOptionClick('modifyExistingAdmin')} sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="Modify Existent Admin" />
                </ListItem>
                <ListItem button onClick={() => handleOptionClick('deleteAdmin')} sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="Delete Admin" />
                </ListItem>
                <ListItem button onClick={() => handleOptionClick('adminsTable')} sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="List of Admins" />
                </ListItem>
              </List>
            </Collapse>
            <ListItem button onClick={handleSubMenu2Click}>
              <ListItemIcon>
                {openSubMenu2 ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
              </ListItemIcon>
              <ListItemText primary="User Management" />
            </ListItem>
            <Collapse in={openSubMenu2} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button onClick={() => handleOptionClick('addNewCustomer')} sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="Add New Customer" />
                </ListItem>
                <ListItem button onClick={() => handleOptionClick('modifyExistingCustomer')} sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="Modify Existent Customer" />
                </ListItem>
                <ListItem button onClick={() => handleOptionClick('deleteAdmin')} sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="Delete Customer" />
                </ListItem>
              </List>
            </Collapse>
            <ListItem button onClick={handleSubMenu3Click}>
              <ListItemIcon>
                {openSubMenu3 ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
              </ListItemIcon>
              <ListItemText primary="MIS Reports" />
            </ListItem>
            <Collapse in={openSubMenu3} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {reports.map((report, index) => (
                    <ListItem button key={index} sx={{ pl: 4 }} onClick={() => fetchReportData(report)}>
                      <ListItemIcon>
                        <ArrowRightIcon />
                      </ListItemIcon>
                      <ListItemText primary={report.name} />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            <ListItem button onClick={handleSubMenu4Click}>
              <ListItemIcon>
                {openSubMenu4 ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
              </ListItemIcon>
              <ListItemText primary="Profile Management" />
            </ListItem>
            <Collapse in={openSubMenu4} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button onClick={() => handleOptionClick('forgotPass')} sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="Change Password" />
                </ListItem>
                <ListItem button onClick={() => handleOptionClick('myProfile')} sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="My Profile" />
                </ListItem>
              </List>
            </Collapse>
            <ListItem button onClick={handleSubMenu5Click}>
              <ListItemIcon>
                {openSubMenu5 ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
              </ListItemIcon>
              <ListItemText primary="Organization Management" />
            </ListItem>
            <Collapse in={openSubMenu5} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button onClick={() => handleOptionClick('getAllOrgs')} sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="List of Organizations" />
                </ListItem>
                <ListItem button onClick={() => handleOptionClick('addOrg')} sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="Add Organization" />
                </ListItem>
                <ListItem button onClick={() => handleOptionClick('modifyOrg')} sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="Modify Organization" />
                </ListItem>
              </List>
            </Collapse>
            <ListItem button onClick={handleSubMenu6Click}>
              <ListItemIcon>
                {openSubMenu6 ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
              </ListItemIcon>
              <ListItemText primary="Report Management" />
            </ListItem>
            <Collapse in={openSubMenu6} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button onClick={() => handleOptionClick('create&assignReport')} sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <ArrowRightIcon />
                  </ListItemIcon>
                  <ListItemText primary="Create & Assign a Report" />
                </ListItem>
                
              </List>
            </Collapse>
          </List>
        </div>

        <Paper elevation={3} style={{ padding: '20px', margin: '80px 20px 20px 260px', width: 'calc(100% - 280px)' }}>
          {selectedOption === 'forgotPass' && <ForgotPass />}
          {selectedOption === 'myProfile' && <MyProfile />}
          {selectedOption === 'report' && reportData && <ReportTable data={reportData} reportName={currentReportName} />}
          
          {selectedOption === 'create&assignReport' && <CreateAndAssignReport />}
          {selectedOption === 'addNewAdmin' && <AddNewAdminForm />}
          {selectedOption === 'modifyExistingAdmin' && <ModifyAdminForm />}
          {selectedOption === 'deleteAdmin' && <DeleteAdminForm />}
          {selectedOption === 'addOrg' && <AddNewOrganizationForm />}
          {selectedOption === 'getAllOrgs' && <OrganizationList/>}
          {selectedOption === 'modifyOrg' && <ModifyOrganizationForm />}
          {selectedOption === 'addNewCustomer' && <AddNewCustomerForm />}
          {selectedOption === 'modifyExistingCustomer' && <ModifyAdminForm />}
          {selectedOption === 'adminsTable' && <AdminList />}
          {/* {selectedOption === '' && <AdminList />} */}

        </Paper>
      </div>
      {/* <div style={{ padding: '80px', marginLeft: '220px' }}>       
        {selectedOption === 'create&assignReport' && <CreateAndAssignReport />}
      </div> */}

      {/* <div style={{ padding: '', margin: '5px'}}>

        
        {selectedOption === 'addNewAdmin' && <AddNewAdminForm />}
        {selectedOption === 'modifyExistingAdmin' && <ModifyAdminForm />}
        {selectedOption === 'deleteAdmin' && <DeleteAdminForm />}
        {selectedOption === 'addOrg' && <AddNewOrganizationForm />}
        {selectedOption === 'getAllOrgs' && <OrganizationList/>}
        {selectedOption === 'modifyOrg' && <ModifyOrganizationForm />}
        {selectedOption === 'addNewCustomer' && <AddNewCustomerForm />}
        {selectedOption === 'modifyExistingCustomer' && <ModifyAdminForm />}
        {selectedOption === 'adminsTable' && <AdminList />}
      </div> */}


      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <MuiAlert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default AdminHome;