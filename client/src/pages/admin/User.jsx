import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout";
import axios from "axios";
import { Table } from "antd";
const User = () => {
  const [users, SetUsers] = useState([]);

  const getUsers = async () => {
    try {
      const res = await axios.get("/api/v1/admin/getAllUsers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        SetUsers(res.data.data);
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const column = [
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    {
      title: "Doctor",
      dataIndex: "isDoctor",
      render: (text, record) => <span>{record.isDoctor ? "Yes" : "No" }</span>,
    },
    { title: "Created At", dataIndex: "createdAt" },
    { title: "Actions", dataIndex: "actions" },
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <div className="d-flex">
          <button className="btn btn-danger">Block</button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Layout>
        <h1 className="text-center m-2">Users List</h1>
        <Table columns={column} dataSource={users} />
      </Layout>
    </>
  );
};

export default User;
