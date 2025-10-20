import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { Link } from '@/routing';

export default async function MessagesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const t = await getTranslations('messages');

  // Get all conversations
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
      _count: {
        select: {
          messages: {
            where: {
              receiverId: session.user.id,
              read: false,
            },
          },
        },
      },
    },
    orderBy: {
      lastMessageAt: 'desc',
    },
  });

  return (
    <div className="min-h-screen bg-brand-teal-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-2">{t('subtitle')}</p>
        </div>

        {conversations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">
              {t('noConversations')}
            </p>
            <Link
              href="/"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              {t('browseListing')}
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
            {conversations.map((conversation) => {
              const otherUser = conversation.buyerId === session.user.id
                ? conversation.seller
                : conversation.buyer;
              const lastMessage = conversation.messages[0];
              const unreadCount = conversation._count.messages;
              const isUnread = unreadCount > 0;

              return (
                <Link
                  key={conversation.id}
                  href={`/messages/${conversation.id}`}
                  className="flex items-start gap-4 p-6 hover:bg-gray-50 transition-colors"
                >
                  {/* Listing Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={conversation.listing.images[0] || 'https://placehold.co/80x80?text=No+Image'}
                      alt={conversation.listing.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>

                  {/* Conversation Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h3 className={`text-lg font-semibold text-gray-900 ${isUnread ? 'font-bold' : ''}`}>
                          {conversation.listing.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {otherUser.name || otherUser.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {isUnread && (
                          <span className="bg-primary-600 text-white text-xs font-bold rounded-full px-2 py-1">
                            {unreadCount}
                          </span>
                        )}
                        <span className="text-sm text-gray-500 whitespace-nowrap">
                          CHF {Number(conversation.listing.price).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {lastMessage && (
                      <div className="mt-2">
                        <p className={`text-sm text-gray-600 line-clamp-2 ${isUnread && lastMessage.senderId !== session.user.id ? 'font-semibold' : ''}`}>
                          {lastMessage.senderId === session.user.id ? 'You: ' : ''}
                          {lastMessage.content}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(lastMessage.createdAt).toLocaleDateString()} {new Date(lastMessage.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
