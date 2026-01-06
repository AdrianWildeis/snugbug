import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import { getTranslations } from 'next-intl/server';
import { SearchAndFilters } from '@/components/search/SearchAndFilters';
import { Decimal } from '@prisma/client/runtime/library';

interface SearchParams {
  search?: string;
  category?: string;
  condition?: string;
  location?: string;
  minPrice?: string;
  maxPrice?: string;
  adminNumber?: string;
  adminPlace?: string;
}

async function getListings(searchParams: SearchParams) {
  try {
    const where: any = {
      status: 'active',
    };

    // Search by title or description (and admin fields if provided)
    if (searchParams.search) {
      const searchConditions: any[] = [
        { title: { contains: searchParams.search, mode: 'insensitive' } },
        { description: { contains: searchParams.search, mode: 'insensitive' } },
      ];

      // Admin-only: search in adminNumber and adminPlace
      if (searchParams.adminNumber || searchParams.adminPlace) {
        if (searchParams.adminNumber) {
          searchConditions.push({ adminNumber: { contains: searchParams.search, mode: 'insensitive' } });
        }
        if (searchParams.adminPlace) {
          searchConditions.push({ adminPlace: { contains: searchParams.search, mode: 'insensitive' } });
        }
      }

      where.OR = searchConditions;
    }

    // Admin-only: Filter by adminNumber
    if (searchParams.adminNumber) {
      where.adminNumber = { contains: searchParams.adminNumber, mode: 'insensitive' };
    }

    // Admin-only: Filter by adminPlace
    if (searchParams.adminPlace) {
      where.adminPlace = { contains: searchParams.adminPlace, mode: 'insensitive' };
    }

    // Filter by category
    if (searchParams.category) {
      where.category = searchParams.category;
    }

    // Filter by condition
    if (searchParams.condition) {
      where.condition = searchParams.condition;
    }

    // Filter by location
    if (searchParams.location) {
      where.location = searchParams.location;
    }

    // Filter by price range
    if (searchParams.minPrice || searchParams.maxPrice) {
      where.price = {};
      if (searchParams.minPrice) {
        where.price.gte = new Decimal(searchParams.minPrice);
      }
      if (searchParams.maxPrice) {
        where.price.lte = new Decimal(searchParams.maxPrice);
      }
    }

    const listings = await prisma.listing.findMany({
      where,
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
      take: 50,
    });

    // Convert Decimal to number for client compatibility
    return listings.map(listing => ({
      ...listing,
      price: Number(listing.price),
    }));
  } catch (error) {
    console.error("Error fetching listings:", error);
    return [];
  }
}

interface HomeProps {
  searchParams: Promise<SearchParams>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const session = await auth();
  const listings = await getListings(params);
  const t = await getTranslations('common');

  const hasFilters = params.search || params.category || params.condition || params.location || params.minPrice || params.maxPrice || params.adminNumber || params.adminPlace;

  return (
    <div className="min-h-screen bg-brand-teal-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {hasFilters ? 'Search Results' : 'Latest Listings'}
          </h2>
          <p className="text-gray-600">
            {hasFilters
              ? `Found ${listings.length} listing${listings.length !== 1 ? 's' : ''}`
              : 'Discover gently used baby items from parents in your community'
            }
          </p>
        </div>

        {/* Search and Filters */}
        <SearchAndFilters isAdmin={session?.user?.isAdmin || false} />

        {listings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No listings yet. Be the first to{" "}
              <Link href="/sell" className="text-primary-600 hover:underline">
                sell an item
              </Link>
              !
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/listings/${listing.id}`}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow block"
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
                    <span className="text-lg font-bold text-primary-600 whitespace-nowrap ml-2">
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
                    <span className="text-xs">by {listing.user.name || listing.user.email}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
