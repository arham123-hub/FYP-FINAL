// import React, { useState } from 'react';
// import * as XLSX from 'xlsx';
// import axios from 'axios';
// import { styled } from '@mui/material/styles';

// const Container = styled('div')({
//   overflowY: 'auto',
//   maxHeight: '500px',
// });

// const ActionContainer = styled('div')(({ theme }) => ({
//   display: 'flex',
//   justifyContent: 'space-between',
//   alignItems: 'center',
//   marginBottom: theme.spacing(2),
// }));

// const Button = styled('button')(({ theme }) => ({
//   backgroundColor: '#008080',
//   color: 'white',
//   padding: theme.spacing(1, 2),
//   fontSize: '16px',
//   border: 'none',
//   borderRadius: '5px',
//   cursor: 'pointer',
// }));

// const Dropdown = styled('select')(({ theme }) => ({
//   padding: theme.spacing(1),
//   width: '200px',
//   marginRight: theme.spacing(1),
// }));

// const Table = styled('table')({
//   width: '100%',
//   borderCollapse: 'collapse',
// });

// const TableHeader = styled('th')(({ theme }) => ({
//   backgroundColor: '#008080',
//   color: 'white',
//   fontWeight: 'bold',
//   fontSize: '16px',
//   textAlign: 'left',
//   padding: theme.spacing(1),
//   border: '1px solid #ddd',
// }));

// const TableCell = styled('td')(({ theme }) => ({
//   padding: theme.spacing(1),
//   border: '1px solid #ddd',
//   textAlign: 'left',
// }));

// const SuccessMessage = styled('div')(({ theme }) => ({
//   color: 'green',
//   margin: theme.spacing(1, 0),
// }));

// const PaginationContainer = styled('div')({
//   display: 'flex',
//   justifyContent: 'center',
//   margin: '20px 0',
// });

// const PageButton = styled('button')(({ theme }) => ({
//   backgroundColor: '#008080',
//   color: 'white',
//   padding: theme.spacing(1, 2),
//   fontSize: '16px',
//   border: 'none',
//   borderRadius: '5px',
//   cursor: 'pointer',
//   margin: '0 5px',
// }));

// const Input = styled('input')(({ theme }) => ({
//   padding: theme.spacing(1),
//   width: '300px',
//   marginRight: theme.spacing(1),
// }));

// const CheckboxContainer = styled('div')(({ theme }) => ({
//   margin: theme.spacing(1, 0),
// }));

// const ReportTable = ({ data, reportName }) => {
//   const [successMessage, setSuccessMessage] = useState('');
//   const [isSending, setIsSending] = useState(false);
//   const [selectedFormat, setSelectedFormat] = useState('xlsx');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [email, setEmail] = useState('');
//   const [selectedColumns, setSelectedColumns] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);
//   const recordsPerPage = 20;

//   const columns = Object.keys(data[0]);

//   const handleSelectAll = () => {
//     if (selectAll) {
//       setSelectedColumns([]);
//     } else {
//       setSelectedColumns(columns);
//     }
//     setSelectAll(!selectAll);
//   };

//   const sendEmail = async () => {
//     setIsSending(true);
//     try {
//       const filteredData = data.map(row => {
//         const filteredRow = {};
//         selectedColumns.forEach(col => {
//           filteredRow[col] = row[col];
//         });
//         return filteredRow;
//       });

//       const ws = XLSX.utils.json_to_sheet(filteredData);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, 'Report');
//       const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
//       const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
//       const formData = new FormData();
//       formData.append('file', file, 'report.xlsx');
//       formData.append('email', email);

//       await axios.post('http://localhost:3001/api/send-report', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       setSuccessMessage('Report has been sent successfully!');
//       setTimeout(() => setSuccessMessage(''), 3000); // Clear message after 3 seconds
//     } catch (error) {
//       console.error('Failed to send report:', error);
//     }
//     setIsSending(false);
//   };

//   const handleDownload = () => {
//     const filteredData = data.map(row => {
//       const filteredRow = {};
//       selectedColumns.forEach(col => {
//         filteredRow[col] = row[col];
//       });
//       return filteredRow;
//     });

//     const ws = XLSX.utils.json_to_sheet(filteredData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Report');
//     switch (selectedFormat) {
//       case 'xlsx':
//         XLSX.writeFile(wb, 'report.xlsx');
//         break;
//       case 'csv':
//         XLSX.writeFile(wb, 'report.csv', { bookType: 'csv' });
//         break;
//       default:
//         break;
//     }
//   };

//   const handleColumnSelection = (column) => {
//     setSelectedColumns(prevSelectedColumns =>
//       prevSelectedColumns.includes(column)
//         ? prevSelectedColumns.filter(col => col !== column)
//         : [...prevSelectedColumns, column]
//     );
//   };

//   if (!data || data.length === 0) {
//     return <div>No data available.</div>;
//   }

//   // Pagination logic
//   const indexOfLastRecord = currentPage * recordsPerPage;
//   const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
//   const currentRecords = data.slice(indexOfFirstRecord, indexOfLastRecord);
//   const totalPages = Math.ceil(data.length / recordsPerPage);

//   const handleClick = (event) => {
//     setCurrentPage(Number(event.target.id));
//   };

//   const renderPageNumbers = [];
//   for (let i = 1; i <= totalPages; i++) {
//     renderPageNumbers.push(
//       <PageButton key={i} id={i} onClick={handleClick}>
//         {i}
//       </PageButton>
//     );
//   }

//   return (
//     <Container>
//       <h1>{reportName}</h1>
//       <CheckboxContainer>
//         <label>
//           <input
//             type="checkbox"
//             checked={selectAll}
//             onChange={handleSelectAll}
//           />
//           Select All
//         </label>
//         {columns.map((col, index) => (
//           <label key={index}>
//             <input
//               type="checkbox"
//               value={col}
//               checked={selectedColumns.includes(col)}
//               onChange={() => handleColumnSelection(col)}
//             />
//             {col}
//           </label>
//         ))}
//       </CheckboxContainer>
//       <ActionContainer>
//         <div>
//           <Dropdown value={selectedFormat} onChange={(e) => setSelectedFormat(e.target.value)}>
//             <option value="xlsx">Excel (.xlsx)</option>
//             <option value="csv">CSV (.csv)</option>
//           </Dropdown>
//           <Button onClick={handleDownload} disabled={selectedColumns.length === 0}>Download Report</Button>
//         </div>
//         <div>
//           <Input
//             type="email"
//             placeholder="Enter email address"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <Button onClick={sendEmail} disabled={isSending || !email || selectedColumns.length === 0}>
//             {isSending ? 'Sending...' : 'Send Report'}
//           </Button>
//         </div>
//       </ActionContainer>
//       {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
//       <Table>
//         <thead>
//           <tr>
//             {columns.map((col, index) => (
//               <TableHeader key={index}>
//                 {col}
//               </TableHeader>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {currentRecords.map((row, rowIndex) => (
//             <tr key={rowIndex}>
//               {columns.map((col, colIndex) => (
//                 <TableCell key={colIndex}>
//                   {row[col]}
//                 </TableCell>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//       <PaginationContainer>{renderPageNumbers}</PaginationContainer>
//     </Container>
//   );
// };

// export default ReportTable;






























// import React, { useState } from 'react';
// import * as XLSX from 'xlsx';
// import axios from 'axios';
// import { styled } from '@mui/material/styles';
// import TextField from '@mui/material/TextField';
// import Autocomplete from '@mui/material/Autocomplete';

// const Container = styled('div')({
//   overflowY: 'auto',
//   maxHeight: '500px',
// });

// const ActionContainer = styled('div')(({ theme }) => ({
//   display: 'flex',
//   justifyContent: 'space-between',
//   alignItems: 'center',
//   marginBottom: theme.spacing(2),
// }));

// const Button = styled('button')(({ theme }) => ({
//   backgroundColor: '#008080',
//   color: 'white',
//   padding: theme.spacing(1, 2),
//   fontSize: '16px',
//   border: 'none',
//   borderRadius: '5px',
//   cursor: 'pointer',
// }));

// const Dropdown = styled('select')(({ theme }) => ({
//   padding: theme.spacing(1),
//   width: '200px',
//   marginRight: theme.spacing(1),
// }));

// const Table = styled('table')({
//   width: '100%',
//   borderCollapse: 'collapse',
// });

// const TableHeader = styled('th')(({ theme }) => ({
//   backgroundColor: '#008080',
//   color: 'white',
//   fontWeight: 'bold',
//   fontSize: '16px',
//   textAlign: 'left',
//   padding: theme.spacing(1),
//   border: '1px solid #ddd',
// }));

// const TableCell = styled('td')(({ theme }) => ({
//   padding: theme.spacing(1),
//   border: '1px solid #ddd',
//   textAlign: 'left',
// }));

// const SuccessMessage = styled('div')(({ theme }) => ({
//   color: 'green',
//   margin: theme.spacing(1, 0),
// }));

// const PaginationContainer = styled('div')({
//   display: 'flex',
//   justifyContent: 'center',
//   margin: '20px 0',
// });

// const PageButton = styled('button')(({ theme }) => ({
//   backgroundColor: '#008080',
//   color: 'white',
//   padding: theme.spacing(1, 2),
//   fontSize: '16px',
//   border: 'none',
//   borderRadius: '5px',
//   cursor: 'pointer',
//   margin: '0 5px',
// }));

// const Input = styled('input')(({ theme }) => ({
//   padding: theme.spacing(1),
//   width: '300px',
//   marginRight: theme.spacing(1),
// }));

// const ReportTable = ({ data, reportName }) => {
//   const [successMessage, setSuccessMessage] = useState('');
//   const [isSending, setIsSending] = useState(false);
//   const [selectedFormat, setSelectedFormat] = useState('xlsx');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [email, setEmail] = useState('');
//   const [selectedColumns, setSelectedColumns] = useState([]);
//   const recordsPerPage = 20;

//   const columns = Object.keys(data[0]);

//   const sendEmail = async () => {
//     setIsSending(true);
//     try {
//       const filteredData = data.map(row => {
//         const filteredRow = {};
//         selectedColumns.forEach(col => {
//           filteredRow[col] = row[col];
//         });
//         return filteredRow;
//       });

//       const ws = XLSX.utils.json_to_sheet(filteredData);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, 'Report');
//       const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
//       const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
//       const formData = new FormData();
//       formData.append('file', file, 'report.xlsx');
//       formData.append('email', email);

//       await axios.post('http://localhost:3001/api/send-report', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       setSuccessMessage('Report has been sent successfully!');
//       setTimeout(() => setSuccessMessage(''), 3000); // Clear message after 3 seconds
//     } catch (error) {
//       console.error('Failed to send report:', error);
//     }
//     setIsSending(false);
//   };

//   const handleDownload = () => {
//     const filteredData = data.map(row => {
//       const filteredRow = {};
//       selectedColumns.forEach(col => {
//         filteredRow[col] = row[col];
//       });
//       return filteredRow;
//     });

//     const ws = XLSX.utils.json_to_sheet(filteredData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Report');
//     switch (selectedFormat) {
//       case 'xlsx':
//         XLSX.writeFile(wb, 'report.xlsx');
//         break;
//       case 'csv':
//         XLSX.writeFile(wb, 'report.csv', { bookType: 'csv' });
//         break;
//       default:
//         break;
//     }
//   };

//   const handleColumnSelection = (event, newValue) => {
//     setSelectedColumns(newValue);
//   };

//   if (!data || data.length === 0) {
//     return <div>No data available.</div>;
//   }

//   // Pagination logic
//   const indexOfLastRecord = currentPage * recordsPerPage;
//   const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
//   const currentRecords = data.slice(indexOfFirstRecord, indexOfLastRecord);
//   const totalPages = Math.ceil(data.length / recordsPerPage);

//   const handleClick = (event) => {
//     setCurrentPage(Number(event.target.id));
//   };

//   const renderPageNumbers = [];
//   for (let i = 1; i <= totalPages; i++) {
//     renderPageNumbers.push(
//       <PageButton key={i} id={i} onClick={handleClick}>
//         {i}
//       </PageButton>
//     );
//   }

//   return (
//     <Container>
//       <h1>{reportName}</h1>
      
//         <Autocomplete
//           multiple
//           options={columns}
//           getOptionLabel={(option) => option}
//           value={selectedColumns}
//           onChange={handleColumnSelection}
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               variant="outlined"
//               label="Select Columns"
//               placeholder="Columns"
//             />
//           )}
//         />
      
//       <ActionContainer>
//         <div>
//           <Dropdown value={selectedFormat} onChange={(e) => setSelectedFormat(e.target.value)}>
//             <option value="xlsx">Excel (.xlsx)</option>
//             <option value="csv">CSV (.csv)</option>
//           </Dropdown>
//           <Button onClick={handleDownload} disabled={selectedColumns.length === 0}>Download Report</Button>
//         </div>
//         <div>
//           <Input
//             type="email"
//             placeholder="Enter email address"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <Button onClick={sendEmail} disabled={isSending || !email || selectedColumns.length === 0}>
//             {isSending ? 'Sending...' : 'Send Report'}
//           </Button>
//         </div>
//       </ActionContainer>
//       {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
//       <Table>
//         <thead>
//           <tr>
//             {columns.map((col, index) => (
//               <TableHeader key={index}>
//                 {col}
//               </TableHeader>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {currentRecords.map((row, rowIndex) => (
//             <tr key={rowIndex}>
//               {columns.map((col, colIndex) => (
//                 <TableCell key={colIndex}>
//                   {row[col]}
//                 </TableCell>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//       <PaginationContainer>{renderPageNumbers}</PaginationContainer>
//     </Container>
//   );
// };

// export default ReportTable;
























// import React, { useState } from 'react';
// import * as XLSX from 'xlsx';
// import axios from 'axios';
// import { styled } from '@mui/material/styles';
// import TextField from '@mui/material/TextField';
// import Autocomplete from '@mui/material/Autocomplete';

// const Container = styled('div')({
//   overflowY: 'auto',
//   maxHeight: '500px',
// });

// const ActionContainer = styled('div')(({ theme }) => ({
//   display: 'flex',
//   justifyContent: 'space-between',
//   alignItems: 'center',
//   marginBottom: theme.spacing(2),
//   marginTop: theme.spacing(2), // Add some space at the top
// }));

// const Button = styled('button')(({ theme }) => ({
//   backgroundColor: '#008080',
//   color: 'white',
//   padding: theme.spacing(1, 2),
//   fontSize: '16px',
//   border: 'none',
//   borderRadius: '5px',
//   cursor: 'pointer',
// }));

// const Dropdown = styled('select')(({ theme }) => ({
//   padding: theme.spacing(1),
//   width: '200px',
//   marginRight: theme.spacing(1),
// }));

// const Table = styled('table')({
//   width: '100%',
//   borderCollapse: 'collapse',
// });

// const TableHeader = styled('th')(({ theme }) => ({
//   backgroundColor: '#008080',
//   color: 'white',
//   fontWeight: 'bold',
//   fontSize: '16px',
//   textAlign: 'left',
//   padding: theme.spacing(1),
//   border: '1px solid #ddd',
// }));

// const TableCell = styled('td')(({ theme }) => ({
//   padding: theme.spacing(1),
//   border: '1px solid #ddd',
//   textAlign: 'left',
// }));

// const SuccessMessage = styled('div')(({ theme }) => ({
//   color: 'green',
//   margin: theme.spacing(1, 0),
// }));

// const PaginationContainer = styled('div')({
//   display: 'flex',
//   justifyContent: 'center',
//   margin: '20px 0',
// });

// const PageButton = styled('button')(({ theme }) => ({
//   backgroundColor: '#008080',
//   color: 'white',
//   padding: theme.spacing(1, 2),
//   fontSize: '16px',
//   border: 'none',
//   borderRadius: '5px',
//   cursor: 'pointer',
//   margin: '0 5px',
// }));

// const Input = styled('input')(({ theme }) => ({
//   padding: theme.spacing(1),
//   width: '300px',
//   marginRight: theme.spacing(1),
// }));

// const ReportTable = ({ data, reportName }) => {
//   const [successMessage, setSuccessMessage] = useState('');
//   const [isSending, setIsSending] = useState(false);
//   const [selectedFormat, setSelectedFormat] = useState('xlsx');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [email, setEmail] = useState('');
//   const [selectedColumns, setSelectedColumns] = useState([]);
//   const recordsPerPage = 20;

//   const columns = Object.keys(data[0]);

//   const sendEmail = async () => {
//     setIsSending(true);
//     try {
//       const filteredData = data.map(row => {
//         const filteredRow = {};
//         selectedColumns.forEach(col => {
//           filteredRow[col] = row[col];
//         });
//         return filteredRow;
//       });

//       const ws = XLSX.utils.json_to_sheet(filteredData);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, 'Report');
//       const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
//       const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
//       const formData = new FormData();
//       formData.append('file', file, 'report.xlsx');
//       formData.append('email', email);

//       await axios.post('http://localhost:3001/api/send-report', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       setSuccessMessage('Report has been sent successfully!');
//       setTimeout(() => setSuccessMessage(''), 3000); // Clear message after 3 seconds
//     } catch (error) {
//       console.error('Failed to send report:', error);
//     }
//     setIsSending(false);
//   };

//   const handleDownload = () => {
//     const filteredData = data.map(row => {
//       const filteredRow = {};
//       selectedColumns.forEach(col => {
//         filteredRow[col] = row[col];
//       });
//       return filteredRow;
//     });

//     const ws = XLSX.utils.json_to_sheet(filteredData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Report');
//     switch (selectedFormat) {
//       case 'xlsx':
//         XLSX.writeFile(wb, 'report.xlsx');
//         break;
//       case 'csv':
//         XLSX.writeFile(wb, 'report.csv', { bookType: 'csv' });
//         break;
//       default:
//         break;
//     }
//   };

//   const handleColumnSelection = (event, newValue) => {
//     setSelectedColumns(newValue);
//   };

//   if (!data || data.length === 0) {
//     return <div>No data available.</div>;
//   }

//   // Pagination logic
//   const indexOfLastRecord = currentPage * recordsPerPage;
//   const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
//   const currentRecords = data.slice(indexOfFirstRecord, indexOfLastRecord);
//   const totalPages = Math.ceil(data.length / recordsPerPage);

//   const handleClick = (event) => {
//     setCurrentPage(Number(event.target.id));
//   };

//   const renderPageNumbers = [];
//   for (let i = 1; i <= totalPages; i++) {
//     renderPageNumbers.push(
//       <PageButton key={i} id={i} onClick={handleClick}>
//         {i}
//       </PageButton>
//     );
//   }

//   return (
//     <Container>
//       <h1>{reportName}</h1>
//       <Autocomplete
//         multiple
//         options={columns}
//         getOptionLabel={(option) => option}
//         value={selectedColumns}
//         onChange={handleColumnSelection}
//         renderInput={(params) => (
//           <TextField
//             {...params}
//             variant="outlined"
//             label="Select Columns"
//             placeholder="Columns"
//             style={{ marginBottom: '16px' }} // Add margin bottom
//           />
//         )}
//       />
//       <ActionContainer>
//         <div>
//           <Dropdown value={selectedFormat} onChange={(e) => setSelectedFormat(e.target.value)}>
//             <option value="xlsx">Excel (.xlsx)</option>
//             <option value="csv">CSV (.csv)</option>
//           </Dropdown>
//           <Button onClick={handleDownload} disabled={selectedColumns.length === 0}>Download Report</Button>
//         </div>
//         <div>
//           <Input
//             type="email"
//             placeholder="Enter email address"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <Button onClick={sendEmail} disabled={isSending || !email || selectedColumns.length === 0}>
//             {isSending ? 'Sending...' : 'Send Report'}
//           </Button>
//         </div>
//       </ActionContainer>
//       {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
//       <Table>
//         <thead>
//           <tr>
//             {columns.map((col, index) => (
//               <TableHeader key={index}>
//                 {col}
//               </TableHeader>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {currentRecords.map((row, rowIndex) => (
//             <tr key={rowIndex}>
//               {columns.map((col, colIndex) => (
//                 <TableCell key={colIndex}>
//                   {row[col]}
//                 </TableCell>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//       <PaginationContainer>{renderPageNumbers}</PaginationContainer>
//     </Container>
//   );
// };

// export default ReportTable;




























// import React, { useState, useEffect } from 'react';
// import * as XLSX from 'xlsx';
// import axios from 'axios';
// import { styled } from '@mui/material/styles';
// import TextField from '@mui/material/TextField';
// import Autocomplete from '@mui/material/Autocomplete';
// import Checkbox from '@mui/material/Checkbox';
// import { FormControlLabel } from '@mui/material';

// const Container = styled('div')({
//   overflowY: 'auto',
//   maxHeight: '500px',
// });

// const ActionContainer = styled('div')(({ theme }) => ({
//   display: 'flex',
//   justifyContent: 'space-between',
//   alignItems: 'center',
//   marginBottom: theme.spacing(2),
//   marginTop: theme.spacing(2), // Add some space at the top
// }));

// const Button = styled('button')(({ theme }) => ({
//   backgroundColor: '#008080',
//   color: 'white',
//   padding: theme.spacing(1, 2),
//   fontSize: '16px',
//   border: 'none',
//   borderRadius: '5px',
//   cursor: 'pointer',
// }));

// const Dropdown = styled('select')(({ theme }) => ({
//   padding: theme.spacing(1),
//   width: '200px',
//   marginRight: theme.spacing(1),
// }));

// const Table = styled('table')({
//   width: '100%',
//   borderCollapse: 'collapse',
// });

// const TableHeader = styled('th')(({ theme }) => ({
//   backgroundColor: '#008080',
//   color: 'white',
//   fontWeight: 'bold',
//   fontSize: '16px',
//   textAlign: 'left',
//   padding: theme.spacing(1),
//   border: '1px solid #ddd',
// }));

// const TableCell = styled('td')(({ theme }) => ({
//   padding: theme.spacing(1),
//   border: '1px solid #ddd',
//   textAlign: 'left',
// }));

// const SuccessMessage = styled('div')(({ theme }) => ({
//   color: 'green',
//   margin: theme.spacing(1, 0),
// }));

// const PaginationContainer = styled('div')({
//   display: 'flex',
//   justifyContent: 'center',
//   margin: '20px 0',
// });

// const PageButton = styled('button')(({ theme }) => ({
//   backgroundColor: '#008080',
//   color: 'white',
//   padding: theme.spacing(1, 2),
//   fontSize: '16px',
//   border: 'none',
//   borderRadius: '5px',
//   cursor: 'pointer',
//   margin: '0 5px',
// }));

// const Input = styled('input')(({ theme }) => ({
//   padding: theme.spacing(1),
//   width: '300px',
//   marginRight: theme.spacing(1),
// }));

// const ReportTable = ({ data, reportName }) => {
//   const [successMessage, setSuccessMessage] = useState('');
//   const [isSending, setIsSending] = useState(false);
//   const [selectedFormat, setSelectedFormat] = useState('xlsx');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [email, setEmail] = useState('');
//   const [selectedColumns, setSelectedColumns] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);
//   const recordsPerPage = 20;

//   const columns = Object.keys(data[0]);

//   useEffect(() => {
//     if (selectAll) {
//       setSelectedColumns(columns);
//     } else {
//       setSelectedColumns([]);
//     }
//   }, [selectAll, columns]);

//   const handleSelectAllChange = (event) => {
//     setSelectAll(event.target.checked);
//   };

//   const sendEmail = async () => {
//     setIsSending(true);
//     try {
//       const filteredData = data.map(row => {
//         const filteredRow = {};
//         selectedColumns.forEach(col => {
//           filteredRow[col] = row[col];
//         });
//         return filteredRow;
//       });

//       const ws = XLSX.utils.json_to_sheet(filteredData);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, 'Report');
//       const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
//       const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
//       const formData = new FormData();
//       formData.append('file', file, 'report.xlsx');
//       formData.append('email', email);

//       await axios.post('http://localhost:3001/api/send-report', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       setSuccessMessage('Report has been sent successfully!');
//       setTimeout(() => setSuccessMessage(''), 3000); // Clear message after 3 seconds
//     } catch (error) {
//       console.error('Failed to send report:', error);
//     }
//     setIsSending(false);
//   };

//   const handleDownload = () => {
//     const filteredData = data.map(row => {
//       const filteredRow = {};
//       selectedColumns.forEach(col => {
//         filteredRow[col] = row[col];
//       });
//       return filteredRow;
//     });

