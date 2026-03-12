import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Appointment from "../pages/Appointment";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../layout/DashboardLayout";
import DashboardHome from "../components/Dashboard/DashboardHome";
import AllPatients from "../components/Dashboard/AllPatients";
import AddDoctor from "../components/Dashboard/AddDoctor";
import ManageDoctors from "../components/Dashboard/ManageDoctors";
import ContactMessages from "../components/Dashboard/ContactMessages";
import DoctorDetails from "../pages/DoctorDetails";
import DoctorList from "../components/Dashboard/DoctorList";
import EditDoctor from "../components/Dashboard/EditDoctor";
import PatientProfile from "../components/Dashboard/PatientProfile";
import AllAppointments from "../components/Dashboard/AllAppointments";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/appointment",
        element: (
          <PrivateRoute>
            <Appointment />
          </PrivateRoute>
        ),
      },
      {
        path: "/doctor/:doctorId",
        element: (
          <PrivateRoute>
            <DoctorDetails />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "",
        element: <DashboardHome />,
      },
      {
        path: "all-patients",
        element: <AllPatients />,
      },
      {
        path: "appointments",
        element: <AllAppointments />,
      },
      {
        path: "add-doctor",
        element: <AddDoctor />,
      },
      {
        path: "doctors",
        element: <ManageDoctors />,
      },
      {
        path: "messages",
        element: <ContactMessages />,
      },
      {
        path: "doctor-list",
        element: <DoctorList />,
      },
      {
        path: "edit-doctor/:id",
        element: <EditDoctor />,
      },
      {
        path: "profile",
        element: <PatientProfile />,
      },
    ],
  },
]);
