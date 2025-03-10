import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiHome, FiCalendar, FiPackage, FiList, FiUser, FiLogOut } from 'react-icons/fi';

const DashboardLayout = ({ userType }) => {
  const { currentUser, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Define navigation links based on user type
  const navLinks = userType === 'organizer' 
    ? [
        { path: '/organizer', icon: <FiHome size={20} />, label: 'Dashboard' },
        { path: '/organizer/event-types', icon: <FiList size={20} />, label: 'Event Types' },
        { path: '/organizer/event-packages', icon: <FiPackage size={20} />, label: 'Event Packages' },
        { path: '/organizer/requests', icon: <FiCalendar size={20} />, label: 'Event Requests' },
        { path: '/organizer/profile', icon: <FiUser size={20} />, label: 'Profile' },
      ]
    : [
        { path: '/requester', icon: <FiHome size={20} />, label: 'Dashboard' },
        { path: '/organizers', icon: <FiHome size={20} />, label: 'Organizers' },
        { path: '/requester/requests', icon: <FiCalendar size={20} />, label: 'My Requests' },
        { path: '/requester/profile', icon: <FiUser size={20} />, label: 'Profile' },
      ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for larger screens */}
      <aside className={`bg-secondary-800 text-white w-64 fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition duration-200 ease-in-out z-30`}>
        <div className="p-6">
          <h2 className="text-2xl font-bold">EventHub</h2>
          <p className="text-sm text-gray-400 mt-1">
            {userType === 'organizer' ? 'Organizer Portal' : 'Requester Portal'}
          </p>
        </div>
        
        <nav className="mt-6">
          <ul>
            {navLinks.map((link) => (
              <li key={link.path} className="px-6 py-3">
                <Link
                  to={link.path}
                  className={`flex items-center space-x-3 ${
                    location.pathname === link.path
                      ? 'text-white font-medium'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={closeSidebar}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
            <li className="px-6 py-3">
              <button
                onClick={logout}
                className="flex items-center space-x-3 text-gray-400 hover:text-white w-full text-left"
              >
                <FiLogOut size={20} />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 md:ml-64">
        {/* Top navigation */}
        <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
          <button
            className="md:hidden text-gray-600 focus:outline-none"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium">{currentUser?.name || currentUser?.username}</p>
              <p className="text-xs text-gray-500">{currentUser?.email}</p>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}
    </div>
  );
};

export default DashboardLayout;