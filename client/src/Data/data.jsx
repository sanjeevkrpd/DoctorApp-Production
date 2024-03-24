const userMenu = [
  {
    name: "Home",
    path: "/",
    icon: "fa-solid fa-house",
  },
  {
    name: "Appointments",
    path: "/user-appointments",
    icon: "fa-solid fa-list",
  },
  {
    name: "Apply Doctor",
    path: "/apply-doctor",
    icon: "fa-solid fa-user-doctor",
  },
  {
    name: "Profile",
    path: "/profile",
    icon: "fa-solid fa-user",
  },
];

const adminMenu = [
  {
    name: "Home",
    path: "/",
    icon: "fa-solid fa-house",
  },
  {
    name: "Doctors",
    path: "/admin/doctors",
    icon: "fa-solid fa-user-doctor",
  },
  {
    name: "Users",
    path: "/admin/user",
    icon: "fa-solid fa-user",
  },
  {
    name: "Profile",
    path: "/profile",
    icon: "fa-solid fa-user",
  },
];
const doctorMenu = [
  {
    name: "Home",
    path: "/",
    icon: "fa-solid fa-house",
  },
  {
    name: "Appointments",
    path: "/doctor-appointments",
    icon: "fa-solid fa-list",
  },
  {
    name: "Profile",
    path: `/doctor/profile/id`,
    icon: "fa-solid fa-user",
  },
];

export { userMenu, adminMenu, doctorMenu };
