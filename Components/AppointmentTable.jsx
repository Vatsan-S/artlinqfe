import React from 'react';
import { Space, Table, Tag } from 'antd';
const columns = [
  {
    title: 'Appointment ID',
    dataIndex: 'appointmentID',
    key: 'appointmentID',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Customer Name',
    dataIndex: 'customerName',
    key: 'customerName',
  },
  {
    title: 'Booking Date',
    dataIndex: `date`,
    key: `date`,
  },
  {
    title: 'Time',
    dataIndex: `time`,
    key: `time`,
  },
  {
    title: 'Contact',
    key: 'phone',
    dataIndex: 'phone',
  },
  {
    title: 'Description',
    key: 'description',
    dataIndex: 'description'
  },
  
];

const AppointmentTable = ({data}) => <Table columns={columns} dataSource={data} />;
export default AppointmentTable;