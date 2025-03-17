import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useEvent } from "../../contexts/EventContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  FiCalendar,
  FiClock,
  FiUsers,
  FiMessageSquare,
  FiStar,
} from "react-icons/fi";

const RequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    getEventRequestById,
    getEventPackageById,
    updateEventRequest,
    addFeedback,
  } = useEvent();

  const [request, setRequest] = useState(null);
  const [eventPackage, setEventPackage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Wait for requestData to resolve
        const requestData = await getEventRequestById(id);

        if (requestData && requestData.requesterId === currentUser.id) {
          setRequest(requestData);

          // Wait for packageData to resolve
          const packageData = await getEventPackageById(requestData.packageId);
          setEventPackage(packageData);
        } else {
          navigate("/requester/requests");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, currentUser, getEventRequestById, getEventPackageById, navigate]);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle cancellation
  const handleCancelRequest = () => {
    if (window.confirm("Are you sure you want to cancel this request?")) {
      updateEventRequest(id, { status: "Cancelled" });
      setRequest({ ...request, status: "Cancelled" });
    }
  };

  // Feedback validation schema
  const feedbackValidationSchema = Yup.object({
    rating: Yup.number()
      .required("Rating is required")
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot be more than 5"),
    comment: Yup.string()
      .required("Comment is required")
      .min(10, "Comment must be at least 10 characters"),
  });

  // Handle feedback submission
  const handleFeedbackSubmit = (values, { setSubmitting }) => {
    addFeedback(id, values);
    setRequest({ ...request, feedback: values });
    setIsFeedbackModalOpen(false);
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Loading request details...</p>
      </div>
    );
  }

  if (!request || !eventPackage) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Request Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          The request you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/requester/requests" className="btn btn-primary">
          Back to My Requests
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Request Details</h1>
        <Link to="/requester/requests" className="btn btn-secondary">
          Back to Requests
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {eventPackage.title}
              </h2>
              <p className="text-sm text-gray-600">Request ID: {request.id}</p>
            </div>
            <span
              className={`mt-2 md:mt-0 px-3 py-1 text-sm rounded-full inline-flex items-center ${
                request.status === "Pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : request.status === "Confirmed"
                  ? "bg-blue-100 text-blue-800"
                  : request.status === "Completed"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {request.status === "Pending" && <FiClock className="mr-1" />}
              {request.status === "Confirmed" && (
                <FiCalendar className="mr-1" />
              )}
              {request.status === "Completed" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
              {request.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Event Package
              </h3>
              <p className="text-base font-medium text-gray-900">
                {eventPackage.title}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Price</h3>
              <p className="text-base font-medium text-gray-900">
                LKR {eventPackage.price}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Event Date
              </h3>
              <div className="flex items-center">
                <FiCalendar className="mr-2 text-gray-400" />
                <p className="text-base text-gray-900">
                  {formatDate(request.eventDate)}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Request Date
              </h3>
              <div className="flex items-center">
                <FiClock className="mr-2 text-gray-400" />
                <p className="text-base text-gray-900">
                  {formatDate(request.requestDate)}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Attendees
              </h3>
              <div className="flex items-center">
                <FiUsers className="mr-2 text-gray-400" />
                <p className="text-base text-gray-900">
                  {request.attendees} people
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Location
              </h3>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p className="text-base text-gray-900">
                  {eventPackage.location}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Your Comments
            </h3>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex items-start">
                <FiMessageSquare className="mr-2 mt-1 text-gray-400" />
                <p className="text-sm text-gray-900">
                  {request.comments || "No comments provided."}
                </p>
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          {request.status === "Completed" && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Feedback
              </h3>

              {request.feedback ? (
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`h-5 w-5 ${
                            i < request.feedback.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {request.feedback.rating}/5
                    </span>
                  </div>
                  <p className="text-gray-700">{request.feedback.comment}</p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-3">
                    How was your experience with this event? Your feedback helps
                    other requesters.
                  </p>
                  <button
                    onClick={() => setIsFeedbackModalOpen(true)}
                    className="btn btn-primary"
                  >
                    Leave Feedback
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          {request.status === "Pending" && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-end">
                <button
                  onClick={handleCancelRequest}
                  className="btn btn-danger"
                >
                  Cancel Request
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Package Details */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Event Package Details
          </h2>

          {eventPackage.imageUrl && (
            <div className="mb-6">
              <img
                src={eventPackage.imageUrl}
                alt={eventPackage.title}
                className="w-full h-64 object-cover rounded-md"
              />
            </div>
          )}

          <p className="text-gray-700 mb-6">{eventPackage.description}</p>

          <div className="flex justify-end">
            <Link
              to={`/organizers/${eventPackage.organizerId}`}
              className="btn btn-secondary"
            >
              View Organizer
            </Link>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {isFeedbackModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Leave Feedback
              </h2>
              <button
                onClick={() => setIsFeedbackModalOpen(true)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <Formik
              initialValues={{ rating: 5, comment: "" }}
              validationSchema={feedbackValidationSchema}
              onSubmit={handleFeedbackSubmit}
            >
              {({ isSubmitting, values, setFieldValue }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rating
                    </label>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFieldValue("rating", star)}
                          className="focus:outline-none"
                        >
                          <FiStar
                            className={`h-8 w-8 ${
                              star <= values.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <ErrorMessage
                      name="rating"
                      component="p"
                      className="error-message"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="comment"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Comment
                    </label>
                    <Field
                      as="textarea"
                      name="comment"
                      id="comment"
                      rows="4"
                      className="input-field"
                      placeholder="Share your experience with this event..."
                    />
                    <ErrorMessage
                      name="comment"
                      component="p"
                      className="error-message"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsFeedbackModalOpen(false)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Feedback"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestDetails;
