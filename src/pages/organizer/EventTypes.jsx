import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useEvent } from '../../contexts/EventContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FiEdit2, FiTrash2, FiPlus, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';

const EventTypes = () => {
  const { 
    eventTypes, 
    getEventTypesByOrganizer, 
    addEventType, 
    updateEventType, 
    deleteEventType,
    loading,
    error
  } = useEvent();
  const { currentUser } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEventType, setCurrentEventType] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState(null);
  const [organizerEventTypes, setOrganizerEventTypes] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);

  // Get organizer's event types
  useEffect(() => {
    if (currentUser && Array.isArray(eventTypes)) {
      const types = getEventTypesByOrganizer(currentUser.id);
      setOrganizerEventTypes(types);
      setLocalLoading(false);
    } else if (!loading) {
      setOrganizerEventTypes([]);
      setLocalLoading(false);
    }
  }, [currentUser, eventTypes, getEventTypesByOrganizer, loading]);

  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required')
  });

  // Open modal for adding new event type
  const openAddModal = () => {
    setCurrentEventType(null);
    setIsModalOpen(true);
  };

  // Open modal for editing event type
  const openEditModal = (eventType) => {
    setCurrentEventType(eventType);
    setIsModalOpen(true);
  };

  // Open delete confirmation modal
  const openDeleteModal = (eventType) => {
    setTypeToDelete(eventType);
    setIsDeleteModalOpen(true);
  };

  // Close modals
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentEventType(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTypeToDelete(null);
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (currentEventType) {
        // Update existing event type
        await updateEventType(currentEventType.id, values);
      } else {
        // Add new event type
        await addEventType(values);
      }
      
      resetForm();
      closeModal();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save event type");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete confirmation
  const confirmDelete = async () => {
    if (typeToDelete) {
      try {
        await deleteEventType(typeToDelete.id);
        closeDeleteModal();
      } catch (error) {
        console.error("Error deleting event type:", error);
        toast.error("Failed to delete event type");
      }
    }
  };

  if (loading || localLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <FiLoader className="animate-spin h-8 w-8 mx-auto text-primary-600 mb-4" />
          <p className="text-gray-600">Loading event types...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
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
        <h1 className="text-2xl font-bold text-gray-900">Event Types</h1>
        <button
          onClick={openAddModal}
          className="btn btn-primary flex items-center"
        >
          <FiPlus className="mr-2" />
          Add Event Type
        </button>
      </div>

      {/* Event Types List */}
      {!Array.isArray(organizerEventTypes) || organizerEventTypes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">You haven't created any event types yet.</p>
          <button
            onClick={openAddModal}
            className="btn btn-primary"
          >
            Create Your First Event Type
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {organizerEventTypes.map((eventType) => (
                <tr key={eventType.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{eventType.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{eventType.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openEditModal(eventType)}
                      className="text-primary-600 hover:text-primary-900 mr-4"
                    >
                      <FiEdit2 className="inline" /> Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(eventType)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 className="inline" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {currentEventType ? 'Edit Event Type' : 'Add Event Type'}
            </h2>
            
            <Formik
              initialValues={{
                name: currentEventType?.name || '',
                description: currentEventType?.description || ''
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <Field
                      type="text"
                      name="name"
                      id="name"
                      className="input-field"
                    />
                    <ErrorMessage name="name" component="p" className="error-message" />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      id="description"
                      rows="3"
                      className="input-field"
                    />
                    <ErrorMessage name="description" component="p" className="error-message" />
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
                      ) : 'Save'}
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Confirm Delete</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the event type "{typeToDelete?.name}"? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteModal}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventTypes;