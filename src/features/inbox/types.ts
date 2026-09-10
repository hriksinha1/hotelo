import { Conversation, Message, Request, RequestCategory, RequestStatus } from '../../lib/repository/types';

export type InboxFilterType = 'all' | 'unread' | 'open_requests' | 'assigned_to_me';

export interface InboxState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  requests: Request[];
  loading: boolean;
  messagesLoading: boolean;
  filterType: InboxFilterType;
  search: string;
  unreadCount: number;
}
