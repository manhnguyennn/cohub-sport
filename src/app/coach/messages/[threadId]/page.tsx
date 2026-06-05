import MessagesClient from '@features/messages/MessagesClient';
import { ROUTES } from '@config/routes';

export const metadata = { title: 'Tin nhắn | Coach' };

export default function CoachMessageThreadPage({ params }: { params: { threadId: string } }) {
  return <MessagesClient basePath={ROUTES.coachMessages} activeThreadId={params.threadId} />;
}
