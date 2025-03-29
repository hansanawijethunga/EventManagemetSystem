import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useEvent } from "../../contexts/EventContext";
import { FiCalendar, FiClock, FiUsers, FiFilter } from "react-icons/fi";

const MyRequests = () => {
  const { currentUser } = useAuth();
  const { getEventRequestsByRequester, getEventPackageById } = useEvent();

  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");

  // Load requests
  useEffect(() => {
    if (currentUser) {
      const requesterRequests = getEventRequestsByRequester(currentUser.id);
      setRequests(requesterRequests);
    }
  }, [currentUser, getEventRequestsByRequester]);

  // Filter requests based on status
  const filteredRequests =
    statusFilter === "all"
      ? requests
      : requests.filter(
          (request) =>
            request.status.toLowerCase() === statusFilter.toLowerCase()
        );

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get package details
  const getPackageDetails = (packageId) => {
    const eventPackage = getEventPackageById(packageId);
    return eventPackage || { title: "Unknown Package", price: 0 };
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Requests</h1>

      {/* Filter Controls */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm font-medium text-gray-700">
            Filter by status:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 text-sm rounded-full ${
                statusFilter === "all"
                  ? "bg-primary-100 text-primary-800"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-3 py-1 text-sm rounded-full ${
                statusFilter === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter("confirmed")}
              className={`px-3 py-1 text-sm rounded-full ${
                statusFilter === "confirmed"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              Confirmed
            </button>
            <button
              onClick={() => setStatusFilter("completed")}
              className={`px-3 py-1 text-sm rounded-full ${
                statusFilter === "completed"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setStatusFilter("cancelled")}
              className={`px-3 py-1 text-sm rounded-full ${
                statusFilter === "cancelled"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              Cancelled
            </button>
          </div>
        </div>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-2">No event requests found.</p>
          <p className="text-sm text-gray-500 mb-6">
            {statusFilter !== "all"
              ? `Try changing your filter or check back later.`
              : `Browse organizers and request your first event.`}
          </p>

          {statusFilter === "all" && (
            <Link to="/organizers" className="btn btn-primary">
              Find Organizers
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredRequests
            .sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate))
            .map((request) => {
              const packageDetails = getPackageDetails(request.packageId);
              return (
                <div
                  key={request.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-1">
                          {packageDetails.title}
                        </h2>
                        <p className="text-sm text-gray-600">
                          Request ID: {request.id}
                        </p>
                      </div>
                      <span
                        className={`mt-2 md:mt-0 px-3 py-1 text-xs rounded-full inline-flex items-center ${
                          request.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : request.status === "Confirmed"
                            ? "bg-blue-100 text-blue-800"
                            : request.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {request.status === "Pending" && (
                          <FiClock className="mr-1" />
                        )}
                        {request.status === "Confirmed" && (
                          <FiCalendar className="mr-1" />
                        )}
                        {request.status === "Completed" && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 mr-1"
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <h3 className="text-xs font-medium text-gray-500 uppercase">
                          Event Date
                        </h3>
                        <p className="mt-1 flex items-center">
                          <FiCalendar className="mr-2 text-gray-400" />
                          {formatDate(request.eventDate)}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-xs font-medium text-gray-500 uppercase">
                          Attendees
                        </h3>
                        <p className="mt-1 flex items-center">
                          <FiUsers className="mr-2 text-gray-400" />
                          {request.attendees} people
                        </p>
                      </div>

                      <div>
                        <h3 className="text-xs font-medium text-gray-500 uppercase">
                          Price
                        </h3>
                        <p className="mt-1 flex items-center">
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
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          LKR {packageDetails.price}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Link
                        to={`/requester/requests/${request.id}`}
                        className="btn btn-primary"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default MyRequests;
