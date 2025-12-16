"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

interface StaffData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: {
    name: string;
  };
  department: {
    name: string;
  };
  status: string;
  profilePhoto?: string;
}

export default function DashboardPage() {
  const [staffData, setStaffData] = useState<StaffData | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({ profilePhoto: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // ✅ IMPROVED: Added error handling and cleanup
  useEffect(() => {
    const checkTokenExpiry = () => {
      try {
        const cookies = document.cookie.split(';');
        const accessToken = cookies.find(c => c.includes('access_token'))?.split('=')[1];

        if (accessToken) {
          const payload = JSON.parse(atob(accessToken.split('.')[1]));
          const expiry = new Date(payload.exp * 1000);
          const now = new Date();
          const timeLeft = Math.round((expiry.getTime() - now.getTime()) / 1000 / 60);

          console.log('Access token expires in:', timeLeft, 'minutes');
          console.log('Expires at:', expiry.toLocaleString());
        }
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    };

    checkTokenExpiry();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select a valid image file (JPG, PNG, GIF)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image size should be less than 5MB");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataUrl = reader.result as string;
        setFormData((prev) => ({ ...prev, profilePhoto: dataUrl }));

        try {
          const response = await fetch("/api/staff/me", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ profilePhoto: dataUrl }),
          });

          const result = await response.json();

          if (response.ok && result.success) {
            fetchStaffData();
            setMessage("Profile photo updated successfully!");
          } else {
            setMessage(result.error || "Failed to update profile photo");
          }
        } catch {
          setMessage("Error updating profile photo");
        }

        setUploading(false);
      };

      reader.onerror = () => {
        setMessage("Failed to read image file");
        setUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      setMessage("Failed to upload image");
      setUploading(false);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const removeProfilePhoto = async () => {
    setMessage("");
    try {
      const response = await fetch("/api/staff/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ profilePhoto: "" }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setFormData((prev) => ({ ...prev, profilePhoto: "" }));
        fetchStaffData();
        setMessage("Profile photo removed successfully!");
      } else {
        setMessage(result.error || "Failed to remove profile photo");
      }
    } catch {
      setMessage("Error removing profile photo");
    }
  };

  const fetchStaffData = async () => {
    try {
      setIsLoading(true);
      setMessage("");
      const res = await fetch("/api/staff/me", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage(data.error || "Unauthorized - Please login again");
        setStaffData(null);
      } else {
        setStaffData(data.data);
        setFormData((prev) => ({
          ...prev,
          profilePhoto: data.data.profilePhoto || "",
        }));
        setMessage("");
      }
    } catch {
      setMessage("Error fetching staff data - Please check your connection");
      setStaffData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setMessage("");
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      setMessage(data.message || "Logged out successfully");
      setStaffData(null);

      setTimeout(() => router.push("/auth/login"), 1000);
    } catch {
      setMessage("Error during logout");
    }
  };

  const handleLogin = () => router.push("/auth/login");

  useEffect(() => {
    fetchStaffData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <Card className="p-8 shadow-lg max-w-sm w-full text-center">
          <Loader2 className="animate-spin h-10 w-10 text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-2xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-green-700 text-2xl font-bold text-center">
            Dashboard
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {message && (
            <Alert
              className={`${message.includes("Error") || message.includes("Unauthorized") || message.includes("Failed")
                ? "bg-red-100 border-red-300 text-red-700"
                : "bg-green-100 border-green-300 text-green-700"
                }`}
            >
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {staffData ? (
            <>
              {/* Profile Section */}
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <Avatar className="size-32 border-2 border-green-200">
                    <AvatarImage
                      width={500}
                      height={500}
                      className="size-32 object-cover"
                      src={staffData.profilePhoto || ""}
                      alt={`${staffData.firstName} ${staffData.lastName}`}
                    />
                    <AvatarFallback className="bg-green-100 text-green-700 font-semibold">
                      {staffData.firstName[0]}
                      {staffData.lastName[0]}
                    </AvatarFallback>
                  </Avatar>

                  {/* Hover overlay */}
                  {/* <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={triggerFileInput}
                      disabled={uploading}
                      className="text-xs"
                    >
                      {uploading ? "..." : "Change"}
                    </Button>
                  </div> */}

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {staffData.firstName} {staffData.lastName}
                  </h2>
                  <p className="text-sm text-gray-500">{staffData.email}</p>
                </div>
              </div>

              {/* Photo Action Buttons */}
              <div className="flex justify-start gap-2 ml-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={triggerFileInput}
                  disabled={uploading}
                  className="h-9"
                >
                  {uploading ? "Uploading..." : "Change Photo"}
                </Button>

                {staffData.profilePhoto && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={removeProfilePhoto}
                    className="text-red-600 h-9 hover:bg-red-700 hover:text-white"
                  >
                    Remove
                  </Button>
                )}
              </div>

              <Separator />

              {/* Staff details */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-1">
                  <span className="font-semibold text-green-800">Role:</span>
                  <span className="text-gray-700">{staffData.role.name}</span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="font-semibold text-green-800">Department:</span>
                  <span className="text-gray-700">{staffData.department.name}</span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="font-semibold text-green-800">Status:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${staffData.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                      }`}
                  >
                    {staffData.status}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Quick Actions */}
              <div>
                <h3 className="font-semibold mb-3 text-gray-700">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="h-10"
                    onClick={() => router.push("/profile")}
                  >
                    My Profile
                  </Button>
                  {/* {role.name == "ADMIN"} */}
                  <Button
                    className="bg-green-600 h-10 hover:bg-green-700"
                    onClick={() => router.push("/staff")}
                  >
                    View Staff
                  </Button>
                </div>
              </div>

              <Button
                className="w-full mt-5 h-11 font-semibold bg-red-600 hover:bg-red-700"
                onClick={handleLogout}
                variant="destructive"
              >
                Logout
              </Button>
            </>
          ) : (
            <div className="text-center space-y-4">
              <Avatar className="size-32 mx-auto bg-gray-200">
                <AvatarFallback>👤</AvatarFallback>
              </Avatar>
              <p className="text-gray-600">
                You are not logged in. Please login to access your dashboard.
              </p>

              <Button
                className="w-full h-12 text-md bg-green-600 hover:bg-green-700"
                onClick={handleLogin}
              >
                Login to Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}