//     const ws = XLSX.utils.json_to_sheet(filteredData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Report');
//     switch (selectedFormat) {
//       case 'xlsx':
//         XLSX.writeFile(wb, 'report.xlsx');
//         break;
//       case 'csv':
//         XLSX.writeFile(wb, 'report.csv', { bookType: 'csv' });
//         break;
//       default:
//         break;
//     }
//   };

//   const handleColumnSelection = (event, newValue) => {
//     setSelectedColumns(newValue);
//   };

//   if (!data || data.length === 0) {
//     return <div>No data available.</div>;
//   }

//   // Pagination logic
//   const indexOfLastRecord = currentPage * recordsPerPage;
//   const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
//   const currentRecords = data.slice(indexOfFirstRecord, indexOfLastRecord);
//   const totalPages = Math.ceil(data.length / recordsPerPage);

//   const handleClick = (event) => {
//     setCurrentPage(Number(event.target.id));
//   };

//   const renderPageNumbers = [];
//   for (let i = 1; i <= totalPages; i++) {
//     renderPageNumbers.push(
//       <PageButton key={i} id={i} onClick={handleClick}>
//         {i}
//       </PageButton>
//     );
//   }

//   return (
//     <Container>
//       <h1>{reportName}</h1>
//       <FormControlLabel
//         control={
//           <Checkbox
//             checked={selectAll}
//             onChange={handleSelectAllChange}
//             color="primary"
//           />
//         }
//         label="Select All"
//       />
//       <Autocomplete
//         multiple
//         options={columns}
//         getOptionLabel={(option) => option}
//         value={selectedColumns}
//         onChange={handleColumnSelection}
//         renderInput={(params) => (
//           <TextField
//             {...params}
//             variant="outlined"
//             label="Select Columns"
//             placeholder="Columns"
//             style={{ marginBottom: '16px' }} // Add margin bottom
//           />
//         )}
//       />
//       <ActionContainer>
//         <div>
//           <Dropdown value={selectedFormat} onChange={(e) => setSelectedFormat(e.target.value)}>
//             <option value="xlsx">Excel (.xlsx)</option>
//             <option value="csv">CSV (.csv)</option>
//           </Dropdown>
//           <Button onClick={handleDownload} disabled={selectedColumns.length === 0}>Download Report</Button>
//         </div>
//         <div>
//           <Input
//             type="email"
//             placeholder="Enter email address"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <Button onClick={sendEmail} disabled={isSending || !email || selectedColumns.length === 0}>
//             {isSending ? 'Sending...' : 'Send Report'}
//           </Button>
//         </div>
//       </ActionContainer>
//       {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
//       <Table>
//         <thead>
//           <tr>
//             {columns.map((col, index) => (
//               <TableHeader key={index}>
//                 {col}
//               </TableHeader>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {currentRecords.map((row, rowIndex) => (
//             <tr key={rowIndex}>
//               {columns.map((col, colIndex) => (
//                 <TableCell key={colIndex}>
//                   {row[col]}
//                 </TableCell>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//       <PaginationContainer>{renderPageNumbers}</PaginationContainer>
//     </Container>
//   );
// };

// export default ReportTable;






























// import React, { useState } from 'react';
// import * as XLSX from 'xlsx';
// import axios from 'axios';
// import { styled } from '@mui/material/styles';
// import TextField from '@mui/material/TextField';
// import Autocomplete from '@mui/material/Autocomplete';
// import Checkbox from '@mui/material/Checkbox';

// const Container = styled('div')({
//   overflowY: 'auto',
//   maxHeight: '500px',
// });

// const ActionContainer = styled('div')(({ theme }) => ({
//   display: 'flex',
//   justifyContent: 'space-between',
//   alignItems: 'center',
//   marginBottom: theme.spacing(2),
//   marginTop: theme.spacing(2), // Add some space at the top
// }));

// const Button = styled('button')(({ theme }) => ({
//   backgroundColor: '#008080',
//   color: 'white',
//   padding: theme.spacing(1, 2),
//   fontSize: '16px',
//   border: 'none',
//   borderRadius: '5px',
//   cursor: 'pointer',
// }));

// const Dropdown = styled('select')(({ theme }) => ({
//   padding: theme.spacing(1),
//   width: '200px',
//   marginRight: theme.spacing(1),
// }));

// const Table = styled('table')({
//   width: '100%',
//   borderCollapse: 'collapse',
// });

// const TableHeader = styled('th')(({ theme }) => ({
//   backgroundColor: '#008080',
//   color: 'white',
//   fontWeight: 'bold',
//   fontSize: '16px',
//   textAlign: 'left',
//   padding: theme.spacing(1),
//   border: '1px solid #ddd',
// }));

// const TableCell = styled('td')(({ theme }) => ({
//   padding: theme.spacing(1),
//   border: '1px solid #ddd',
//   textAlign: 'left',
// }));

// const SuccessMessage = styled('div')(({ theme }) => ({
//   color: 'green',
//   margin: theme.spacing(1, 0),
// }));

// const PaginationContainer = styled('div')({
//   display: 'flex',
//   justifyContent: 'center',
//   margin: '20px 0',
// });

// const PageButton = styled('button')(({ theme }) => ({
//   backgroundColor: '#008080',
//   color: 'white',
//   padding: theme.spacing(1, 2),
//   fontSize: '16px',
//   border: 'none',
//   borderRadius: '5px',
//   cursor: 'pointer',
//   margin: '0 5px',
// }));

// const Input = styled('input')(({ theme }) => ({
//   padding: theme.spacing(1),
//   width: '300px',
//   marginRight: theme.spacing(1),
// }));

// const ReportTable = ({ data, reportName }) => {
//   const [successMessage, setSuccessMessage] = useState('');
//   const [isSending, setIsSending] = useState(false);
//   const [selectedFormat, setSelectedFormat] = useState('xlsx');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [email, setEmail] = useState('');
//   const [selectedColumns, setSelectedColumns] = useState([]);
//   const recordsPerPage = 20;

//   const columns = ['Select All', ...Object.keys(data[0])];

//   const handleColumnSelection = (event, newValue) => {
//     if (newValue.includes('Select All')) {
//       if (selectedColumns.includes('Select All')) {
//         setSelectedColumns([]);
//       } else {
//         setSelectedColumns(columns.slice(1));
//       }
//     } else {
//       setSelectedColumns(newValue);
//     }
//   };

