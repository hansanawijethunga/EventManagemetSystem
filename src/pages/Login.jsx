import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");
  const [demoCredentials, setDemoCredentials] = useState({
    email: "test@example.com",
    password: "password123",
  });

  // Validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  // Initial form values
  const initialValues = {
    email: "",
    password: "",
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    setLoginError("");

    try {
      const success = await login(values.email, values.password);
      if (!success) {
        setLoginError("Invalid email or password");
      }
    } catch (error) {
      setLoginError("An error occurred during login. Please try again.");
      console.error("Login error:", error);
    }

    setSubmitting(false);
  };

  // Fill demo credentials
  const fillDemoCredentials = () => {
    document.getElementById("email").value = demoCredentials.email;
    document.getElementById("password").value = demoCredentials.password;
    toast.success('Demo credentials filled! Click "Sign in" to continue.');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            to="/register"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            create a new account
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
                {loginError && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4">
                    <p className="text-sm text-red-700">{loginError}</p>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
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
                    <ErrorMessage
                      name="email"
                      component="p"
                      className="error-message"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="mt-1">
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      className="input-field"
                    />
                    <ErrorMessage
                      name="password"
                      component="p"
                      className="error-message"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    {isSubmitting ? "Signing in..." : "Sign in"}
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

export default Login;
