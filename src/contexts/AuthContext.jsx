import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile as firebaseUpdateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  updateDoc
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in (from Firebase Auth)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Get additional user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setCurrentUser({
              id: user.uid,
              email: user.email,
              ...userData
            });
            setIsAuthenticated(true);
          } else {
            // If user exists in Auth but not in Firestore, sign them out
            await signOut(auth);
            setCurrentUser(null);
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Handle error gracefully
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      // Try to sign in with provided credentials
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          // Set current user and authentication state
          setCurrentUser({
            id: user.uid,
            email: user.email,
            ...userData
          });
          setIsAuthenticated(true);
          
          // Show success message
          toast.success('Login successful!');
          
          // Redirect based on role
          if (userData.role === 'organizer') {
            navigate('/organizer');
          } else {
            navigate('/requester');
          }
          
          return true;
        } else {
          // If user exists in Auth but not in Firestore, sign them out
          await signOut(auth);
          toast.error('User account not found in database');
          return false;
        }
      } catch (error) {
        console.error('Login error:', error);
       
      }
    } catch (error) {
      console.error('Login process error:', error);
      toast.error('An unexpected error occurred. Please try again.');
      return false;
    }
  };

  // Register organizer function
  const registerOrganizer = async (userData) => {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const user = userCredential.user;
      
      // Update display name
      await firebaseUpdateProfile(user, {
        displayName: userData.username
      });
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        username: userData.username,
        organizationName: userData.organizationName,
        mobileNumber: userData.mobileNumber,
        role: 'organizer',
        rating: 0,
        reviewCount: 0,
        createdAt: new Date()
      });
      
      toast.success('Registration successful! Please log in.');
      navigate('/login');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed');
      return false;
    }
  };

  // Register requester function
  const registerRequester = async (userData) => {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const user = userCredential.user;
      
      // Update display name
      await firebaseUpdateProfile(user, {
        displayName: userData.name
      });
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: userData.name,
        position: userData.position || '',
        role: 'requester',
        createdAt: new Date()
      });
      
      toast.success('Registration successful! Please log in.');
      navigate('/login');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed');
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  // Update user profile
  const updateProfile = async (updatedData) => {
    try {
      if (!currentUser || !currentUser.id) {
        throw new Error('No authenticated user found');
      }
      
      // Update user document in Firestore
      const userRef = doc(db, 'users', currentUser.id);
      await updateDoc(userRef, updatedData);
      
      // Update local state
      const updatedUser = { ...currentUser, ...updatedData };
      setCurrentUser(updatedUser);
      
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile');
      return false;
    }
  };

  // Get all organizers (for directory)
  const getAllOrganizers = async () => {
    try {
      const organizersQuery = query(
        collection(db, 'users'),
        where('role', '==', 'organizer')
      );
      
      const querySnapshot = await getDocs(organizersQuery);
      const organizers = [];
      
      querySnapshot.forEach((doc) => {
        const organizerData = doc.data();
        organizers.push({
          id: doc.id,
          ...organizerData
        });
      });
      
      return organizers.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } catch (error) {
      console.error('Get organizers error:', error);
      toast.error('Failed to fetch organizers');
      return [];
    }
  };

  // Get organizer by ID
  const getOrganizerById = async (id) => {
    try {
      if (!id) {
        console.error('Invalid organizer ID');
        return null;
      }
      
      const organizerDoc = await getDoc(doc(db, 'users', id));
      
      if (organizerDoc.exists() && organizerDoc.data().role === 'organizer') {
        return {
          id: organizerDoc.id,
          ...organizerDoc.data()
        };
      }
      
      return null;
    } catch (error) {
      console.error('Get organizer error:', error);
      toast.error('Failed to fetch organizer details');
      return null;
    }
  };

  // Context value
  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    registerOrganizer,
    registerRequester,
    logout,
    updateProfile,
    getAllOrganizers,
    getOrganizerById
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};