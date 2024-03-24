import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import axios from "axios";
import moment from "moment";

import Layout from "./../../components/Layout";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      let res = await axios.get("/api/v1/doctor/doctor-appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        setAppointments(res.data.data);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error("Something went wrong");
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  const handleStatus = async (record, status) => {
    try {
      const res = await axios.post(
        "/api/v1/doctor/update-status",
        {
          appointmentsId: record._id,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      window.location.reload();
      if (res.data.success) {
        message.success(res.data.message);

        getAppointments();
      }
    } catch (error) {
      console.log(error);
      message.error("Somethinng went wrong");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      render: (text, record) => (
        <span>
          {moment(record.date).format("DD-MM-YYYY")} &nbsp;
          {moment(record.time).format("HH:mm")}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      dataIndex: "actions",

      render: (text, record) => (
        <div className="d-flex">
          {record.status === "pending" && (
            <>
              <button
                className="btn btn-success "
                onClick={() => handleStatus(record, "approved") }
              >
                Approve
              </button>
              <button
                className="btn btn-danger ms-2 "
                onClick={() => handleStatus(record, "reject")}
              >
                Reject
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <Layout>
        <h1 className="text-center p-2">Appointments Lists</h1>
        <Table columns={columns} dataSource={appointments} />
      </Layout>
    </>
  );
};

export default DoctorAppointments;
