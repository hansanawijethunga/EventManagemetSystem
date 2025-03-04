import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEvent } from '../../contexts/EventContext';
import { FiCalendar, FiClock, FiPackage } from 'react-icons/fi';

const RequesterDashboard = () => {
  const { currentUser } = useAuth();
  const { 
    eventRequests, 
    getEventRequestsByRequester,
    getEventPackageById
  } = useEvent();
  
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    confirmedRequests: 0,
    completedRequests: 0
  });

  useEffect(() => {
    if (currentUser) {
      // Get requester's requests
      const requesterRequests = getEventRequestsByRequester(currentUser.id);
      setRequests(requesterRequests);
      
      // Calculate stats
      const totalRequests = requesterRequests.length;
      const pendingRequests = requesterRequests.filter(req => req.status === 'Pending').length;
      const confirmedRequests = requesterRequests.filter(req => req.status === 'Confirmed').length;
      const completedRequests = requesterRequests.filter(req => req.status === 'Completed').length;
      
      setStats({
        totalRequests,
        pendingRequests,
        confirmedRequests,
        completedRequests
      });
    }
  }, [currentUser, getEventRequestsByRequester, eventRequests]);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time elapsed since request
  const formatTimeElapsed = (requestDate) => {
    const requestTime = new Date(requestDate).getTime();
    const currentTime = new Date().getTime();
    const elapsedMs = currentTime - requestTime;
    
    const seconds = Math.floor(elapsedMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  // Get package title by ID
  const getPackageTitle = (packageId) => {
    const pkg = getEventPackageById(packageId);
    return pkg ? pkg.title : 'Unknown Package';
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Requests */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <FiPackage className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalRequests}</p>
            </div>
          </div>
        </div>
        
        {/* Pending Requests */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 mr-4">
              <FiClock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pendingRequests}</p>
            </div>
          </div>
        </div>
        
        {/* Confirmed Events */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <FiCalendar className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.confirmedRequests}</p>
            </div>
          </div>
        </div>
        
        {/* Completed Events */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.completedRequests}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Upcoming Events */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
          <Link to="/requester/requests" className="text-sm text-primary-600 hover:text-primary-700">
            View all
          </Link>
        </div>
        
        {requests.filter(req => req.status === 'Confirmed').length === 0 ? (
          <p className="text-gray-500">No upcoming events.</p>
        ) : (
          <div className="space-y-4">
            {requests
              .filter(req => req.status === 'Confirmed')
              .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
              .slice(0, 3)
              .map((request) => (
                <div key={request.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                  <p className="font-medium">{getPackageTitle(request.packageId)}</p>
                  <div className="flex items-center mt-1">
                    <FiCalendar className="text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{formatDate(request.eventDate)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                      Confirmed
                    </span>
                    <Link to={`/requester/requests/${request.id}`} className="text-sm text-primary-600 hover:text-primary-700">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
      
      {/* Recent Requests */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Requests</h2>
          <Link to="/requester/requests" className="text-sm text-primary-600 hover:text-primary-700">
            View all
          </Link>
        </div>
        
        {requests.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500 mb-4">You haven't made any event requests yet.</p>
            <Link to="/organizers" className="btn btn-primary">
              Find Organizers
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {requests
              .sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate))
              .slice(0, 5)
              .map((request) => (
                <div key={request.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                  <p className="font-medium">{getPackageTitle(request.packageId)}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                      request.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {request.status}
                    </span>
                    <span className="text-xs text-gray-500">{formatTimeElapsed(request.requestDate)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600">
                      Event Date: {formatDate(request.eventDate)}
                    </span>
                    <Link to={`/requester/requests/${request.id}`} className="text-sm text-primary-600 hover:text-primary-700">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequesterDashboard;