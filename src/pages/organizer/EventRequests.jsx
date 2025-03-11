import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useEvent } from "../../contexts/EventContext";
import { FiCalendar, FiClock, FiUsers, FiMessageSquare } from "react-icons/fi";

const EventRequests = () => {
  const { currentUser } = useAuth();
  const {
    getEventRequestsByOrganizer,
    updateEventRequestStatus,
    getEventPackageById,
  } = useEvent();

  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  // Load requests
  useEffect(() => {
    if (currentUser) {
      const organizerRequests = getEventRequestsByOrganizer(currentUser.id);
      setRequests(organizerRequests);
    }
  }, [currentUser, getEventRequestsByOrganizer]);

  // Filter requests based on status
  const filteredRequests =
    statusFilter === "all"
      ? requests
      : requests.filter(
          (request) =>
            request.status.toLowerCase() === statusFilter.toLowerCase()
        );

  // Open request details modal
  const openRequestDetails = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  // Update request status
  const handleStatusUpdate = (requestId, newStatus) => {
    updateEventRequestStatus(requestId, newStatus);

    // Update local state
    setRequests(
      requests.map((request) =>
        request.id === requestId ? { ...request, status: newStatus } : request
      )
    );

    // Close modal
    closeModal();
  };

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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Event Requests</h1>

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
          <p className="text-sm text-gray-500">
            {statusFilter !== "all"
              ? `Try changing your filter or check back later.`
              : `When clients request your services, they'll appear here.`}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Event Package
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Event Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Attendees
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Request Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => {
                  const packageDetails = getPackageDetails(request.packageId);
                  return (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {packageDetails.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          LKR {packageDetails.price}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(request.eventDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {request.attendees}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            request.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : request.status === "Confirmed"
                              ? "bg-blue-100 text-blue-800"
                              : request.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(request.requestDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openRequestDetails(request)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Request Details Modal */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Request Details
              </h2>
              <button
                onClick={closeModal}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Event Package
                </h3>
                <p className="text-base font-medium text-gray-900">
                  {getPackageDetails(selectedRequest.packageId).title}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Price
                </h3>
                <p className="text-base font-medium text-gray-900">
                  LKR {getPackageDetails(selectedRequest.packageId).price}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Event Date
                </h3>
                <div className="flex items-center">
                  <FiCalendar className="mr-2 text-gray-400" />
                  <p className="text-base text-gray-900">
                    {formatDate(selectedRequest.eventDate)}
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
                    {formatDate(selectedRequest.requestDate)}
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
                    {selectedRequest.attendees} people
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Status
                </h3>
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    selectedRequest.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : selectedRequest.status === "Confirmed"
                      ? "bg-blue-100 text-blue-800"
                      : selectedRequest.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedRequest.status}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Comments
              </h3>
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex items-start">
                  <FiMessageSquare className="mr-2 mt-1 text-gray-400" />
                  <p className="text-sm text-gray-900">
                    {selectedRequest.comments || "No comments provided."}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex flex-wrap justify-end gap-3">
                <button onClick={closeModal} className="btn btn-secondary">
                  Close
                </button>

                {selectedRequest.status === "Pending" && (
                  <>
                    <button
                      onClick={() =>
                        handleStatusUpdate(selectedRequest.id, "Confirmed")
                      }
                      className="btn bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Confirm Request
                    </button>
                    <button
                      onClick={() =>
                        handleStatusUpdate(selectedRequest.id, "Cancelled")
                      }
                      className="btn btn-danger"
                    >
                      Decline Request
                    </button>
                  </>
                )}

                {selectedRequest.status === "Confirmed" && (
                  <button
                    onClick={() =>
                      handleStatusUpdate(selectedRequest.id, "Completed")
                    }
                    className="btn bg-green-600 text-white hover:bg-green-700"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventRequests;
