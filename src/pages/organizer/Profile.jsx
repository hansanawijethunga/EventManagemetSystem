import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FiUser, FiMail, FiBriefcase, FiPhone } from 'react-icons/fi';

const OrganizerProfile = () => {
  const { currentUser, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Validation schema
  const validationSchema = Yup.object({
    username: Yup.string()
      .required('Username is required')
      .min(3, 'Username must be at least 3 characters'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    organizationName: Yup.string()
      .required('Organization name is required'),
    mobileNumber: Yup.string()
      .required('Mobile number is required')
      .matches(/^[0-9-+\s()]*$/, 'Invalid phone number format')
  });

  // Initial form values
  const initialValues = {
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    organizationName: currentUser?.organizationName || '',
    mobileNumber: currentUser?.mobileNumber || ''
  };

  // Handle form submission
  const handleSubmit = (values, { setSubmitting }) => {
    updateProfile(values);
    setUpdateSuccess(true);
    setIsEditing(false);
    setSubmitting(false);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setUpdateSuccess(false);
    }, 3000);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          {updateSuccess && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Profile updated successfully!
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {isEditing ? (
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        type="text"
                        name="username"
                        id="username"
                        className="input-field pl-10"
                      />
                    </div>
                    <ErrorMessage name="username" component="p" className="error-message" />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        type="email"
                        name="email"
                        id="email"
                        className="input-field pl-10"
                      />
                    </div>
                    <ErrorMessage name="email" component="p" className="error-message" />
                  </div>
                  
                  <div>
                    <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700">
                      Organization Name
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiBriefcase className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        type="text"
                        name="organizationName"
                        id="organizationName"
                        className="input-field pl-10"
                      />
                    </div>
                    <ErrorMessage name="organizationName" component="p" className="error-message" />
                  </div>
                  
                  <div>
                    <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
                      Mobile Number
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiPhone className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        type="text"
                        name="mobileNumber"
                        id="mobileNumber"
                        className="input-field pl-10"
                      />
                    </div>
                    <ErrorMessage name="mobileNumber" component="p" className="error-message" />
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary"
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          ) : (
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{currentUser?.organizationName}</h2>
                  <p className="text-gray-600 mt-1">Organizer Account</p>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary"
                >
                  Edit Profile
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Username</h3>
                  <div className="flex items-center">
                    <FiUser className="mr-2 text-gray-400" />
                    <p className="text-base text-gray-900">{currentUser?.username}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                  <div className="flex items-center">
                    <FiMail className="mr-2 text-gray-400" />
                    <p className="text-base text-gray-900">{currentUser?.email}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Organization</h3>
                  <div className="flex items-center">
                    <FiBriefcase className="mr-2 text-gray-400" />
                    <p className="text-base text-gray-900">{currentUser?.organizationName}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Mobile Number</h3>
                  <div className="flex items-center">
                    <FiPhone className="mr-2 text-gray-400" />
                    <p className="text-base text-gray-900">{currentUser?.mobileNumber}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Statistics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Rating</p>
                    <p className="text-2xl font-semibold text-gray-900">{currentUser?.rating.toFixed(1)}</p>
                    <p className="text-xs text-gray-500">{currentUser?.reviewCount} reviews</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Member Since</p>
                    <p className="text-2xl font-semibold text-gray-900">2025</p>
                    <p className="text-xs text-gray-500">January</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizerProfile;