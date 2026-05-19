const XLSX = require('xlsx');
const path = require('path');

const wb = XLSX.utils.book_new();

// Sheet 1: Employees
const employees = [
  { ID: 1, Name: 'Alice Johnson', Department: 'Engineering', Salary: 92000, Start_Date: '2021-03-15', Active: true },
  { ID: 2, Name: 'Bob Smith', Department: 'Marketing', Salary: 78000, Start_Date: '2020-07-01', Active: true },
  { ID: 3, Name: 'Carol Williams', Department: 'Engineering', Salary: 105000, Start_Date: '2019-01-10', Active: true },
  { ID: 4, Name: 'David Brown', Department: 'Sales', Salary: 68000, Start_Date: '2022-11-20', Active: false },
  { ID: 5, Name: 'Eva Martinez', Department: 'Engineering', Salary: 98000, Start_Date: '2020-04-05', Active: true },
  { ID: 6, Name: 'Frank Lee', Department: 'Marketing', Salary: 72000, Start_Date: '2023-02-28', Active: true },
  { ID: 7, Name: 'Grace Chen', Department: 'Sales', Salary: 85000, Start_Date: '2018-09-12', Active: true },
  { ID: 8, Name: 'Henry Wilson', Department: 'Engineering', Salary: 110000, Start_Date: '2017-06-30', Active: true },
  { ID: 9, Name: 'Irene Davis', Department: 'HR', Salary: 75000, Start_Date: '2021-08-15', Active: false },
  { ID: 10, Name: 'Jack Taylor', Department: 'Sales', Salary: '', Start_Date: '2024-01-03', Active: true },
];
const ws1 = XLSX.utils.json_to_sheet(employees);
XLSX.utils.book_append_sheet(wb, ws1, 'Employees');

// Sheet 2: Departments
const depts = [
  { Code: 'ENG', Name: 'Engineering', Head: 'Carol Williams', Budget: 450000 },
  { Code: 'MKT', Name: 'Marketing', Head: 'Bob Smith', Budget: 200000 },
  { Code: 'SLS', Name: 'Sales', Head: 'Grace Chen', Budget: 180000 },
  { Code: 'HR', Name: 'Human Resources', Head: 'Irene Davis', Budget: 120000 },
];
const ws2 = XLSX.utils.json_to_sheet(depts);
XLSX.utils.book_append_sheet(wb, ws2, 'Departments');

const outPath = path.join(__dirname, 'test-data.xlsx');
XLSX.writeFile(wb, outPath);
console.log('Created:', outPath);
