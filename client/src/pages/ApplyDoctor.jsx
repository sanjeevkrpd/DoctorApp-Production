import React from "react";
import { Col, Form, Input, Row, Button, TimePicker, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";
import Layout from "../components/Layout";
import moment from "moment";
const ApplyDoctor = () => {
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/apply-doctor",
        {
          ...values,
          userId: user?._id,
          timings: [
            moment(values.timings[0]).format("HH:mm"),
            moment(values.timings[1]).format("HH:mm"),
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        navigate("/");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong");
    }
  };

  return (
    <>
      <Layout>
        <h1 className="text-center">Apply Doctor</h1>
        <h4 className="text-lite p-1">Personal Details</h4>
        <Form layout="vertical" onFinish={handleFinish} className="m-3">
          <Row gutter={20}>
            <Col xs={24} md={12}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[
                  { required: true, message: "Please enter your first name" },
                ]}
              >
                <Input placeholder="First Name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[
                  { required: true, message: "Please enter your last name" },
                ]}
              >
                <Input placeholder="Last Name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Phone Number"
                name="phone"
                rules={[
                  { required: true, message: "Please enter your phone number" },
                ]}
              >
                <Input placeholder="Phone Number" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Please enter a valid email",
                  },
                ]}
              >
                <Input placeholder="Email" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Website" name="website">
                <Input placeholder="Website" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Address"
                name="address"
                rules={[
                  { required: true, message: "Please enter your address" },
                ]}
              >
                <Input placeholder="Address" />
              </Form.Item>
            </Col>
          </Row>
          <h4 className="text-lite p-1">Professional Details</h4>
          <Row gutter={20}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Specialization"
                name="specialization"
                rules={[
                  {
                    required: true,
                    message: "Please enter your specialization",
                  },
                ]}
              >
                <Input placeholder="Specialization" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Experience"
                name="experience"
                rules={[
                  { required: true, message: "Please enter your experience" },
                ]}
              >
                <Input type="number" placeholder="Experience" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Fees per Consultation"
                name="feesPerConsultation"
                rules={[
                  {
                    required: true,
                    message: "Please enter fees per consultation",
                  },
                ]}
              >
                <Input type="number" placeholder="Fees per Consultation" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Timings"
                name="timings"
                rules={[
                  { required: true, message: "Please enter your work timings" },
                ]}
              >
                <TimePicker.RangePicker format="HH:mm" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Layout>
    </>
  );
};

export default ApplyDoctor;
