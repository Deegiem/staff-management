// src/app/profile/page.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { useCurrentStaff, staffApi } from '@/hooks/useStaff';
import Image from 'next/image';

export default function ProfilePage() {
  const { staff, isLoading, mutate } = useCurrentStaff();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    profilePhoto: '',
  });

  // ✅ FIXED: Use useEffect instead of useState
  useEffect(() => {
    if (staff) {
      setFormData({
        firstName: staff.firstName,
        lastName: staff.lastName,
        phone: staff.phone || '',
        profilePhoto: staff.profilePhoto || '',
      });
    }
  }, [staff]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await staffApi.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        profilePhoto: formData.profilePhoto || undefined,
      });
      mutate(); // Refresh current staff data
      alert('Profile updated successfully!');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 5MB limit
      alert('Image size should be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      // Convert to base64 for simple storage (for production, use proper file upload)
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setFormData(prev => ({ ...prev, profilePhoto: dataUrl }));
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeProfilePhoto = () => {
    setFormData(prev => ({ ...prev, profilePhoto: '' }));
  };

  if (isLoading) return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2">Loading profile...</span>
    </div>
  );

  if (!staff) return (
    <div className="container mx-auto p-6">
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <h2 className="text-red-800 font-semibold">Error loading profile</h2>
        <p className="text-red-600 text-sm">Please try refreshing the page.</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Current Info Header */}
        <div className="bg-blue-50 px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
          <p className="text-gray-600 text-sm mt-1">
            Update your personal information and profile photo
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Photo Section */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Profile Photo</h3>
                
                <div className="flex flex-col items-center space-y-4">
                  {formData.profilePhoto ? (
                    <div className="relative">
                      <Image
                        width={500}
                        height={500}
                        className="size-44 rounded-full object-cover border-4 border-white shadow"
                        src={formData.profilePhoto}
                        alt={`${formData.firstName} ${formData.lastName}`}
                      />
                    </div>
                  ) : (
                    <div className="h-32 w-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow">
                      {formData.firstName[0]}{formData.lastName[0]}
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      disabled={uploading}
                      className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {uploading ? 'Uploading...' : 'Change Photo'}
                    </button>
                    
                    {formData.profilePhoto && (
                      <button
                        type="button"
                        onClick={removeProfilePhoto}
                        className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  <p className="text-xs text-gray-500 text-center">
                    JPG, PNG or GIF • Max 10MB
                  </p>
                </div>
              </div>

              {/* Read-only Information */}
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Profile Details</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Role</dt>
                    <dd className="text-sm text-gray-900">{staff.role.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Department</dt>
                    <dd className="text-sm text-gray-900">{staff.department.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="text-sm">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        staff.status === 'ACTIVE' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {staff.status}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Employment Type</dt>
                    <dd className="text-sm text-gray-900 capitalize">
                      {staff.employmentType.toLowerCase().replace('_', ' ')}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Date of Hire</dt>
                    <dd className="text-sm text-gray-900">
                      {new Date(staff.dateOfHire).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Edit Form Section */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={staff.email}
                    disabled
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Contact administrator to change email address
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Optional - for contact purposes
                  </p>
                </div>

                <div className="flex justify-end space-x-3 mt-10 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      // Reset form to original values
                      if (staff) {
                        setFormData({
                          firstName: staff.firstName,
                          lastName: staff.lastName,
                          phone: staff.phone || '',
                          profilePhoto: staff.profilePhoto || '',
                        });
                      }
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    disabled={loading || uploading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Updating...' : 'Update Profile'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}