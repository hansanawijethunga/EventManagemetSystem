import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiStar, FiSearch } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const OrganizerDirectory = () => {
  const { getAllOrganizers } = useAuth();
  const [organizers, setOrganizers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrganizers, setFilteredOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get all organizers
    const fetchOrganizers = async () => {
      try {
        setLoading(true);
        setError(null);
        const allOrganizers = await getAllOrganizers();
        // Ensure we have an array
        const organizersArray = Array.isArray(allOrganizers) ? allOrganizers : [];
        console.log("Loaded organizers:", organizersArray.length);
        setOrganizers(organizersArray);
        setFilteredOrganizers(organizersArray);
      } catch (error) {
        console.error("Error fetching organizers:", error);
        setError("Failed to load organizers");
        setOrganizers([]);
        setFilteredOrganizers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizers();
  }, [getAllOrganizers]);

  // Handle search
  useEffect(() => {
    if (!Array.isArray(organizers)) {
      setFilteredOrganizers([]);
      return;
    }
    
    if (searchTerm.trim() === '') {
      setFilteredOrganizers(organizers);
    } else {
      const filtered = organizers.filter(
        (organizer) =>
          (organizer.organizationName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (organizer.username?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      );
      setFilteredOrganizers(filtered);
    }
  }, [searchTerm, organizers]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Event Organizers</h1>
      
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md py-3"
            placeholder="Search organizers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Error Message */}
      <ErrorMessage error={error} />
      
      {/* Loading State */}
      {loading && <LoadingSpinner message="Loading organizers..." />}
      
      {/* Organizers Grid */}
      {!loading && Array.isArray(filteredOrganizers) && filteredOrganizers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No organizers found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(filteredOrganizers) && filteredOrganizers.map((organizer) => (
            <Link
              key={organizer.id}
              to={`/organizers/${organizer.id}`}
              className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {organizer.organizationName || 'Organization'}
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  {organizer.username || 'User'}
                </p>
                
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(organizer.rating || 0)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {(organizer.rating || 0).toFixed(1)} ({organizer.reviewCount || 0} reviews)
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {organizer.email || 'No email provided'}
                </div>
                
                <div className="flex items-center text-sm text-gray-600 mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {organizer.mobileNumber || 'No phone number provided'}
                </div>
              </div>
              
              <div className="bg-gray-50 px-6 py-4">
                <div className="text-sm font-medium text-primary-600">
                  View Profile →
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizerDirectory;