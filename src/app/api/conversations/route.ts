import { NextRequest, NextResponse } from "next/server";
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// GET /api/conversations - Get all conversations for current user
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { buyerId: session.user.id },
          { sellerId: session.user.id },
        ],
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            images: true,
            price: true,
            status: true,
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            content: true,
            read: true,
            createdAt: true,
            senderId: true,
          },
        },
      },
      orderBy: {
        lastMessageAt: 'desc',
      },
    });

    // Convert Decimal to number for client compatibility
    const conversationsWithNumber = conversations.map(conv => ({
      ...conv,
      listing: {
        ...conv.listing,
        price: Number(conv.listing.price),
      },
    }));

    return NextResponse.json(conversationsWithNumber);
  } catch (error) {
    console.error('Conversations GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/conversations - Create or get existing conversation
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
    const { listingId } = body;

    if (!listingId) {
      return NextResponse.json(
        { error: 'Listing ID is required' },
        { status: 400 }
      );
    }

    // Get the listing to find the seller
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { userId: true },
    });

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Don't allow seller to message themselves
    if (listing.userId === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot message yourself' },
        { status: 400 }
      );
    }

    // Try to find existing conversation
    const existingConversation = await prisma.conversation.findUnique({
      where: {
        listingId_buyerId_sellerId: {
          listingId,
          buyerId: session.user.id,
          sellerId: listing.userId,
        },
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            images: true,
            price: true,
            status: true,
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (existingConversation) {
      // Convert Decimal to number
      const conversationWithNumber = {
        ...existingConversation,
        listing: {
          ...existingConversation.listing,
          price: Number(existingConversation.listing.price),
        },
      };
      return NextResponse.json(conversationWithNumber);
    }

    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        listingId,
        buyerId: session.user.id,
        sellerId: listing.userId,
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            images: true,
            price: true,
            status: true,
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    // Convert Decimal to number
    const conversationWithNumber = {
      ...conversation,
      listing: {
        ...conversation.listing,
        price: Number(conversation.listing.price),
      },
    };

    return NextResponse.json(conversationWithNumber, { status: 201 });
  } catch (error) {
    console.error('Conversation POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
