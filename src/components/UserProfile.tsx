import { getCurrentUser, isAuthenticated } from "@/lib/auth";

export default async function UserProfile() {
  const user = await getCurrentUser();
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h2 className="text-lg font-semibold text-yellow-800">Not Authenticated</h2>
        <p className="text-yellow-700">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">User Profile</h2>
      <div className="space-y-3">
        <div>
          <span className="font-medium text-gray-700">Email:</span>
          <span className="ml-2 text-gray-900">{user?.email}</span>
        </div>
        {user?.name && (
          <div>
            <span className="font-medium text-gray-700">Name:</span>
            <span className="ml-2 text-gray-900">{user.name}</span>
          </div>
        )}
        {user?.image && (
          <div>
            <span className="font-medium text-gray-700">Profile Image:</span>
            <img 
              src={user.image} 
              alt="Profile" 
              className="ml-2 w-8 h-8 rounded-full inline-block"
            />
          </div>
        )}
      </div>
    </div>
  );
} 