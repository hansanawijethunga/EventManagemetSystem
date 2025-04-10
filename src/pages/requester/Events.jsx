import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {useAuth} from '../../contexts/AuthContext';
import {FiStar, FiSearch, FiMapPin, FiDollarSign} from 'react-icons/fi';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import {useEvent} from "../../contexts/EventContext.jsx";

const Events = () => {
    const {getAllOrganizers} = useAuth();
    const {getAllEventPackages} = useEvent();
    const [allPackages, setAllPackages] = useState([]);
    const [organizers, setOrganizers] = useState([]);
    const [packages, setPackages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPackages, setFilteredPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                setLoading(true);
                setError(null);
                const packages = await getAllEventPackages();
                const allOrganizers = await getAllOrganizers();
                // Ensure we have an array
                const organizersArray = Array.isArray(allOrganizers) ? allOrganizers : [];
                const uniquePackages = packages.filter(
                    (pkg, index, self) =>
                        index === self.findIndex((p) => p.title === pkg.title)
                );
                setOrganizers(organizersArray);
                setAllPackages(uniquePackages);
                setFilteredPackages(uniquePackages);
            } catch (error) {
                console.error("Error fetching Events:", error);
                setError("Failed to load Events");
                setPackages([]);
                setFilteredPackages([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPackages();
    }, [getAllEventPackages]);
    // Handle search
    useEffect(() => {
        if (!Array.isArray(allPackages)) {
            setFilteredPackages([]);
            return;
        }

        if (searchTerm.trim() === '') {
            setFilteredPackages(allPackages);
        } else {
            const filtered = allPackages.filter(
                (packages) =>
                    (packages.title?.toLowerCase() || '').includes(searchTerm.toLowerCase())
            );
            setFilteredPackages(filtered);
        }
    }, [searchTerm, packages]);


    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Events</h1>

            {/* Search Bar */}
            <div className="mb-8">
                <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="h-5 w-5 text-gray-400"/>
                    </div>
                    <input
                        type="text"
                        className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md py-3"
                        placeholder="Search organizers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Error Message */}
            <ErrorMessage error={error}/>

            {/* Loading State */}
            {loading && <LoadingSpinner message="Loading organizers..."/>}

            {/* Organizers Grid */}
            {!loading && Array.isArray(filteredPackages) && filteredPackages.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No Events found matching your search.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.isArray(filteredPackages) && filteredPackages.map((packages) => (
                            <Link
                                key={packages.id}
                                to={`/requester/requests/new?packageId=${packages.id}&organizerId=${packages.organizerId}`}
                                className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                            >
                                <div className="p-6">
                                    {packages.imageUrl && (
                                        <div className="mb-4">
                                            <img
                                                src={packages.imageUrl}
                                                alt={packages.title || "Event Package"}
                                                className="w-full h-48 object-cover rounded-md"
                                            />
                                        </div>
                                    )}

                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        {packages.title || "Unnamed Package"}
                                    </h3>

                                    <div className="flex items-center text-sm text-gray-600 mb-2">
                                        <FiMapPin className="mr-2 text-gray-400"/>
                                        {packages.location || "Location not specified"}
                                    </div>

                                    <div className="flex items-center text-sm text-gray-600 mb-4">
                                        <FiDollarSign className="mr-2 text-gray-400"/>
                                        LKR {(packages.price || 0).toLocaleString()}
                                    </div>

                                    <p className="text-gray-600 mb-4">
                                        {packages.description || "No description available"}
                                    </p>
                                    <div className="border-t border-gray-200 pt-4 mt-4">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                                            Organizer
                                        </h4>
                                        {organizers
                                            .filter((organizer) => organizer.id === packages.organizerId)
                                            .map((organiz) => (
                                                <div key={organiz.id}
                                                     className={'flex justify-between flex-col lg:flex-row'}>
                                                    <div className={'pb-4 lg:pb-0'}>
                                                        <p className="font-medium">
                                                            {organiz.organizationName || "Organization"}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            {organiz.email || "No email provided"}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">
                                                            Contact
                                                        </p>
                                                        <p className="font-medium">
                                                            {organiz.mobileNumber || "Not Available"}
                                                        </p>
                                                    </div>

                                                </div>
                                            ))}

                                    </div>
                                </div>
                            </Link>
                            // <Link
                            //     key={packages.id}
                            //     to={`/organizers/${packages.id}`}
                            //     className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                            // >

                        )
                    )}
                </div>
            )}
        </div>
    )
        ;
};

export default Events;