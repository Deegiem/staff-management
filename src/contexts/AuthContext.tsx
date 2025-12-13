// // contexts/AuthContext.tsx
// 'use client';

// import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// interface StaffUser {
//   id: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   role: string;
// }

// interface AuthContextType {
//   user: StaffUser | null;
//   loading: boolean;
//   error: string | null;
//   logout: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   loading: true,
//   error: null,
//   logout: async () => {},
// });

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<StaffUser | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     fetchUser();
//   }, []);

//   const fetchUser = async () => {
//     try {
//       const res = await fetch('/api/auth/me', {
//         credentials: 'include',
//       });
      
//       if (res.ok) {
//         const data = await res.json();
//         if (data.success) {
//           setUser(data.data);
//         } else {
//           setError(data.error || 'Failed to fetch user');
//         }
//       } else {
//         setError('Authentication required');
//       }
//     } catch (err) {
//       setError('Network error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     try {
//       await fetch('/api/auth/logout', {
//         method: 'POST',
//         credentials: 'include',
//       });
//       setUser(null);
//       window.location.href = '/login';
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, error, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);