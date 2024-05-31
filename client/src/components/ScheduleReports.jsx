// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { styled } from '@mui/material/styles';
// import Checkbox from '@mui/material/Checkbox';

// const Container = styled('div')({
//   padding: '20px',
// });

// const Heading = styled('h1')({
//   marginBottom: '20px',
// });

// const Note = styled('p')({
//   fontStyle: 'italic',
//   marginBottom: '20px',
// });

// const Dropdown = styled('select')({
//   padding: '10px',
//   marginBottom: '20px',
// });

// const ReportList = styled('ul')({
//   listStyleType: 'none',
//   padding: 0,
// });

// const ReportItem = styled('li')({
//   marginBottom: '10px',
// });

// const Button = styled('button')({
//   padding: '10px 20px',
//   backgroundColor: '#008080',
//   color: 'white',
//   border: 'none',
//   borderRadius: '5px',
//   cursor: 'pointer',
// });

// const ScheduleReports = () => {
//   const [organizations, setOrganizations] = useState([]);
//   const [selectedOrganization, setSelectedOrganization] = useState('');
//   const [reports, setReports] = useState([]);
//   const [selectedReports, setSelectedReports] = useState([]);

//   useEffect(() => {
//     // Fetch organizations
//     axios.get('http://localhost:3001/admin/getAllOrganizations')
//       .then(response => setOrganizations(response.data))
//       .catch(error => console.error('Error fetching organizations:', error));
//   }, []);

//   const handleOrganizationChange = async (e) => {
//     const orgId = e.target.value;
//     setSelectedOrganization(orgId);

//     // Fetch reports for the selected organization
//     try {
//       const response = await axios.post('http://localhost:3001/api/get-reports', { orgId });
//       setReports(response.data);
//     } catch (error) {
//       console.error('Error fetching reports:', error);
//     }
//   };

//   const handleReportChange = (e) => {
//     const reportId = e.target.value;
//     setSelectedReports(prev => prev.includes(reportId) ? prev.filter(id => id !== reportId) : [...prev, reportId]);
//   };

//   return (
//     <Container>
//       <Heading>Scheduling Reports</Heading>
//       <Note>The report/s will be sent to all the users of the organization on a daily basis at a set time.</Note>
//       <Dropdown onChange={handleOrganizationChange} value={selectedOrganization}>
//         <option value="">Select Organization</option>
//         {organizations.map(org => (
//           <option key={org._id} value={org._id}>{org.name}</option>
//         ))}
//       </Dropdown>

//       {reports.length > 0 && (
//         <ReportList>
//           {reports.map(report => (
//             <ReportItem key={report._id}>
//               <Checkbox
//                 checked={selectedReports.includes(report._id)}
//                 onChange={handleReportChange}
//                 value={report._id}
//               />
//               {report.name}
//             </ReportItem>
//           ))}
//         </ReportList>
//       )}

//       <Button disabled={selectedReports.length === 0}>Schedule Reports</Button>
//     </Container>
//   );
// };

// export default ScheduleReports;





import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';

const Container = styled('div')({
  padding: '20px',
});

const Heading = styled('h1')({
  marginBottom: '20px',
});

const Note = styled('p')({
  fontStyle: 'italic',
  marginBottom: '20px',
});

const Dropdown = styled('select')({
  padding: '10px',
  marginBottom: '20px',
});

const ReportList = styled('ul')({
  listStyleType: 'none',
  padding: 0,
});

const ReportItem = styled('li')({
  marginBottom: '10px',
});

const Button = styled('button')({
  padding: '10px 20px',
  backgroundColor: '#008080',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
});

const ScheduleReports = () => {
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [reports, setReports] = useState([]);
  const [selectedReports, setSelectedReports] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch organizations
    axios.get('http://localhost:3001/admin/getAllOrganizations')
      .then(response => setOrganizations(response.data))
      .catch(error => console.error('Error fetching organizations:', error));
  }, []);

  const handleOrganizationChange = async (e) => {
    const orgId = e.target.value;
    setSelectedOrganization(orgId);

    // Fetch reports for the selected organization
    try {
      const response = await axios.post('http://localhost:3001/api/get-reports', { orgId });
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const handleReportChange = (e) => {
    const reportId = e.target.value;
    setSelectedReports(prev => prev.includes(reportId) ? prev.filter(id => id !== reportId) : [...prev, reportId]);
  };

  const handleScheduleReports = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/schedule-reports', {
        orgId: selectedOrganization,
        reportIds: selectedReports,
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error scheduling reports:', error);
      setMessage('Failed to schedule reports.');
    }
  };

  return (
    <Container>
      <Heading>Scheduling Reports</Heading>
      <Note>The report/s will be sent to all the users of the organization on a daily basis at a set time.</Note>
      <Dropdown onChange={handleOrganizationChange} value={selectedOrganization}>
        <option value="">Select Organization</option>
        {organizations.map(org => (
          <option key={org._id} value={org._id}>{org.name}</option>
        ))}
      </Dropdown>

      {reports.length > 0 && (
        <ReportList>
          {reports.map(report => (
            <ReportItem key={report._id}>
              <Checkbox
                checked={selectedReports.includes(report._id)}
                onChange={handleReportChange}
                value={report._id}
              />
              {report.name}
            </ReportItem>
          ))}
        </ReportList>
      )}

      <Button onClick={handleScheduleReports} disabled={selectedReports.length === 0}>
        Schedule Reports
      </Button>
      {message && <p>{message}</p>}
    </Container>
  );
};

export default ScheduleReports;
