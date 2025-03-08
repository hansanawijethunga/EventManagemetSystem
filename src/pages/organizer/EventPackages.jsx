import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useEvent } from "../../contexts/EventContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiDollarSign,
  FiMapPin,
  FiLoader,
} from "react-icons/fi";
import toast from "react-hot-toast";

const EventPackages = () => {
  const { currentUser } = useAuth();
  const {
    eventTypes,
    getEventTypesByOrganizer,
    eventPackages,
    getEventPackagesByOrganizer,
    addEventPackage,
    updateEventPackage,
    deleteEventPackage,
    loading,
    error,
  } = useEvent();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);
  const [organizerEventTypes, setOrganizerEventTypes] = useState([]);
  const [organizerPackages, setOrganizerPackages] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);

  // Load organizer's event types and packages
  useEffect(() => {
    if (
      currentUser &&
      Array.isArray(eventTypes) &&
      Array.isArray(eventPackages)
    ) {
      const types = getEventTypesByOrganizer(currentUser.id);
      const packages = getEventPackagesByOrganizer(currentUser.id);

      setOrganizerEventTypes(types);
      setOrganizerPackages(packages);
      setLocalLoading(false);
    } else if (!loading) {
      setOrganizerEventTypes([]);
      setOrganizerPackages([]);
      setLocalLoading(false);
    }
  }, [
    currentUser,
    eventTypes,
    eventPackages,
    getEventTypesByOrganizer,
    getEventPackagesByOrganizer,
    loading,
  ]);

  // Validation schema
  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    eventTypeId: Yup.string().required("Event type is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number()
      .required("Price is required")
      .positive("Price must be positive")
      .typeError("Price must be a number"),
    location: Yup.string().required("Location is required"),
    imageUrl: Yup.string().url("Must be a valid URL").nullable(),
  });

  // Open modal for adding new package
  const openAddModal = () => {
    setCurrentPackage(null);
    setIsModalOpen(true);
  };

  // Open modal for editing package
  const openEditModal = (eventPackage) => {
    setCurrentPackage(eventPackage);
    setIsModalOpen(true);
  };

  // Open delete confirmation modal
  const openDeleteModal = (eventPackage) => {
    setPackageToDelete(eventPackage);
    setIsDeleteModalOpen(true);
  };

  // Close modals
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPackage(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setPackageToDelete(null);
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (currentPackage) {
        // Update existing package
        await updateEventPackage(currentPackage.id, values);
      } else {
        // Add new package
        await addEventPackage(values);
      }

      resetForm();
      closeModal();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save event package");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete confirmation
  const confirmDelete = async () => {
    if (packageToDelete) {
      try {
        await deleteEventPackage(packageToDelete.id);
        closeDeleteModal();
      } catch (error) {
        console.error("Error deleting package:", error);
        toast.error("Failed to delete package");
      }
    }
  };

  // Get event type name by ID
  const getEventTypeName = (eventTypeId) => {
    const eventType = organizerEventTypes.find(
      (type) => type.id === eventTypeId
    );
    return eventType ? eventType.name : "Unknown Type";
  };

  if (loading || localLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <FiLoader className="animate-spin h-8 w-8 mx-auto text-primary-600 mb-4" />
          <p className="text-gray-600">Loading event packages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Event Packages</h1>
        <button
          onClick={openAddModal}
          className="btn btn-primary flex items-center"
          disabled={
            !Array.isArray(organizerEventTypes) ||
            organizerEventTypes.length === 0
          }
        >
          <FiPlus className="mr-2" />
          Add Package
        </button>
      </div>

      {/* No Event Types Warning */}
      {(!Array.isArray(organizerEventTypes) ||
        organizerEventTypes.length === 0) && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You need to create at least one event type before you can add
                packages.
                <a
                  href="/organizer/event-types"
                  className="font-medium underline text-yellow-700 hover:text-yellow-600 ml-1"
                >
                  Create Event Type
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Event Packages List */}
      {!Array.isArray(organizerPackages) || organizerPackages.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">
            You haven't created any event packages yet.
          </p>
          {Array.isArray(organizerEventTypes) &&
            organizerEventTypes.length > 0 && (
              <button onClick={openAddModal} className="btn btn-primary">
                Create Your First Package
              </button>
            )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {organizerPackages.map((eventPackage) => (
            <div
              key={eventPackage.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {eventPackage.imageUrl && (
                <div className="h-48 w-full overflow-hidden">
                  <img
                    src={eventPackage.imageUrl}
                    alt={eventPackage.title || "Event Package"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/400x200?text=Image+Not+Available";
                    }}
                  />
                </div>
              )}

              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {eventPackage.title || "Unnamed Package"}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      eventPackage.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {eventPackage.status || "Status Unknown"}
                  </span>
                </div>

                <p className="text-sm text-primary-600 mb-3">
                  {getEventTypeName(eventPackage.eventTypeId)}
                </p>

                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <FiMapPin className="mr-2 text-gray-400" />
                  {eventPackage.location || "Location not specified"}
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <FiDollarSign className="mr-2 text-gray-400" />
                  LKR {(eventPackage.price || 0).toLocaleString()}
                </div>

                <p className="text-gray-600 mb-6 line-clamp-3">
                  {eventPackage.description || "No description available"}
                </p>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => openEditModal(eventPackage)}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    <FiEdit2 className="inline mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(eventPackage)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FiTrash2 className="inline mr-1" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {currentPackage ? "Edit Event Package" : "Add Event Package"}
            </h2>

            <Formik
              initialValues={{
                title: currentPackage?.title || "",
                eventTypeId:
                  currentPackage?.eventTypeId ||
                  (organizerEventTypes.length > 0
                    ? organizerEventTypes[0].id
                    : ""),
                description: currentPackage?.description || "",
                price: currentPackage?.price || "",
                location: currentPackage?.location || "",
                imageUrl: currentPackage?.imageUrl || "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Title
                    </label>
                    <Field
                      type="text"
                      name="title"
                      id="title"
                      className="input-field"
                    />
                    <ErrorMessage
                      name="title"
                      component="p"
                      className="error-message"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="eventTypeId"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Event Type
                    </label>
                    <Field
                      as="select"
                      name="eventTypeId"
                      id="eventTypeId"
                      className="input-field"
                    >
                      {organizerEventTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="eventTypeId"
                      component="p"
                      className="error-message"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Location
                    </label>
                    <Field
                      type="text"
                      name="location"
                      id="location"
                      className="input-field"
                    />
                    <ErrorMessage
                      name="location"
                      component="p"
                      className="error-message"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Price (LKR)
                    </label>
                    <Field
                      type="number"
                      name="price"
                      id="price"
                      className="input-field"
                    />
                    <ErrorMessage
                      name="price"
                      component="p"
                      className="error-message"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      id="description"
                      rows="3"
                      className="input-field"
                    />
                    <ErrorMessage
                      name="description"
                      component="p"
                      className="error-message"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="imageUrl"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Image URL (optional)
                    </label>
                    <Field
                      type="text"
                      name="imageUrl"
                      id="imageUrl"
                      className="input-field"
                    />
                    <ErrorMessage
                      name="imageUrl"
                      component="p"
                      className="error-message"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter a URL for an image to display with your package.
                    </p>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary flex items-center"
                    >
                      {isSubmitting ? (
                        <>
                          <FiLoader className="animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        "Save"
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Confirm Delete
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the package "
              {packageToDelete?.title}"? This action cannot be undone.
            </p>

            <div className="flex justify-end space-x-3">
              <button onClick={closeDeleteModal} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={confirmDelete} className="btn btn-danger">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventPackages;
