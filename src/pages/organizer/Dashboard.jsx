import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEvent } from '../../contexts/EventContext';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FiUsers, FiCalendar, FiPackage, FiClock, FiDollarSign } from 'react-icons/fi';

const OrganizerDashboard = () => {
  const { currentUser } = useAuth();
  const { 
    eventRequests, 
    getEventRequestsByOrganizer,
    eventPackages,
    getEventPackagesByOrganizer,
    eventTypes,
    getEventTypesByOrganizer
  } = useEvent();
  
  const [requests, setRequests] = useState([]);
  const [packages, setPackages] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventsOnSelectedDate, setEventsOnSelectedDate] = useState([]);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    confirmedRequests: 0,
    completedRequests: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    if (currentUser) {
      // Get organizer's requests, packages, and types
      const organizerRequests = getEventRequestsByOrganizer(currentUser.id);
      const organizerPackages = getEventPackagesByOrganizer(currentUser.id);
      const organizerTypes = getEventTypesByOrganizer(currentUser.id);
      
      setRequests(organizerRequests);
      setPackages(organizerPackages);
      setTypes(organizerTypes);
      
      // Calculate stats
      const totalRequests = organizerRequests.length;
      const pendingRequests = organizerRequests.filter(req => req.status === 'Pending').length;
      const confirmedRequests = organizerRequests.filter(req => req.status === 'Confirmed').length;
      const completedRequests = organizerRequests.filter(req => req.status === 'Completed').length;
      
      // Calculate total revenue (from completed events)
      const completedEvents = organizerRequests.filter(req => req.status === 'Completed');
      const totalRevenue = completedEvents.reduce((sum, req) => {
        const eventPackage = organizerPackages.find(pkg => pkg.id === req.packageId);
        return sum + (eventPackage ? eventPackage.price : 0);
      }, 0);
      
      setStats({
        totalRequests,
        pendingRequests,
        confirmedRequests,
        completedRequests,
        totalRevenue
      });
    }
  }, [
    currentUser, 
    getEventRequestsByOrganizer, 
    getEventPackagesByOrganizer, 
    getEventTypesByOrganizer,
    eventRequests,
    eventPackages,
    eventTypes
  ]);

  // Update events on selected date when date or requests change
  useEffect(() => {
    if (selectedDate && requests.length > 0) {
      const eventsOnDate = requests.filter(req => {
        const eventDate = new Date(req.eventDate);
        return (
          eventDate.getDate() === selectedDate.getDate() &&
          eventDate.getMonth() === selectedDate.getMonth() &&
          eventDate.getFullYear() === selectedDate.getFullYear()
        );
      });
      
      setEventsOnSelectedDate(eventsOnDate);
    } else {
      setEventsOnSelectedDate([]);
    }
  }, [selectedDate, requests]);

  // Function to get event dates for calendar highlighting
  const getEventDates = () => {
    return requests.map(req => new Date(req.eventDate));
  };

  // Function to format time elapsed since request
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

  // Function to get package title by ID
  const getPackageTitle = (packageId) => {
    const pkg = packages.find(p => p.id === packageId);
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
              <FiUsers className="h-6 w-6 text-blue-600" />
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
              <p className="text-sm font-medium text-gray-600">Pending Requests</p>
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
              <p className="text-sm font-medium text-gray-600">Confirmed Events</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.confirmedRequests}</p>
            </div>
          </div>
        </div>
        
        {/* Total Revenue */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <FiDollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Event Calendar</h2>
            <div className="calendar-container">
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileClassName={({ date, view }) => {
                  if (view === 'month') {
                    const eventDates = getEventDates();
                    const hasEvent = eventDates.some(
                      eventDate =>
                        eventDate.getDate() === date.getDate() &&
                        eventDate.getMonth() === date.getMonth() &&
                        eventDate.getFullYear() === date.getFullYear()
                    );
                    return hasEvent ? 'bg-primary-100 text-primary-800 rounded-full' : null;
                  }
                }}
                className="w-full border-none"
              />
            </div>
            
            {/* Events on selected date */}
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-900 mb-3">
                Events on {selectedDate.toLocaleDateString()}
              </h3>
              
              {eventsOnSelectedDate.length === 0 ? (
                <p className="text-gray-500">No events scheduled for this date.</p>
              ) : (
                <div className="space-y-3">
                  {eventsOnSelectedDate.map((event) => (
                    <div key={event.id} className="bg-gray-50 p-3 rounded-md">
                      <p className="font-medium">{getPackageTitle(event.packageId)}</p>
                      <p className="text-sm text-gray-600">Status: {event.status}</p>
                      <p className="text-sm text-gray-600">Attendees: {event.attendees}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Recent Requests */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Requests</h2>
              <Link to="/organizer/requests" className="text-sm text-primary-600 hover:text-primary-700">
                View all
              </Link>
            </div>
            
            {requests.length === 0 ? (
              <p className="text-gray-500">No requests yet.</p>
            ) : (
              <div className="space-y-4">
                {requests.slice(0, 5).map((request) => (
                  <div key={request.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                    <p className="font-medium">{getPackageTitle(request.packageId)}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                        request.status === 'In Progress' ? 'bg-purple-100 text-purple-800' :
                        request.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status}
                      </span>
                      <span className="text-xs text-gray-500">{formatTimeElapsed(request.requestDate)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Event Date: {new Date(request.eventDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;