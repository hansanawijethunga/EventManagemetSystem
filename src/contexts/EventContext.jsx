import { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/config";

// Create the context
const EventContext = createContext();

// Custom hook to use the event context
export const useEvent = () => {
  return useContext(EventContext);
};

// Provider component
export const EventProvider = ({ children }) => {
  // State for event types, packages, and requests
  const [eventTypes, setEventTypes] = useState([]);
  const [eventPackages, setEventPackages] = useState([]);
  const [eventRequests, setEventRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser, getOrganizerById } = useAuth();

  // Load initial data from Firestore with real-time updates
  useEffect(() => {
    let typesUnsubscribe = null;
    let packagesUnsubscribe = null;
    let requestsUnsubscribe = null;

    const setupSubscriptions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Create sample data for demo purposes
        await createSampleData();

        // Set up real-time listeners for event types
        typesUnsubscribe = onSnapshot(
          collection(db, "eventTypes"),
          (snapshot) => {
            const typesData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            console.log("Event types loaded:", typesData.length);
            setEventTypes(typesData);
          },
          (err) => {
            console.error("Error in event types listener:", err);
            setError("Failed to load event types");
          }
        );

        // Set up real-time listeners for event packages
        packagesUnsubscribe = onSnapshot(
          collection(db, "eventPackages"),
          (snapshot) => {
            const packagesData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            console.log("Event packages loaded:", packagesData.length);
            setEventPackages(packagesData);
          },
          (err) => {
            console.error("Error in event packages listener:", err);
            setError("Failed to load event packages");
          }
        );

        // Set up real-time listeners for event requests
        requestsUnsubscribe = onSnapshot(
          collection(db, "eventRequests"),
          (snapshot) => {
            const requestsData = snapshot.docs.map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
                // Convert Firestore timestamps to ISO strings for consistency
                requestDate:
                  data.requestDate?.toDate?.()?.toISOString() ||
                  new Date().toISOString(),
                eventDate:
                  data.eventDate?.toDate?.()?.toISOString() ||
                  new Date().toISOString(),
              };
            });
            console.log("Event requests loaded:", requestsData.length);
            setEventRequests(requestsData);
          },
          (err) => {
            console.error("Error in event requests listener:", err);
            setError("Failed to load event requests");
          }
        );
      } catch (error) {
        console.error("Error setting up data subscriptions:", error);
        setError("Failed to load data");
        // Initialize with empty arrays to prevent undefined errors
        setEventTypes([]);
        setEventPackages([]);
        setEventRequests([]);
      } finally {
        setLoading(false);
      }
    };

    setupSubscriptions();

    // Clean up listeners on unmount
    return () => {
      if (typesUnsubscribe) typesUnsubscribe();
      if (packagesUnsubscribe) packagesUnsubscribe();
      if (requestsUnsubscribe) requestsUnsubscribe();
    };
  }, []);

  // Create sample data for demo purposes
  const createSampleData = async () => {
    try {
      // Check if we already have event types
      const typesSnapshot = await getDocs(collection(db, "eventTypes"));
      if (!typesSnapshot.empty) {
        return; // Data already exists, no need to create sample data
      }

      // Sample organizer ID (this should be the ID of the demo user)
      const organizerId = "demo-organizer-id";

      // Create sample event types
      const eventTypeIds = [];
      const sampleEventTypes = [
        {
          name: "Wedding",
          description: "Full-service wedding planning and coordination",
          organizerId,
        },
        {
          name: "Corporate Event",
          description:
            "Professional business events, conferences, and meetings",
          organizerId,
        },
        {
          name: "Birthday Party",
          description: "Memorable birthday celebrations for all ages",
          organizerId,
        },
      ];

      for (const eventType of sampleEventTypes) {
        const docRef = doc(collection(db, "eventTypes"));
        await setDoc(docRef, {
          ...eventType,
          createdAt: serverTimestamp(),
        });
        eventTypeIds.push(docRef.id);
      }

      // Create sample event packages
      const sampleEventPackages = [
        {
          title: "Elegant Wedding Package",
          eventTypeId: eventTypeIds[0],
          description:
            "Complete wedding planning service including venue selection, catering, decoration, and day-of coordination.",
          price: 5000,
          location: "Various Venues",
          organizerId,
          status: "Active",
          imageUrl:
            "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        },
        {
          title: "Corporate Conference Package",
          eventTypeId: eventTypeIds[1],
          description:
            "Professional conference planning including venue, AV equipment, catering, and registration management.",
          price: 3500,
          location: "Downtown Conference Center",
          organizerId,
          status: "Active",
          imageUrl:
            "https://images.unsplash.com/photo-1540317580384-e5d43867caa6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        },
        {
          title: "Kids Birthday Party",
          eventTypeId: eventTypeIds[2],
          description:
            "Fun-filled birthday party planning with themes, activities, decorations, and catering.",
          price: 800,
          location: "Party Zone",
          organizerId,
          status: "Active",
          imageUrl:
            "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        },
      ];

      for (const eventPackage of sampleEventPackages) {
        const docRef = doc(collection(db, "eventPackages"));
        await setDoc(docRef, {
          ...eventPackage,
          createdAt: serverTimestamp(),
        });
      }

      console.log("Sample data created successfully");
    } catch (error) {
      console.error("Error creating sample data:", error);
    }
  };

  // Event Type CRUD operations
  const addEventType = async (eventType) => {
    try {
      if (!currentUser) {
        throw new Error("You must be logged in to add an event type");
      }

      // Create a new document reference
      const newEventTypeRef = doc(collection(db, "eventTypes"));

      // Prepare the event type data
      const newEventType = {
        ...eventType,
        organizerId: currentUser.id,
        createdAt: serverTimestamp(),
      };

      // Save to Firestore
      await setDoc(newEventTypeRef, newEventType);

      // Create a local version with formatted dates
      const createdEventType = {
        id: newEventTypeRef.id,
        ...newEventType,
        createdAt: new Date().toISOString(),
      };

      // No need to update local state as the onSnapshot listener will handle it
      toast.success("Event type added successfully");
      return createdEventType;
    } catch (error) {
      console.error("Add event type error:", error);
      toast.error(error.message || "Failed to add event type");
      return null;
    }
  };

  const updateEventType = async (id, updatedEventType) => {
    try {
      if (!id) {
        throw new Error("Invalid event type ID");
      }

      const eventTypeRef = doc(db, "eventTypes", id);
      await updateDoc(eventTypeRef, updatedEventType);

      // No need to update local state as the onSnapshot listener will handle it
      toast.success("Event type updated successfully");
      return true;
    } catch (error) {
      console.error("Update event type error:", error);
      toast.error("Failed to update event type");
      return false;
    }
  };

  const deleteEventType = async (id) => {
    try {
      if (!id) {
        throw new Error("Invalid event type ID");
      }

      // Check if any packages use this event type
      const packagesQuery = query(
        collection(db, "eventPackages"),
        where("eventTypeId", "==", id)
      );
      const packagesSnapshot = await getDocs(packagesQuery);

      if (!packagesSnapshot.empty) {
        toast.error("Cannot delete event type that has packages");
        return false;
      }

      await deleteDoc(doc(db, "eventTypes", id));

      // No need to update local state as the onSnapshot listener will handle it
      toast.success("Event type deleted successfully");
      return true;
    } catch (error) {
      console.error("Delete event type error:", error);
      toast.error("Failed to delete event type");
      return false;
    }
  };

  const getEventTypeById = async (id) => {
    try {
      if (!id) {
        console.error("Invalid event type ID");
        return null;
      }

      // First check if it's in the state
      const typeFromState = Array.isArray(eventTypes)
        ? eventTypes.find((type) => type.id === id)
        : null;
      if (typeFromState) return typeFromState;

      const eventTypeDoc = await getDoc(doc(db, "eventTypes", id));
      if (eventTypeDoc.exists()) {
        return {
          id: eventTypeDoc.id,
          ...eventTypeDoc.data(),
        };
      }
      return null;
    } catch (error) {
      console.error("Get event type error:", error);
      return null;
    }
  };

  const getEventTypesByOrganizer = (organizerId) => {
    if (!organizerId || !Array.isArray(eventTypes)) return [];
    return eventTypes.filter(
      (eventType) => eventType.organizerId === organizerId
    );
  };

  // Event Package CRUD operations
  const addEventPackage = async (eventPackage) => {
    try {
      if (!currentUser) {
        throw new Error("You must be logged in to add an event package");
      }

      const newEventPackageRef = doc(collection(db, "eventPackages"));
      const newEventPackage = {
        ...eventPackage,
        organizerId: currentUser.id,
        status: "Active",
        createdAt: serverTimestamp(),
      };

      await setDoc(newEventPackageRef, newEventPackage);

      const createdEventPackage = {
        id: newEventPackageRef.id,
        ...newEventPackage,
        createdAt: new Date().toISOString(),
      };

      // No need to update local state as the onSnapshot listener will handle it
      toast.success("Event package added successfully");
      return createdEventPackage;
    } catch (error) {
      console.error("Add event package error:", error);
      toast.error(error.message || "Failed to add event package");
      return null;
    }
  };

  const updateEventPackage = async (id, updatedEventPackage) => {
    try {
      if (!id) {
        throw new Error("Invalid package ID");
      }

      const eventPackageRef = doc(db, "eventPackages", id);
      await updateDoc(eventPackageRef, updatedEventPackage);

      // No need to update local state as the onSnapshot listener will handle it
      toast.success("Event package updated successfully");
      return true;
    } catch (error) {
      console.error("Update event package error:", error);
      toast.error("Failed to update event package");
      return false;
    }
  };

  const deleteEventPackage = async (id) => {
    try {
      if (!id) {
        throw new Error("Invalid package ID");
      }

      // Check if any requests use this package
      const requestsQuery = query(
        collection(db, "eventRequests"),
        where("packageId", "==", id)
      );
      const requestsSnapshot = await getDocs(requestsQuery);

      if (!requestsSnapshot.empty) {
        toast.error("Cannot delete package that has requests");
        return false;
      }

      await deleteDoc(doc(db, "eventPackages", id));

      // No need to update local state as the onSnapshot listener will handle it
      toast.success("Event package deleted successfully");
      return true;
    } catch (error) {
      console.error("Delete event package error:", error);
      toast.error("Failed to delete event package");
      return false;
    }
  };

  const getEventPackageById = async (id) => {
    try {
      if (!id) {
        console.error("Invalid package ID");
        return null;
      }

      // First check if it's in the state
      const packageFromState = Array.isArray(eventPackages)
        ? eventPackages.find((pkg) => pkg.id === id)
        : null;
      if (packageFromState) return packageFromState;

      // If not in state, fetch from Firestore
      const packageDoc = await getDoc(doc(db, "eventPackages", id));
      if (packageDoc.exists()) {
        return {
          id: packageDoc.id,
          ...packageDoc.data(),
        };
      }
      return null;
    } catch (error) {
      console.error("Get event package error:", error);
      return null;
    }
  };

  const getEventPackagesByType = (eventTypeId) => {
    if (!eventTypeId || !Array.isArray(eventPackages)) return [];
    return eventPackages.filter(
      (eventPackage) => eventPackage.eventTypeId === eventTypeId
    );
  };

  const getEventPackagesByOrganizer = (organizerId) => {
    if (!organizerId || !Array.isArray(eventPackages)) return [];
    return eventPackages.filter(
      (eventPackage) => eventPackage.organizerId === organizerId
    );
  };

  // Event Request operations
  const createEventRequest = async (requestData) => {
    try {
      if (!currentUser) {
        throw new Error("You must be logged in to create a request");
      }

      // Validate required fields
      if (
        !requestData.packageId ||
        !requestData.organizerId ||
        !requestData.eventDate
      ) {
        throw new Error("Missing required fields for event request");
      }

      // Create a new document reference
      const newRequestRef = doc(collection(db, "eventRequests"));

      // Prepare the request data
      const newRequest = {
        ...requestData,
        requesterId: currentUser.id,
        requestDate: serverTimestamp(),
        status: "Pending",
        feedback: null,
      };

      // Save to Firestore
      await setDoc(newRequestRef, newRequest);

      // Create a local version with formatted dates
      const createdRequest = {
        id: newRequestRef.id,
        ...newRequest,
        requestDate: new Date().toISOString(),
        eventDate: requestData.eventDate.toDate().toISOString(),
      };

      // No need to update local state as the onSnapshot listener will handle it
      toast.success("Event request submitted successfully");

      return createdRequest;
    } catch (error) {
      console.error("Create event request error:", error);
      toast.error(error.message || "Failed to submit event request");
      return null;
    }
  };

  const updateEventRequest = async (id, updatedData) => {
    try {
      if (!id) {
        throw new Error("Invalid request ID");
      }

      const requestRef = doc(db, "eventRequests", id);
      await updateDoc(requestRef, updatedData);

      // No need to update local state as the onSnapshot listener will handle it
      toast.success("Event request updated successfully");
      return true;
    } catch (error) {
      console.error("Update event request error:", error);
      toast.error("Failed to update event request");
      return false;
    }
  };

  const updateEventRequestStatus = async (id, newStatus) => {
    try {
      if (!id) {
        throw new Error("Invalid request ID");
      }

      const requestRef = doc(db, "eventRequests", id);
      await updateDoc(requestRef, { status: newStatus });

      // No need to update local state as the onSnapshot listener will handle it
      toast.success(`Request status updated to ${newStatus}`);
      return true;
    } catch (error) {
      console.error("Update request status error:", error);
      toast.error("Failed to update request status");
      return false;
    }
  };

  const addFeedback = async (requestId, feedbackData) => {
    try {
      if (!requestId) {
        throw new Error("Invalid request ID");
      }

      const requestRef = doc(db, "eventRequests", requestId);
      await updateDoc(requestRef, { feedback: feedbackData });

      // Get the request to update organizer's rating
      const request = eventRequests.find((req) => req.id === requestId);
      if (request) {
        try {
          // Get the organizer
          const organizerRef = doc(db, "users", request.organizerId);
          const organizerDoc = await getDoc(organizerRef);

          if (organizerDoc.exists()) {
            const organizer = organizerDoc.data();
            const currentRating = organizer.rating || 0;
            const currentReviewCount = organizer.reviewCount || 0;

            // Calculate new rating
            const newRating =
              (currentRating * currentReviewCount + feedbackData.rating) /
              (currentReviewCount + 1);
            const newReviewCount = currentReviewCount + 1;

            // Update organizer's rating
            await updateDoc(organizerRef, {
              rating: newRating,
              reviewCount: newReviewCount,
            });
          }
        } catch (error) {
          console.error("Error updating organizer rating:", error);
          // Continue with feedback submission even if rating update fails
        }
      }

      // No need to update local state as the onSnapshot listener will handle it
      toast.success("Feedback submitted successfully");
      return true;
    } catch (error) {
      console.error("Add feedback error:", error);
      toast.error("Failed to submit feedback");
      return false;
    }
  };

  const getEventRequestById = async (id) => {
    try {
      if (!id) {
        console.error("Invalid request ID");
        return null;
      }

      // First check if it's in the state
      const requestFromState = Array.isArray(eventRequests)
        ? eventRequests.find((req) => req.id === id)
        : null;
      if (requestFromState) return requestFromState;

      // If not in state, fetch from Firestore
      const requestDoc = await getDoc(doc(db, "eventRequests", id));
      if (requestDoc.exists()) {
        const data = requestDoc.data();
        return {
          id: requestDoc.id,
          ...data,
          requestDate:
            data.requestDate?.toDate?.()?.toISOString() ||
            new Date().toISOString(),
          eventDate:
            data.eventDate?.toDate?.()?.toISOString() ||
            new Date().toISOString(),
        };
      }
      return null;
    } catch (error) {
      console.error("Get event request error:", error);
      return null;
    }
  };

  const getEventRequestsByRequester = (requesterId) => {
    if (!requesterId || !Array.isArray(eventRequests)) return [];
    return eventRequests.filter(
      (request) => request.requesterId === requesterId
    );
  };

  const getEventRequestsByOrganizer = (organizerId) => {
    if (!organizerId || !Array.isArray(eventRequests)) return [];
    return eventRequests.filter(
      (request) => request.organizerId === organizerId
    );
  };

  // Context value
  const value = {
    // Event Types
    eventTypes,
    addEventType,
    updateEventType,
    deleteEventType,
    getEventTypeById,
    getEventTypesByOrganizer,

    // Event Packages
    eventPackages,
    addEventPackage,
    updateEventPackage,
    deleteEventPackage,
    getEventPackageById,
    getEventPackagesByType,
    getEventPackagesByOrganizer,

    // Event Requests
    eventRequests,
    createEventRequest,
    updateEventRequest,
    updateEventRequestStatus,
    addFeedback,
    getEventRequestById,
    getEventRequestsByRequester,
    getEventRequestsByOrganizer,

    // Loading state
    loading,
    error,

    // Organizer
    getOrganizerById,
  };

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
};
