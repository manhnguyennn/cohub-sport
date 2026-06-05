import MessagesClient from '@features/messages/MessagesClient';

export const metadata = { title: 'Tin nhắn | CoHub' };

export default function MessageThreadPage({ params }: { params: { threadId: string } }) {
  return <MessagesClient activeThreadId={params.threadId} />;
}
