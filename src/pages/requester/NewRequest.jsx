import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEvent } from '../../contexts/EventContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FiCalendar, FiUsers, FiMessageSquare, FiDollarSign, FiMapPin } from 'react-icons/fi';
import toast from 'react-hot-toast';

const NewRequest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { 
    createEventRequest, 
    getEventPackageById,
    getOrganizerById
  } = useEvent();
  
  const [packageId, setPackageId] = useState('');
  const [organizerId, setOrganizerId] = useState('');
  const [eventPackage, setEventPackage] = useState(null);
  const [organizer, setOrganizer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Parse query parameters
  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const pkgId = params.get('packageId');
        const orgId = params.get('organizerId');
        
        if (pkgId && orgId) {
          setPackageId(pkgId);
          setOrganizerId(orgId);
          
          // Get package and organizer details
          const packageData = await getEventPackageById(pkgId);
          const organizerData = await getOrganizerById(orgId);
          
          if (packageData && organizerData) {
            setEventPackage(packageData);
            setOrganizer(organizerData);
          } else {
            setError("Package or organizer not found");
            // If package or organizer doesn't exist, redirect after a delay
            setTimeout(() => navigate('/organizers'), 3000);
          }
        } else {
          setError("Missing package or organizer ID");
          // If no package or organizer ID, redirect after a delay
          setTimeout(() => navigate('/organizers'), 3000);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [location.search, getEventPackageById, getOrganizerById, navigate]);

  // Validation schema
  const validationSchema = Yup.object({
    eventDate: Yup.date()
      .required('Event date is required')
      .min(new Date(), 'Event date must be in the future'),
    attendees: Yup.number()
      .required('Number of attendees is required')
      .positive('Number of attendees must be positive')
      .integer('Number of attendees must be a whole number'),
    comments: Yup.string()
      .required('Please provide some details about your event')
      .min(10, 'Comments must be at least 10 characters')
  });

  // Initial form values
  const initialValues = {
    eventDate: '',
    attendees: '',
    comments: ''
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const requestData = {
        packageId,
        organizerId,
        eventDate: new Date(values.eventDate).toISOString(),
        attendees: parseInt(values.attendees, 10),
        comments: values.comments
      };
      
      const newRequest = await createEventRequest(requestData);
      
      if (newRequest && newRequest.id) {
        // Redirect to request details
        navigate(`/requester/requests/${newRequest.id}`);
      } else {
        setError("Failed to create request");
        toast.error("Failed to create request");
      }
    } catch (err) {
      console.error("Error creating request:", err);
      setError("Failed to create request");
      toast.error(err.message || "Failed to create request");
    } finally {
      setSubmitting(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (err) {
      console.error("Error formatting date:", err);
      return '';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
        <p className="text-lg text-gray-600 mb-8">{error}</p>
        <Link to="/organizers" className="btn btn-primary">
          Browse Organizers
        </Link>
      </div>
    );
  }

  if (!eventPackage || !organizer) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Package Not Found</h2>
        <p className="text-lg text-gray-600 mb-8">The event package you're looking for doesn't exist or has been removed.</p>
        <Link to="/organizers" className="btn btn-primary">
          Browse Organizers
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Request Event</h1>
        <Link to={`/organizers/${organizerId}`} className="btn btn-secondary">
          Back to Organizer
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Event Package Details */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Package Details</h2>
              
              {eventPackage.imageUrl && (
                <div className="mb-4">
                  <img
                    src={eventPackage.imageUrl}
                    alt={eventPackage.title || 'Event Package'}
                    className="w-full h-48 object-cover rounded-md"
                  />
                </div>
              )}
              
              <h3 className="text-lg font-medium text-gray-900 mb-2">{eventPackage.title || 'Unnamed Package'}</h3>
              
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <FiMapPin className="mr-2 text-gray-400" />
                {eventPackage.location || 'Location not specified'}
              </div>
              
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <FiDollarSign className="mr-2 text-gray-400" />
                LKR {(eventPackage.price || 0).toLocaleString()}
              </div>
              
              <p className="text-gray-600 mb-4">{eventPackage.description || 'No description available'}</p>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Organizer</h4>
                <p className="font-medium">{organizer.organizationName || 'Organization'}</p>
                <p className="text-sm text-gray-600">{organizer.email || 'No email provided'}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Request Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Event Request Form</h2>
              
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-6">
                    <div>
                      <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Event Date
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiCalendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <Field
                          type="date"
                          name="eventDate"
                          id="eventDate"
                          min={new Date().toISOString().split('T')[0]}
                          className="input-field pl-10"
                        />
                      </div>
                      <ErrorMessage name="eventDate" component="p" className="error-message" />
                    </div>
                    
                    <div>
                      <label htmlFor="attendees" className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Attendees
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUsers className="h-5 w-5 text-gray-400" />
                        </div>
                        <Field
                          type="number"
                          name="attendees"
                          id="attendees"
                          min="1"
                          className="input-field pl-10"
                        />
                      </div>
                      <ErrorMessage name="attendees" component="p" className="error-message" />
                    </div>
                    
                    <div>
                      <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
                        Event Details
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                          <FiMessageSquare className="h-5 w-5 text-gray-400" />
                        </div>
                        <Field
                          as="textarea"
                          name="comments"
                          id="comments"
                          rows="4"
                          className="input-field pl-10"
                          placeholder="Please provide details about your event, specific requirements, or any questions you have..."
                        />
                      </div>
                      <ErrorMessage name="comments" component="p" className="error-message" />
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary"
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRequest;