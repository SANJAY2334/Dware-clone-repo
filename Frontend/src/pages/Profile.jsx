import React, { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch("https://dwareautomator.mresult.com/api/users/GetUserDetail", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user details");

        const result = await response.json();
        setUser(result[0]);
        setFormData(result[0]); // set initial form values
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [token]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("https://dwareautomator.mresult.com/api/users/updateProfile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          emailID: formData.emailID,
          firstName: formData.firstName,
          lastName: formData.lastName,
          roleDisplayName: formData.roleDisplayName
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const result = await response.json();
      setUser(formData); // update UI
      setEditMode(false);
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage("Error updating profile");
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">User Profile</h2>

      {user ? (
        <div className="space-y-4 text-gray-700">
          {editMode ? (
            <>
              <div>
                <label className="block text-sm font-medium">First Name</label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Last Name</label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  name="emailID"
                  value={formData.emailID}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Role</label>
                <input
                  name="roleDisplayName"
                  value={formData.roleDisplayName}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={handleUpdate}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <p><strong>First Name:</strong> {user.firstName}</p>
              <p><strong>Last Name:</strong> {user.lastName}</p>
              <p><strong>Email:</strong> {user.emailID}</p>
              <p><strong>Role:</strong> {user.roleDisplayName}</p>
              <button
                onClick={() => setEditMode(true)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Edit Profile
              </button>
            </>
          )}

          {message && (
            <p className={`mt-4 ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
              {message}
            </p>
          )}
        </div>
      ) : (
        <p className="text-gray-500">Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
