import MessagesClient from '@features/messages/MessagesClient';
import { ROUTES } from '@config/routes';

export const metadata = { title: 'Tin nhắn | Coach' };

export default function CoachMessagesPage() {
  return <MessagesClient basePath={ROUTES.coachMessages} />;
}
