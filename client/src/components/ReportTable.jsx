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
//       let file;
//       if (emailFormat === 'csv') {
//         const csv = XLSX.write(wb, { bookType: 'csv', type: 'string' });
//         file = new Blob([csv], { type: 'text/csv' });
//       } else {
//         const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
//         file = new Blob([excelBuffer], { type: 'application/octet-stream' });
//       }
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
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
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
  marginTop: theme.spacing(2),
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
  const [emailFormat, setEmailFormat] = useState('xlsx');
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

  const generatePDF = (filteredData) => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [selectedColumns],
      body: filteredData.map(row => selectedColumns.map(col => row[col])),
    });
    return doc;
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

      let file;
      let fileType;
      if (emailFormat === 'csv') {
        const ws = XLSX.utils.json_to_sheet(filteredData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Report');
        const csv = XLSX.write(wb, { bookType: 'csv', type: 'string' });
        file = new Blob([csv], { type: 'text/csv' });
        fileType = 'text/csv';
      } else if (emailFormat === 'pdf') {
        const pdfDoc = generatePDF(filteredData);
        const pdf = pdfDoc.output('blob');
        file = new Blob([pdf], { type: 'application/pdf' });
        fileType = 'application/pdf';
      } else {
        const ws = XLSX.utils.json_to_sheet(filteredData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Report');
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        file = new Blob([excelBuffer], { type: 'application/octet-stream' });
        fileType = 'application/octet-stream';
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
      setTimeout(() => setSuccessMessage(''), 3000);
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

    switch (selectedFormat) {
      case 'xlsx':
        const wsXlsx = XLSX.utils.json_to_sheet(filteredData);
        const wbXlsx = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wbXlsx, wsXlsx, 'Report');
        XLSX.writeFile(wbXlsx, 'report.xlsx');
        break;
      case 'csv':
        const wsCsv = XLSX.utils.json_to_sheet(filteredData);
        const wbCsv = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wbCsv, wsCsv, 'Report');
        XLSX.writeFile(wbCsv, 'report.csv', { bookType: 'csv' });
        break;
      case 'pdf':
        const pdfDoc = generatePDF(filteredData);
        pdfDoc.save('report.pdf');
        break;
      default:
        break;
    }
  };

  if (!data || data.length === 0) {
    return <div>No data available.</div>;
  }

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
            style={{ marginBottom: '16px' }}
          />
        )}
      />
      <ActionContainer>
        <div>
          <Dropdown value={selectedFormat} onChange={(e) => setSelectedFormat(e.target.value)}>
            <option value="xlsx">Excel (.xlsx)</option>
            <option value="csv">CSV (.csv)</option>
            <option value="pdf">PDF (.pdf)</option>
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
            <option value="pdf">PDF (.pdf)</option>
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