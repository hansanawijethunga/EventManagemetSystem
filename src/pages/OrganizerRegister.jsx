import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const OrganizerRegister = () => {
  const { registerOrganizer } = useAuth();
  const [registrationError, setRegistrationError] = useState('');

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
      .matches(/^[0-9-+\s()]*$/, 'Invalid phone number format'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required')
  });

  // Initial form values
  const initialValues = {
    username: '',
    email: '',
    organizationName: '',
    mobileNumber: '',
    password: '',
    confirmPassword: ''
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    setRegistrationError('');
    
    try {
      const { confirmPassword, ...userData } = values;
      const success = await registerOrganizer(userData);
      
      if (!success) {
        setRegistrationError('Registration failed. Please try again.');
      }
    } catch (error) {
      setRegistrationError('An error occurred during registration. Please try again.');
      console.error('Registration error:', error);
    }
    
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register as an Event Organizer
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                {registrationError && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4">
                    <p className="text-sm text-red-700">{registrationError}</p>
                  </div>
                )}
                
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <div className="mt-1">
                    <Field
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      className="input-field"
                    />
                    <ErrorMessage name="username" component="p" className="error-message" />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="input-field"
                    />
                    <ErrorMessage name="email" component="p" className="error-message" />
                  </div>
                </div>

                <div>
                  <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700">
                    Organization Name
                  </label>
                  <div className="mt-1">
                    <Field
                      id="organizationName"
                      name="organizationName"
                      type="text"
                      className="input-field"
                    />
                    <ErrorMessage name="organizationName" component="p" className="error-message" />
                  </div>
                </div>

                <div>
                  <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
                    Mobile Number
                  </label>
                  <div className="mt-1">
                    <Field
                      id="mobileNumber"
                      name="mobileNumber"
                      type="text"
                      className="input-field"
                    />
                    <ErrorMessage name="mobileNumber" component="p" className="error-message" />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      className="input-field"
                    />
                    <ErrorMessage name="password" component="p" className="error-message" />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="mt-1">
                    <Field
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      className="input-field"
                    />
                    <ErrorMessage name="confirmPassword" component="p" className="error-message" />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    {isSubmitting ? 'Registering...' : 'Register'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default OrganizerRegister;