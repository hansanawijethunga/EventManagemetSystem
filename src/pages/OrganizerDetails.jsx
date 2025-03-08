import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEvent } from "../contexts/EventContext";
import {
  FiStar,
  FiCalendar,
  FiMapPin,
  FiDollarSign,
  FiUsers,
} from "react-icons/fi";
import toast from "react-hot-toast";

const OrganizerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrganizerById, isAuthenticated, currentUser } = useAuth();
  const { eventPackages, getEventPackagesByOrganizer } = useEvent();

  const [organizer, setOrganizer] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get organizer details
    const fetchData = async () => {
      try {
        if (!id) {
          setError("Invalid organizer ID");
          setLoading(false);
          return;
        }

        const organizerData = await getOrganizerById(id);
        if (organizerData) {
          setOrganizer(organizerData);

          // Get organizer's packages
          const organizerPackages = getEventPackagesByOrganizer(id);
          setPackages(
            Array.isArray(organizerPackages) ? organizerPackages : []
          );
        } else {
          setError("Organizer not found");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching organizer details:", error);
        setError("Failed to load organizer details");
        setLoading(false);
      }
    };

    fetchData();
  }, [id, getOrganizerById, getEventPackagesByOrganizer]);

  const handleRequestEvent = (packageId) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (currentUser.role !== "requester") {
      toast.error("Only event requesters can request events");
      return;
    }

    navigate(
      `/requester/requests/new?packageId=${packageId}&organizerId=${id}`
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading organizer details...</p>
        </div>
      </div>
    );
  }

  if (error || !organizer) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Organizer Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {error ||
              "The organizer you're looking for doesn't exist or has been removed."}
          </p>
          <Link to="/organizers" className="btn btn-primary">
            Back to Organizers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Organizer Profile */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-10">
        <div className="p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {organizer.organizationName || "Organization"}
              </h1>
              <p className="text-gray-600 mb-4">
                Managed by {organizer.username || "User"}
              </p>

              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(organizer.rating || 0)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {(organizer.rating || 0).toFixed(1)} (
                  {organizer.reviewCount || 0} reviews)
                </span>
              </div>
            </div>

            <div className="mt-4 md:mt-0">
              <Link to="/organizers" className="btn btn-secondary mr-4">
                Back to Organizers
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Contact Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {organizer.email || "No email provided"}
                </div>
                <div className="flex items-center text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  {organizer.mobileNumber || "No phone number provided"}{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Packages */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Available Event Packages
      </h2>

      {!Array.isArray(packages) || packages.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">
            This organizer doesn't have any event packages yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {pkg.imageUrl && (
                <div className="h-48 w-full overflow-hidden">
                  <img
                    src={pkg.imageUrl}
                    alt={pkg.title || "Event Package"}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {pkg.title || "Unnamed Package"}
                </h3>

                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <FiMapPin className="mr-2 text-gray-400" />
                  {pkg.location || "Location not specified"}
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <FiDollarSign className="mr-2 text-gray-400" />
                  LKR {(pkg.price || 0).toLocaleString()}
                </div>

                <p className="text-gray-600 mb-6">
                  {pkg.description || "No description available"}
                </p>

                <button
                  onClick={() => handleRequestEvent(pkg.id)}
                  className="w-full btn btn-primary py-2"
                >
                  Request This Event
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizerDetails;
