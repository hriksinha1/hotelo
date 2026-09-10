import { useState, useEffect, useCallback, useRef } from 'react';
import { repository } from '../../../lib/repository';
import { Conversation, Message, Request, RequestCategory, RequestStatus } from '../../../lib/repository/types';
import { InboxFilterType } from '../types';
import { useToast } from '../../../context/ToastContext';

export function useInboxData(propertyFilter?: string, routeConversationId?: string) {
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(routeConversationId || null);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [filterType, setFilterType] = useState<InboxFilterType>('all');
  const [search, setSearch] = useState('');
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);

  // Sync route conversation ID
  useEffect(() => {
    if (routeConversationId) {
      setActiveConversationId(routeConversationId);
    }
  }, [routeConversationId]);

  // Load conversations list
  const loadConversations = useCallback(async (selectId?: string) => {
    try {
      const list = await repository.getConversations({
        propertyId: propertyFilter || undefined,
        filterType,
        search: search.trim() || undefined
      });
      setConversations(list);

      // Calculate total unread across all
      const allList = await repository.getConversations({ propertyId: propertyFilter || undefined });
      const unreadTotal = allList.reduce((acc, c) => acc + (c.unread_count || 0), 0);
      setTotalUnreadCount(unreadTotal);

      // Determine selected conversation
      const targetId = selectId || activeConversationId || (list.length > 0 ? list[0].id : null);
      if (targetId) {
        const found = list.find(c => c.id === targetId);
        if (found) {
          setActiveConversationId(targetId);
          setActiveConversation(found);
        } else if (list.length > 0) {
          setActiveConversationId(list[0].id);
          setActiveConversation(list[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load conversations', err);
    } finally {
      setLoading(false);
    }
  }, [propertyFilter, filterType, search, activeConversationId]);

  useEffect(() => {
    setLoading(true);
    loadConversations();
  }, [propertyFilter, filterType, search]);

  // Load messages and requests for active conversation
  const loadActiveConversationDetails = useCallback(async (convId: string) => {
    setMessagesLoading(true);
    try {
      const [conv, msgList, reqList] = await Promise.all([
        repository.getConversation(convId),
        repository.getMessages(convId),
        repository.getRequests({ conversationId: convId })
      ]);

      if (conv) {
        setActiveConversation(conv);
        // Automatically mark as read if unread
        if (conv.unread_count > 0) {
          await repository.updateConversation(conv.id, { unread_count: 0 });
          conv.unread_count = 0;
          setConversations(prev =>
            prev.map(c => (c.id === conv.id ? { ...c, unread_count: 0 } : c))
          );
          setTotalUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
      setMessages(msgList);
      setRequests(reqList);
    } catch (err) {
      console.error('Failed to load active conversation details', err);
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeConversationId) {
      loadActiveConversationDetails(activeConversationId);
    } else {
      setActiveConversation(null);
      setMessages([]);
      setRequests([]);
    }
  }, [activeConversationId, loadActiveConversationDetails]);

  // Send staff message
  const sendMessage = async (body: string, staffName = 'Anika Rao', staffId = 'staff-1') => {
    if (!activeConversationId || !body.trim()) return false;
    try {
      const newMsg = await repository.createMessage({
        conversation_id: activeConversationId,
        sender_type: 'staff',
        sender_name: staffName,
        sender_id: staffId,
        body: body.trim()
      });

      setMessages(prev => [...prev, newMsg]);

      // Update conversation in list
      setConversations(prev =>
        prev.map(c =>
          c.id === activeConversationId
            ? {
                ...c,
                last_message_text: body.trim(),
                last_message_at: newMsg.created_at
              }
            : c
        )
      );

      return true;
    } catch (err) {
      console.error('Failed to send message', err);
      toast.error('Could not send message', 'Please check your connection and try again.');
      return false;
    }
  };

  // Create request from conversation
  const createRequest = async (data: {
    category: RequestCategory;
    title: string;
    description?: string;
    assigned_to?: string;
  }) => {
    if (!activeConversation) return null;
    try {
      const newReq = await repository.createRequest({
        conversation_id: activeConversation.id,
        organization_id: activeConversation.organization_id || 'org-bookzee-1',
        property_id: activeConversation.property_id,
        booking_id: activeConversation.booking_id,
        guest_id: activeConversation.guest_id,
        room_number: activeConversation.room_number,
        category: data.category,
        title: data.title,
        description: data.description,
        status: data.assigned_to ? 'assigned' : 'open',
        assigned_to: data.assigned_to
      });

      setRequests(prev => [newReq, ...prev]);

      // Post message to thread acknowledging the request
      const actionMsg = await repository.createMessage({
        conversation_id: activeConversation.id,
        sender_type: 'staff',
        sender_name: data.assigned_to || 'Front Desk',
        sender_id: 'staff-desk',
        body: `Created ${data.category} request: "${data.title}"${data.assigned_to ? ' (Assigned to ' + data.assigned_to + ')' : ''}.`
      });
      setMessages(prev => [...prev, actionMsg]);

      // Refresh list to reflect open request count badge
      loadConversations();
      toast.success('Request Created', `${data.title} added to operations.`);
      return newReq;
    } catch (err) {
      console.error('Failed to create request', err);
      toast.error('Request creation failed', 'Please try again.');
      return null;
    }
  };

  // Update request status
  const updateRequestStatus = async (
    requestId: string,
    newStatus: RequestStatus,
    assignedTo?: string
  ) => {
    try {
      const updateData: Partial<Request> = { status: newStatus };
      if (assignedTo !== undefined) {
        updateData.assigned_to = assignedTo;
      }
      const updated = await repository.updateRequest(requestId, updateData);

      setRequests(prev => prev.map(r => (r.id === requestId ? updated : r)));

      // If active conversation, post status update to thread
      if (activeConversation) {
        let statusText = newStatus as string;
        if (newStatus === 'in_progress') statusText = 'in progress';
        if (newStatus === 'completed') statusText = 'completed';

        const notifMsg = await repository.createMessage({
          conversation_id: activeConversation.id,
          sender_type: 'staff',
          sender_name: updated.assigned_to || 'Front Desk',
          sender_id: 'staff-desk',
          body: `Request "${updated.title}" marked as ${statusText}.`
        });
        setMessages(prev => [...prev, notifMsg]);
      }

      loadConversations();
      toast.success('Request Updated', `Status changed to ${newStatus}.`);
      return updated;
    } catch (err) {
      console.error('Failed to update request', err);
      toast.error('Update Failed', 'Could not update request status.');
      return null;
    }
  };

  // Close / Reopen conversation
  const toggleConversationStatus = async () => {
    if (!activeConversation) return;
    const newStatus = activeConversation.status === 'open' ? 'closed' : 'open';
    try {
      const updated = await repository.updateConversation(activeConversation.id, {
        status: newStatus
      });
      setActiveConversation(updated);
      setConversations(prev =>
        prev.map(c => (c.id === updated.id ? { ...c, status: newStatus } : c))
      );
      toast.success(
        newStatus === 'closed' ? 'Conversation Closed' : 'Conversation Re-opened',
        `Guest conversation marked as ${newStatus}.`
      );
    } catch (err) {
      toast.error('Action Failed', 'Could not update conversation status.');
    }
  };

  return {
    conversations,
    activeConversationId,
    setActiveConversationId,
    activeConversation,
    messages,
    requests,
    loading,
    messagesLoading,
    filterType,
    setFilterType,
    search,
    setSearch,
    totalUnreadCount,
    sendMessage,
    createRequest,
    updateRequestStatus,
    toggleConversationStatus,
    refresh: () => {
      loadConversations();
      if (activeConversationId) {
        loadActiveConversationDetails(activeConversationId);
      }
    }
  };
}