//   const sendEmail = async () => {
//     setIsSending(true);
//     try {
//       const filteredData = data.map(row => {
//         const filteredRow = {};
//         selectedColumns.forEach(col => {
//           filteredRow[col] = row[col];
//         });
//         return filteredRow;
//       });

//       const ws = XLSX.utils.json_to_sheet(filteredData);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, 'Report');
//       const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
//       const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
//       const formData = new FormData();
//       formData.append('file', file, 'report.xlsx');
//       formData.append('email', email);

//       await axios.post('http://localhost:3001/api/send-report', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       setSuccessMessage('Report has been sent successfully!');
//       setTimeout(() => setSuccessMessage(''), 3000); // Clear message after 3 seconds
//     } catch (error) {
//       console.error('Failed to send report:', error);
//     }
//     setIsSending(false);
//   };

//   const handleDownload = () => {
//     const filteredData = data.map(row => {
//       const filteredRow = {};
//       selectedColumns.forEach(col => {
//         filteredRow[col] = row[col];
//       });
//       return filteredRow;
//     });

//     const ws = XLSX.utils.json_to_sheet(filteredData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Report');
//     switch (selectedFormat) {
//       case 'xlsx':
//         XLSX.writeFile(wb, 'report.xlsx');
//         break;
//       case 'csv':
//         XLSX.writeFile(wb, 'report.csv', { bookType: 'csv' });
//         break;
//       default:
//         break;
//     }
//   };

//   if (!data || data.length === 0) {
//     return <div>No data available.</div>;
//   }

//   // Pagination logic
//   const indexOfLastRecord = currentPage * recordsPerPage;
//   const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
//   const currentRecords = data.slice(indexOfFirstRecord, indexOfLastRecord);
//   const totalPages = Math.ceil(data.length / recordsPerPage);

//   const handleClick = (event) => {
//     setCurrentPage(Number(event.target.id));
//   };

//   const renderPageNumbers = [];
//   for (let i = 1; i <= totalPages; i++) {
//     renderPageNumbers.push(
//       <PageButton key={i} id={i} onClick={handleClick}>
//         {i}
//       </PageButton>
//     );
//   }

//   return (
//     <Container>
//       <h1>{reportName}</h1>
//       <Autocomplete
//         multiple
//         options={columns}
//         getOptionLabel={(option) => option}
//         value={selectedColumns}
//         onChange={handleColumnSelection}
//         renderOption={(props, option, { selected }) => (
//           <li {...props}>
//             <Checkbox
//               checked={selected}
//               indeterminate={option === 'Select All' && selectedColumns.length > 0 && selectedColumns.length < columns.length - 1}
//             />
//             {option}
//           </li>
//         )}
//         renderInput={(params) => (
//           <TextField
//             {...params}
//             variant="outlined"
//             label="Select Columns"
//             placeholder="Columns"
//             style={{ marginBottom: '16px' }} // Add margin bottom
//           />
//         )}
//       />
//       <ActionContainer>
//         <div>
//           <Dropdown value={selectedFormat} onChange={(e) => setSelectedFormat(e.target.value)}>
//             <option value="xlsx">Excel (.xlsx)</option>
//             <option value="csv">CSV (.csv)</option>
//           </Dropdown>
//           <Button onClick={handleDownload} disabled={selectedColumns.length === 0 || selectedColumns.includes('Select All')}>Download Report</Button>
//         </div>
//         <div>
//           <Input
//             type="email"
//             placeholder="Enter email address"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <Button onClick={sendEmail} disabled={isSending || !email || selectedColumns.length === 0 || selectedColumns.includes('Select All')}>
//             {isSending ? 'Sending...' : 'Send Report'}
//           </Button>
//         </div>
//       </ActionContainer>
//       {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
//       <Table>
//         <thead>
//           <tr>
//             {columns.slice(1).map((col, index) => (
//               <TableHeader key={index}>
//                 {col}
//               </TableHeader>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {currentRecords.map((row, rowIndex) => (
//             <tr key={rowIndex}>
//               {columns.slice(1).map((col, colIndex) => (
//                 <TableCell key={colIndex}>
//                   {row[col]}
//                 </TableCell>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//       <PaginationContainer>{renderPageNumbers}</PaginationContainer>
//     </Container>
//   );
// };

// export default ReportTable;





































// import React, { useState } from 'react';
// import * as XLSX from 'xlsx';
// import axios from 'axios';
// import { styled } from '@mui/material/styles';
// import TextField from '@mui/material/TextField';
// import Autocomplete from '@mui/material/Autocomplete';
// import Checkbox from '@mui/material/Checkbox';

// const Container = styled('div')({
//   overflowY: 'auto',
//   maxHeight: '500px',
// });

// const ActionContainer = styled('div')(({ theme }) => ({
//   display: 'flex',
//   justifyContent: 'space-between',
//   alignItems: 'center',
//   marginBottom: theme.spacing(2),
//   marginTop: theme.spacing(2), // Add some space at the top
// }));

// const Button = styled('button')(({ theme }) => ({
//   backgroundColor: '#008080',
//   color: 'white',
//   padding: theme.spacing(1, 2),
//   fontSize: '16px',
//   border: 'none',
//   borderRadius: '5px',
//   cursor: 'pointer',
// }));

// const Dropdown = styled('select')(({ theme }) => ({
//   padding: theme.spacing(1),
//   width: '200px',
//   marginRight: theme.spacing(1),
// }));

// const Table = styled('table')({
//   width: '100%',
//   borderCollapse: 'collapse',
// });

// const TableHeader = styled('th')(({ theme }) => ({
//   backgroundColor: '#008080',
//   color: 'white',
//   fontWeight: 'bold',
//   fontSize: '16px',
//   textAlign: 'left',
//   padding: theme.spacing(1),
//   border: '1px solid #ddd',
// }));

// const TableCell = styled('td')(({ theme }) => ({
//   padding: theme.spacing(1),
//   border: '1px solid #ddd',
//   textAlign: 'left',
// }));

// const SuccessMessage = styled('div')(({ theme }) => ({
//   color: 'green',
//   margin: theme.spacing(1, 0),
// }));

