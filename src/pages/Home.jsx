import { Link } from 'react-router-dom';
import { FiCalendar, FiUsers, FiCheckCircle } from 'react-icons/fi';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Plan Your Perfect Event with EventHub
              </h1>
              <p className="text-xl mb-8">
                Connect with top event organizers and create memorable experiences.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/organizers"
                  className="btn bg-white text-primary-700 hover:bg-gray-100 px-6 py-3 rounded-md font-medium"
                >
                  Find Organizers
                </Link>
                <Link
                  to="/register"
                  className="btn bg-primary-700 text-white border border-white hover:bg-primary-800 px-6 py-3 rounded-md font-medium"
                >
                  Get Started
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80"
                alt="Event Planning"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary-800 mb-4">
              Why Choose EventHub?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make event planning simple, efficient, and enjoyable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiUsers className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-3">
                Top Event Organizers
              </h3>
              <p className="text-gray-600">
                Connect with experienced event organizers who have been vetted and rated by clients.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiCalendar className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-3">
                Streamlined Planning
              </h3>
              <p className="text-gray-600">
                Our platform simplifies the event planning process from request to execution.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiCheckCircle className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-3">
                Real-Time Updates
              </h3>
              <p className="text-gray-600">
                Track your event's progress with real-time updates and communication.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Event Types Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary-800 mb-4">
              Events We Help You Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From intimate gatherings to large corporate events, we've got you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Event Type 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80"
                alt="Wedding"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-secondary-800 mb-2">Weddings</h3>
                <p className="text-gray-600 mb-4">
                  Create the perfect day with our experienced wedding planners.
                </p>
                <Link to="/organizers" className="text-primary-600 font-medium hover:text-primary-700">
                  Find Wedding Planners →
                </Link>
              </div>
            </div>

            {/* Event Type 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img
                src="https://images.unsplash.com/photo-1540317580384-e5d43867caa6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Corporate Event"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-secondary-800 mb-2">Corporate Events</h3>
                <p className="text-gray-600 mb-4">
                  Professional planning for conferences, meetings, and team-building events.
                </p>
                <Link to="/organizers" className="text-primary-600 font-medium hover:text-primary-700">
                  Find Corporate Planners →
                </Link>
              </div>
            </div>

            {/* Event Type 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img
                src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Birthday Party"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-secondary-800 mb-2">Birthday Parties</h3>
                <p className="text-gray-600 mb-4">
                  Celebrate in style with custom birthday party planning.
                </p>
                <Link to="/organizers" className="text-primary-600 font-medium hover:text-primary-700">
                  Find Party Planners →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Plan Your Next Event?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join EventHub today and connect with top event organizers in your area.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/register"
              className="btn bg-white text-primary-700 hover:bg-gray-100 px-6 py-3 rounded-md font-medium"
            >
              Sign Up Now
            </Link>
            <Link
              to="/organizers"
              className="btn bg-transparent text-white border border-white hover:bg-primary-800 px-6 py-3 rounded-md font-medium"
            >
              Browse Organizers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;