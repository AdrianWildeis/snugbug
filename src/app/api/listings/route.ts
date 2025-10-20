import { NextRequest, NextResponse } from "next/server";
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { listingSchema } from '@/lib/validations/listing';
import { Decimal } from '@prisma/client/runtime/library';

// POST /api/listings - Create a new listing
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = listingSchema.parse(body);

    // Create listing
    const listing = await prisma.listing.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        price: new Decimal(validatedData.price),
        category: validatedData.category,
        condition: validatedData.condition,
        location: validatedData.location,
        ageRange: validatedData.ageRange || null,
        brand: validatedData.brand || null,
        size: validatedData.size || null,
        images: validatedData.images,
        userId: session.user.id,
        status: 'active',
      },
    });

    // Convert Decimal to number for client compatibility
    const listingWithNumber = {
      ...listing,
      price: Number(listing.price),
    };

    return NextResponse.json(listingWithNumber, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error },
        { status: 400 }
      );
    }

    console.error('Listings POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/listings - Get all active listings (with filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const condition = searchParams.get('condition');
    const location = searchParams.get('location');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');

    const where: any = {
      status: 'active',
    };

    if (category) where.category = category;
    if (condition) where.condition = condition;
    if (location) where.location = location;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = new Decimal(minPrice);
      if (maxPrice) where.price.lte = new Decimal(maxPrice);
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const listings = await prisma.listing.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            location: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });

    // Convert Decimal to number for client compatibility
    const listingsWithNumber = listings.map(listing => ({
      ...listing,
      price: Number(listing.price),
    }));

    return NextResponse.json(listingsWithNumber);
  } catch (error) {
    console.error('Listings GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 