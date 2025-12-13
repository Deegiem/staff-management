// // components/Navbar.tsx
// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { useAuth } from '@/contexts/AuthContext';
// import { navigationConfig, NavItem } from '@/config/navigation';

// export default function Navbar() {
//   const { user, logout } = useAuth();
//   const pathname = usePathname();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [openDropdown, setOpenDropdown] = useState<string | null>(null);

//   if (!user) return null;

//   // Filter navigation items based on user role
//   const filteredNavItems = navigationConfig.filter((item) =>
//     item.roles.includes(user.role)
//   );

//   // Check if item is active
//   const isActive = (href: string) => {
//     if (href === '/dashboard') {
//       return pathname === '/dashboard';
//     }
//     return pathname.startsWith(href);
//   };

//   // Render navigation item
//   const renderNavItem = (item: NavItem) => {
//     const active = isActive(item.href);
    
//     if (item.children) {
//       return (
//         <div key={item.label} className="relative">
//           <button
//             onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
//             className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
//               active
//                 ? 'bg-blue-100 text-blue-700'
//                 : 'text-gray-700 hover:bg-gray-100'
//             }`}
//           >
//             {item.icon}
//             <span>{item.label}</span>
//             <svg
//               className={`w-4 h-4 transition-transform ${
//                 openDropdown === item.label ? 'rotate-180' : ''
//               }`}
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//             </svg>
//           </button>
          
//           {openDropdown === item.label && (
//             <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
//               {item.children
//                 .filter(child => child.roles.includes(user.role))
//                 .map((child) => (
//                   <Link
//                     key={child.href}
//                     href={child.href}
//                     onClick={() => setOpenDropdown(null)}
//                     className={`block px-4 py-2 text-sm ${
//                       pathname === child.href
//                         ? 'bg-blue-50 text-blue-700'
//                         : 'text-gray-700 hover:bg-gray-50'
//                     }`}
//                   >
//                     {child.label}
//                   </Link>
//                 ))}
//             </div>
//           )}
//         </div>
//       );
//     }

//     return (
//       <Link
//         key={item.href}
//         href={item.href}
//         className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
//           active
//             ? 'bg-blue-100 text-blue-700 font-medium'
//             : 'text-gray-700 hover:bg-gray-100'
//         }`}
//       >
//         {item.icon}
//         <span>{item.label}</span>
//       </Link>
//     );
//   };

//   return (
//     <nav className="bg-white border-b border-gray-200 shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           {/* Logo and Brand */}
//           <div className="flex items-center">
//             <Link href="/dashboard" className="flex items-center gap-2">
//               <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
//                 <span className="text-white font-bold text-sm">SM</span>
//               </div>
//               <span className="text-xl font-bold text-gray-900 hidden md:inline">
//                 Staff Manager
//               </span>
//             </Link>
            
//             {/* Desktop Navigation */}
//             <div className="hidden md:flex items-center space-x-1 ml-8">
//               {filteredNavItems.map(renderNavItem)}
//             </div>
//           </div>

//           {/* User Profile & Mobile Menu */}
//           <div className="flex items-center gap-4">
//             {/* User Info */}
//             <div className="hidden md:flex items-center gap-3">
//               <div className="text-right">
//                 <p className="text-sm font-medium text-gray-900">
//                   {user.firstName} {user.lastName}
//                 </p>
//                 <p className="text-xs text-gray-500 capitalize">
//                   {user.role.toLowerCase()}
//                 </p>
//               </div>
              
//               {/* User Avatar */}
//               <div className="relative">
//                 <div className="h-9 w-9 bg-blue-100 rounded-full flex items-center justify-center">
//                   <span className="text-blue-700 font-medium text-sm">
//                     {user.firstName[0]}{user.lastName[0]}
//                   </span>
//                 </div>
                
//                 {/* User Dropdown */}
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 hidden group-hover:block">
//                   <Link
//                     href="/profile"
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                   >
//                     My Profile
//                   </Link>
//                   <Link
//                     href="/profile/edit"
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                   >
//                     Edit Profile
//                   </Link>
//                   <Link
//                     href="/profile/change-password"
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                   >
//                     Change Password
//                   </Link>
//                   <div className="border-t border-gray-200 my-1"></div>
//                   <button
//                     onClick={logout}
//                     className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Mobile Menu Button */}
//             <button
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
//             >
//               {isMobileMenuOpen ? (
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               ) : (
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                 </svg>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {isMobileMenuOpen && (
//           <div className="md:hidden border-t border-gray-200 py-4">
//             {/* Mobile Navigation */}
//             <div className="space-y-1">
//               {filteredNavItems.map((item) => (
//                 <div key={item.label}>
//                   {item.children ? (
//                     <>
//                       <div className="px-3 py-2 text-sm font-medium text-gray-900">
//                         {item.label}
//                       </div>
//                       {item.children
//                         .filter(child => child.roles.includes(user.role))
//                         .map((child) => (
//                           <Link
//                             key={child.href}
//                             href={child.href}
//                             onClick={() => setIsMobileMenuOpen(false)}
//                             className="block pl-6 pr-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
//                           >
//                             {child.label}
//                           </Link>
//                         ))}
//                     </>
//                   ) : (
//                     <Link
//                       href={item.href}
//                       onClick={() => setIsMobileMenuOpen(false)}
//                       className={`block px-3 py-2 rounded-lg ${
//                         isActive(item.href)
//                           ? 'bg-blue-100 text-blue-700 font-medium'
//                           : 'text-gray-700 hover:bg-gray-100'
//                       }`}
//                     >
//                       {item.label}
//                     </Link>
//                   )}
//                 </div>
//               ))}
//             </div>

//             {/* Mobile User Info */}
//             <div className="mt-6 pt-6 border-t border-gray-200">
//               <div className="flex items-center gap-3 px-3">
//                 <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
//                   <span className="text-blue-700 font-medium">
//                     {user.firstName[0]}{user.lastName[0]}
//                   </span>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-900">
//                     {user.firstName} {user.lastName}
//                   </p>
//                   <p className="text-xs text-gray-500 capitalize">
//                     {user.role.toLowerCase()}
//                   </p>
//                 </div>
//               </div>
              
//               <div className="mt-4 space-y-1">
//                 <Link
//                   href="/profile"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                   className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
//                 >
//                   My Profile
//                 </Link>
//                 <button
//                   onClick={() => {
//                     logout();
//                     setIsMobileMenuOpen(false);
//                   }}
//                   className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-lg"
//                 >
//                   Logout
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }