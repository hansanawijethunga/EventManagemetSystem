import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'

// Layouts
import MainLayout from './layouts/MainLayout'
import DashboardLayout from './layouts/DashboardLayout'

// Public Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import OrganizerRegister from './pages/OrganizerRegister'
import RequesterRegister from './pages/RequesterRegister'
import OrganizerDirectory from './pages/OrganizerDirectory'
import OrganizerDetails from './pages/OrganizerDetails'

// Organizer Pages
import OrganizerDashboard from './pages/organizer/Dashboard'
import EventTypes from './pages/organizer/EventTypes'
import EventPackages from './pages/organizer/EventPackages'
import EventRequests from './pages/organizer/EventRequests'
import OrganizerProfile from './pages/organizer/Profile'

// Requester Pages
import RequesterDashboard from './pages/requester/Dashboard'
import MyRequests from './pages/requester/MyRequests'
import RequestDetails from './pages/requester/RequestDetails'
import NewRequest from './pages/requester/NewRequest'
import RequesterProfile from './pages/requester/Profile'

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="register/organizer" element={<OrganizerRegister />} />
        <Route path="register/requester" element={<RequesterRegister />} />
        <Route path="organizers" element={<OrganizerDirectory />} />
        <Route path="organizers/:id" element={<OrganizerDetails />} />
      </Route>
      
      {/* Organizer Routes */}
      <Route 
        path="/organizer" 
        element={
          <ProtectedRoute requiredRole="organizer">
            <DashboardLayout userType="organizer" />
          </ProtectedRoute>
        }
      >
        <Route index element={<OrganizerDashboard />} />
        <Route path="event-types" element={<EventTypes />} />
        <Route path="event-packages" element={<EventPackages />} />
        <Route path="requests" element={<EventRequests />} />
        <Route path="profile" element={<OrganizerProfile />} />
      </Route>
      
      {/* Requester Routes */}
      <Route 
        path="/requester" 
        element={
          <ProtectedRoute requiredRole="requester">
            <DashboardLayout userType="requester" />
          </ProtectedRoute>
        }
      >
        <Route index element={<RequesterDashboard />} />
        <Route path="requests" element={<MyRequests />} />
        <Route path="requests/new" element={<NewRequest />} />
        <Route path="requests/:id" element={<RequestDetails />} />
        <Route path="profile" element={<RequesterProfile />} />
      </Route>
      
      {/* Catch all - 404 */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App