// const PaginationContainer = styled('div')({
//   display: 'flex',
//   justifyContent: 'center',
//   margin: '20px 0',
// });

// const PageButton = styled('button')(({ theme }) => ({
//   backgroundColor: '#008080',
//   color: 'white',
//   padding: theme.spacing(1, 2),
//   fontSize: '16px',
//   border: 'none',
//   borderRadius: '5px',
//   cursor: 'pointer',
//   margin: '0 5px',
// }));

// const Input = styled('input')(({ theme }) => ({
//   padding: theme.spacing(1),
//   width: '300px',
//   marginRight: theme.spacing(1),
// }));

// const ReportTable = ({ data, reportName }) => {
//   const [successMessage, setSuccessMessage] = useState('');
//   const [isSending, setIsSending] = useState(false);
//   const [selectedFormat, setSelectedFormat] = useState('xlsx');
//   const [emailFormat, setEmailFormat] = useState('xlsx'); // Add state for email format
//   const [currentPage, setCurrentPage] = useState(1);
//   const [email, setEmail] = useState('');
//   const [selectedColumns, setSelectedColumns] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);
//   const recordsPerPage = 20;

//   const columns = ['Select All', ...Object.keys(data[0])];

//   const handleSelectAll = () => {
//     if (selectAll) {
//       setSelectedColumns([]);
//     } else {
//       setSelectedColumns(columns.slice(1));
//     }
//     setSelectAll(!selectAll);
//   };

//   const handleColumnSelection = (event, newValue) => {
//     if (newValue.includes('Select All')) {
//       if (selectedColumns.includes('Select All')) {
//         setSelectedColumns([]);
//       } else {
//         setSelectedColumns(columns.slice(1));
//       }
//     } else {
//       setSelectedColumns(newValue);
//     }
//   };

//   const sendEmail = async () => {
//     setIsSending(true);
//     try {
//       const filteredData = data.map(row => {
//         const filteredRow = {};
//         selectedColumns.forEach(col => {
//           filteredRow[col] = row[col];
//         });
//         return filteredRow;
//       });

//       const ws = XLSX.utils.json_to_sheet(filteredData);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, 'Report');
//       const excelBuffer = XLSX.write(wb, { bookType: emailFormat, type: 'array' });
//       const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
//       const formData = new FormData();
//       formData.append('file', file, `report.${emailFormat}`);
//       formData.append('email', email);

//       await axios.post('http://localhost:3001/api/send-report', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       setSuccessMessage('Report has been sent successfully!');
//       setTimeout(() => setSuccessMessage(''), 3000); // Clear message after 3 seconds
//     } catch (error) {
//       console.error('Failed to send report:', error);
//     }
//     setIsSending(false);
//   };

//   const handleDownload = () => {
//     const filteredData = data.map(row => {
//       const filteredRow = {};
//       selectedColumns.forEach(col => {
//         filteredRow[col] = row[col];
//       });
//       return filteredRow;
//     });

//     const ws = XLSX.utils.json_to_sheet(filteredData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Report');
//     switch (selectedFormat) {
//       case 'xlsx':
//         XLSX.writeFile(wb, 'report.xlsx');
//         break;
//       case 'csv':
//         XLSX.writeFile(wb, 'report.csv', { bookType: 'csv' });
//         break;
//       default:
//         break;
//     }
//   };

//   if (!data || data.length === 0) {
//     return <div>No data available.</div>;
//   }

//   // Pagination logic
//   const indexOfLastRecord = currentPage * recordsPerPage;
//   const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
//   const currentRecords = data.slice(indexOfFirstRecord, indexOfLastRecord);
//   const totalPages = Math.ceil(data.length / recordsPerPage);

//   const handleClick = (event) => {
//     setCurrentPage(Number(event.target.id));
//   };

//   const renderPageNumbers = [];
//   for (let i = 1; i <= totalPages; i++) {
//     renderPageNumbers.push(
//       <PageButton key={i} id={i} onClick={handleClick}>
//         {i}
//       </PageButton>
//     );
//   }

//   return (
//     <Container>
//       <h1>{reportName}</h1>
//       <Autocomplete
//         multiple
//         options={columns}
//         getOptionLabel={(option) => option}
//         value={selectedColumns}
//         onChange={handleColumnSelection}
//         renderOption={(props, option, { selected }) => (
//           <li {...props}>
//             <Checkbox
//               checked={selected}
//               indeterminate={option === 'Select All' && selectedColumns.length > 0 && selectedColumns.length < columns.length - 1}
//             />
//             {option}
//           </li>
//         )}
//         renderInput={(params) => (
//           <TextField
//             {...params}
//             variant="outlined"
//             label="Select Columns"
//             placeholder="Columns"
//             style={{ marginBottom: '16px' }} // Add margin bottom
//           />
//         )}
//       />
//       <ActionContainer>
//         <div>
//           <Dropdown value={selectedFormat} onChange={(e) => setSelectedFormat(e.target.value)}>
//             <option value="xlsx">Excel (.xlsx)</option>
//             <option value="csv">CSV (.csv)</option>
//           </Dropdown>
//           <Button onClick={handleDownload} disabled={selectedColumns.length === 0 || selectedColumns.includes('Select All')}>Download Report</Button>
//         </div>
//         <div>
//           <Input
//             type="email"
//             placeholder="Enter email address"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <Dropdown value={emailFormat} onChange={(e) => setEmailFormat(e.target.value)} style={{ marginRight: '8px' }}>
//             <option value="xlsx">Excel (.xlsx)</option>
//             <option value="csv">CSV (.csv)</option>
//           </Dropdown>
//           <Button onClick={sendEmail} disabled={isSending || !email || selectedColumns.length === 0 || selectedColumns.includes('Select All')}>
//             {isSending ? 'Sending...' : 'Send Report'}
//           </Button>
//         </div>
//       </ActionContainer>
//       {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
//       <Table>
//         <thead>
//           <tr>
//             {columns.slice(1).map((col, index) => (
//               <TableHeader key={index}>
//                 {col}
//               </TableHeader>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {currentRecords.map((row, rowIndex) => (
//             <tr key={rowIndex}>
//               {columns.slice(1).map((col, colIndex) => (
//                 <TableCell key={colIndex}>
//                   {row[col]}
//                 </TableCell>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//       <PaginationContainer>{renderPageNumbers}</PaginationContainer>
//     </Container>
//   );
// };

