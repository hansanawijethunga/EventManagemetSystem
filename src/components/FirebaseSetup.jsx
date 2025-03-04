import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const FirebaseSetup = () => {
  const [isConfigured, setIsConfigured] = useState(false);
  
  useEffect(() => {
    // Check if Firebase config is properly set
    try {
      // Import firebase config dynamically to avoid initialization issues
      import('../firebase/config').then(({ auth, db }) => {
        if (auth && db) {
          setIsConfigured(true);
        } else {
          showConfigError();
        }
      }).catch((error) => {
        console.error("Firebase import error:", error);
        showConfigError();
      });
    } catch (error) {
      console.error("Firebase setup error:", error);
      showConfigError();
    }
  }, []);
  
  const showConfigError = () => {
    toast.error(
      "Firebase configuration is not set up correctly. Please check your Firebase configuration.",
      { duration: 10000 }
    );
  };
  
  if (!isConfigured) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Firebase Configuration Required</h2>
          <p className="text-gray-600 mb-4">
            To use this application, you need to set up your Firebase project and update the configuration.
           </p>
          <ol className="list-decimal pl-5 mb-4 text-gray-600 space-y-2">
            <li>Create a Firebase project at <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">Firebase Console</a></li>
            <li>Enable Authentication with Email/Password</li>
            <li>Create a Firestore database</li>
            <li>Get your Firebase configuration from Project Settings</li>
            <li>Update the configuration in <code className="bg-gray-100 px-2 py-1 rounded">src/firebase/config.js</code></li>
          </ol>
          <p className="text-gray-600">
            After updating the configuration, refresh the page to continue.
          </p>
        </div>
      </div>
    );
  }
  
  return null;
};

export default FirebaseSetup;