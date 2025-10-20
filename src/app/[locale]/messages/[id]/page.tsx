import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { Link } from '@/routing';
import { MessageThread } from '@/components/messages/MessageThread';

interface ConversationPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default async function ConversationPage({ params }: ConversationPageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const t = await getTranslations('messages');

  // Get conversation
  const conversation = await prisma.conversation.findUnique({
    where: { id },
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
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });

  if (!conversation) {
    notFound();
  }

  // Verify user is part of the conversation
  if (conversation.buyerId !== session.user.id && conversation.sellerId !== session.user.id) {
    redirect('/messages');
  }

  // Mark messages as read
  await prisma.message.updateMany({
    where: {
      conversationId: id,
      receiverId: session.user.id,
      read: false,
    },
    data: {
      read: true,
    },
  });

  const otherUser = conversation.buyerId === session.user.id
    ? conversation.seller
    : conversation.buyer;

  return (
    <div className="min-h-screen bg-brand-teal-50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center gap-4">
              <Link
                href="/messages"
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back
              </Link>
              <div className="flex-1 flex items-center gap-4">
                <img
                  src={conversation.listing.images[0] || 'https://placehold.co/60x60?text=No+Image'}
                  alt={conversation.listing.title}
                  className="w-14 h-14 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <Link
                    href={`/listings/${conversation.listing.id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-primary-600"
                  >
                    {conversation.listing.title}
                  </Link>
                  <p className="text-sm text-gray-600">
                    {t('chatWith', { name: otherUser.name || otherUser.email })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary-600">
                    CHF {Number(conversation.listing.price).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {conversation.listing.status}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Thread */}
        <MessageThread
          conversationId={id}
          initialMessages={conversation.messages}
          currentUserId={session.user.id}
          otherUser={otherUser}
        />
      </div>
    </div>
  );
}