// export default ReportTable;














































import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';

const Container = styled('div')({
  overflowY: 'auto',
  maxHeight: '500px',
});

const ActionContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(2), // Add some space at the top
}));

const Button = styled('button')(({ theme }) => ({
  backgroundColor: '#008080',
  color: 'white',
  padding: theme.spacing(1, 2),
  fontSize: '16px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
}));

const Dropdown = styled('select')(({ theme }) => ({
  padding: theme.spacing(1),
  width: '200px',
  marginRight: theme.spacing(1),
}));

const Table = styled('table')({
  width: '100%',
  borderCollapse: 'collapse',
});

const TableHeader = styled('th')(({ theme }) => ({
  backgroundColor: '#008080',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '16px',
  textAlign: 'left',
  padding: theme.spacing(1),
  border: '1px solid #ddd',
}));

const TableCell = styled('td')(({ theme }) => ({
  padding: theme.spacing(1),
  border: '1px solid #ddd',
  textAlign: 'left',
}));

const SuccessMessage = styled('div')(({ theme }) => ({
  color: 'green',
  margin: theme.spacing(1, 0),
}));

const PaginationContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  margin: '20px 0',
});

const PageButton = styled('button')(({ theme }) => ({
  backgroundColor: '#008080',
  color: 'white',
  padding: theme.spacing(1, 2),
  fontSize: '16px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  margin: '0 5px',
}));

const Input = styled('input')(({ theme }) => ({
  padding: theme.spacing(1),
  width: '300px',
  marginRight: theme.spacing(1),
}));

const ReportTable = ({ data, reportName }) => {
  const [successMessage, setSuccessMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('xlsx');
  const [emailFormat, setEmailFormat] = useState('xlsx'); // Add state for email format
  const [currentPage, setCurrentPage] = useState(1);
  const [email, setEmail] = useState('');
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const recordsPerPage = 20;

  const columns = ['Select All', ...Object.keys(data[0])];

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedColumns([]);
    } else {
      setSelectedColumns(columns.slice(1));
    }
    setSelectAll(!selectAll);
  };

  const handleColumnSelection = (event, newValue) => {
    if (newValue.includes('Select All')) {
      if (selectedColumns.includes('Select All')) {
        setSelectedColumns([]);
      } else {
        setSelectedColumns(columns.slice(1));
      }
    } else {
      setSelectedColumns(newValue);
    }
  };

  const sendEmail = async () => {
    setIsSending(true);
    try {
      const filteredData = data.map(row => {
        const filteredRow = {};
        selectedColumns.forEach(col => {
          filteredRow[col] = row[col];
        });
        return filteredRow;
      });

      const ws = XLSX.utils.json_to_sheet(filteredData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Report');
      let file;
      if (emailFormat === 'csv') {
        const csv = XLSX.write(wb, { bookType: 'csv', type: 'string' });
        file = new Blob([csv], { type: 'text/csv' });
      } else {
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        file = new Blob([excelBuffer], { type: 'application/octet-stream' });
      }
      const formData = new FormData();
      formData.append('file', file, `report.${emailFormat}`);
      formData.append('email', email);

      await axios.post('http://localhost:3001/api/send-report', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccessMessage('Report has been sent successfully!');
      setTimeout(() => setSuccessMessage(''), 3000); // Clear message after 3 seconds
    } catch (error) {
      console.error('Failed to send report:', error);
    }
    setIsSending(false);
  };

  const handleDownload = () => {
    const filteredData = data.map(row => {
      const filteredRow = {};
      selectedColumns.forEach(col => {
        filteredRow[col] = row[col];
      });
      return filteredRow;
    });

    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    switch (selectedFormat) {
      case 'xlsx':
        XLSX.writeFile(wb, 'report.xlsx');
        break;
      case 'csv':
        XLSX.writeFile(wb, 'report.csv', { bookType: 'csv' });
        break;
      default:
        break;
    }
  };

  if (!data || data.length === 0) {
    return <div>No data available.</div>;
  }

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = data.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(data.length / recordsPerPage);

  const handleClick = (event) => {
    setCurrentPage(Number(event.target.id));
  };

  const renderPageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    renderPageNumbers.push(
      <PageButton key={i} id={i} onClick={handleClick}>
        {i}
      </PageButton>
    );
  }

  return (
    <Container>
      <h1>{reportName}</h1>
      <Autocomplete
        multiple
        options={columns}
        getOptionLabel={(option) => option}
        value={selectedColumns}
        onChange={handleColumnSelection}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              checked={selected}
              indeterminate={option === 'Select All' && selectedColumns.length > 0 && selectedColumns.length < columns.length - 1}
            />
            {option}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Select Columns"
            placeholder="Columns"
            style={{ marginBottom: '16px' }} // Add margin bottom
          />
        )}
      />
      <ActionContainer>
        <div>
          <Dropdown value={selectedFormat} onChange={(e) => setSelectedFormat(e.target.value)}>
            <option value="xlsx">Excel (.xlsx)</option>
            <option value="csv">CSV (.csv)</option>
          </Dropdown>
          <Button onClick={handleDownload} disabled={selectedColumns.length === 0 || selectedColumns.includes('Select All')}>Download Report</Button>
        </div>
        <div>
          <Input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Dropdown value={emailFormat} onChange={(e) => setEmailFormat(e.target.value)} style={{ marginRight: '8px' }}>
            <option value="xlsx">Excel (.xlsx)</option>
            <option value="csv">CSV (.csv)</option>
          </Dropdown>
          <Button onClick={sendEmail} disabled={isSending || !email || selectedColumns.length === 0 || selectedColumns.includes('Select All')}>
            {isSending ? 'Sending...' : 'Send Report'}
          </Button>
        </div>
      </ActionContainer>
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
      <Table>
        <thead>
          <tr>
            {columns.slice(1).map((col, index) => (
              <TableHeader key={index}>
                {col}
              </TableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.slice(1).map((col, colIndex) => (
                <TableCell key={colIndex}>
                  {row[col]}
                </TableCell>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      <PaginationContainer>{renderPageNumbers}</PaginationContainer>
    </Container>
  );
};

export default ReportTable;
































