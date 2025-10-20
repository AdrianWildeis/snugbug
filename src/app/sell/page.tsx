import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import CreateListingForm from "@/components/CreateListingForm";

export default async function SellPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Create a New Listing</h1>
              <p className="mt-2 text-gray-600">
                Sell your baby items to other parents in the community
              </p>
            </div>
            
            <CreateListingForm userId={user.id || user.email!} />
          </div>
        </div>
      </div>
    </div>
  );
} 