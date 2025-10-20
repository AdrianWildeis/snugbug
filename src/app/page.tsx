import { PrismaClient } from "@/generated/prisma";
import Link from "next/link";

const prisma = new PrismaClient();

async function getListings() {
  try {
    const listings = await prisma.listing.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 12,
    });
    return listings;
  } catch (error) {
    console.error("Error fetching listings:", error);
    return [];
  }
}

export default async function Home() {
  const listings = await getListings();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Snugbug</h1>
              <p className="text-gray-600">Baby Marketplace</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/sell"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Sell Item
              </Link>
              <Link
                href="/api/auth/signin"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Latest Listings
          </h2>
          <p className="text-gray-600">
            Discover gently used baby items from parents in your community
          </p>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No listings yet. Be the first to{" "}
              <Link href="/sell" className="text-blue-600 hover:underline">
                sell an item
              </Link>
              !
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={listing.images[0] || "https://placehold.co/400x300?text=No+Image"}
                    alt={listing.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {listing.title}
                    </h3>
                    <span className="text-lg font-bold text-blue-600">
                      CHF {Number(listing.price).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {listing.description}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                      {listing.category}
                    </span>
                    <span>by {listing.user.name || listing.user.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
