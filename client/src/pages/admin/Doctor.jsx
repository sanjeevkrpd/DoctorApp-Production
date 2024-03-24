import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout";
import axios from "axios";
import { Button, Table, message } from "antd"; // Removed unnecessary import of Flex

const Doctor = () => {
  const [doctors, setDoctors] = useState([]);

  const getDoctors = async () => {
    try {
      const res = await axios.get("/api/v1/admin/getAllDoctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        setDoctors(res.data.data);
      } else {
        // Handle error case if needed
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  const handleAccountStatus = async (record, status) => {
    // Added missing parameters
    try {
      const res = await axios.post(
        "/api/v1/admin/changeAccountStatus",
        {
          doctorId: record._id,
          userId: record.userId,
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.data) {
        message.success(res.data.message);
        // You may want to refresh the doctor's list here after successful status change
        getDoctors();
      }
    } catch (error) {
      message.error("Something went Wrong");
    }
  };

  const columns = [
    // Corrected column variable name to 'columns'
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    { title: "Status", dataIndex: "status" },
    { title: "Phone", dataIndex: "phone" },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "pending" ? (
            <Button // Changed button component to Ant Design's Button
              type="primary"
              onClick={() => {
                handleAccountStatus(record, "approved");
              }}
            >
              Approve
            </Button>
          ) : (
            <Button type="primary">Reject</Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <Layout>
        <h1 className="text-center m-3">All Doctors</h1>
        <Table columns={columns} dataSource={doctors} />
      </Layout>
    </>
  );
};

export default Doctor;
