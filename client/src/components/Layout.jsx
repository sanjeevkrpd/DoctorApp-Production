import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { message, Badge } from "antd";
import { userMenu, adminMenu, doctorMenu } from "../Data/data";
import "../styles/LayoutStyle.css";

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    message.success("Logout Successfully");
    navigate("/login");
  };

  const SidebarMenu = user?.isAdmin
    ? adminMenu
    : user?.isDoctor
    ? doctorMenu
    : userMenu;

  return (
    <div className="main">
      <div className="layout">
        <div className="sidebar">
          <div className="logo">
            <h6>DOC APP</h6>
            <hr />
          </div>
          <div className="menu">
            {SidebarMenu.map((menu, index) => {
              const isActive = location.pathname === menu.path;
              return (
                <div
                  key={index}
                  className={`menu-item ${isActive ? "active" : ""}`}
                >
                  <i className={menu.icon}></i>
                  <Link to={menu.path}>{menu.name}</Link>
                </div>
              );
            })}

            <div className={`menu-item`} onClick={handleLogout} key="logout">
              <i className="fa-solid fa-right-from-bracket"></i>
              <Link to="/login">Logout</Link>
            </div>
          </div>
        </div>
        <div className="content">
          <div className="header">
            <div className="header-content" style={{ cursor: "pointer" }}>
              <Badge count={user?.notification?.length || 0}>
                <i
                  className="fa-solid fa-bell"
                  onClick={() => {
                    console.log("Navigating to Notification Page");
                    navigate("/notification"); // Handled navigation to the notification page
                  }}
                ></i>
              </Badge>

              {user && (user.isAdmin || user.isDoctor) ? (
                <Link to={`/doctor/profile/id`}>{user.name}</Link>
              ) : (
                <Link to="/profile">{user?.name}</Link>
              )}
            </div>
          </div>
          <div className="body">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
