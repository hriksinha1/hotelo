export interface Organization {
  id: string;
  name: string;
  created_at: string;
}

export interface Property {
  id: string;
  organization_id?: string;
  name: string;
  property_type: string;
  location: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  gstin?: string;
  check_in_time: string;
  check_out_time: string;
  description?: string;
  active: boolean;
  created_at: string;
}

export interface Customer {
  id: string;
  organization_id?: string;
  name: string;
  phone: string;
  email?: string;
  id_type?: string;
  id_number?: string;
  city?: string;
  address?: string;
  notes?: string;
  created_at: string;
}

export interface Booking {
  id: string;
  organization_id?: string;
  booking_no: string;
  customer_id: string;
  property_id: string;
  room_number?: string;
  check_in: string;
  check_out: string;
  nights: number;
  rooms: number;
  guests: number;
  room_type: string;
  base_amount: number;
  tax_enabled: boolean;
  tax_rate: number;
  tax_amount: number;
  grand_total: number;
  booking_status: string;
  payment_status: string;
  created_at: string;
  customer?: Customer;
  property?: Property;
}

export interface Payment {
  id: string;
  organization_id?: string;
  payment_no: string;
  booking_id: string;
  date: string;
  amount: number;
  method: string;
  ref_id?: string;
  purpose?: string;
  status: string;
  created_at: string;
  booking?: any;
}

export interface Notification {
  id: string;
  organization_id?: string;
  booking_id: string;
  customer_id: string;
  channel: string; // 'Email' | 'WhatsApp'
  type: string; // 'Booking Confirmation' | 'Payment Receipt'
  recipient: string;
  status: string; // 'Demo Sent' | 'Sent' | 'Failed'
  created_at: string;
}

export type RequestCategory =
  | 'Housekeeping'
  | 'Maintenance'
  | 'Extra towels'
  | 'Extra pillows'
  | 'Wi-Fi issue'
  | 'Room issue'
  | 'Room service'
  | 'Late checkout'
  | 'General request';

export type RequestStatus = 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';

export interface Request {
  id: string;
  conversation_id?: string;
  organization_id?: string;
  property_id: string;
  booking_id: string;
  guest_id: string;
  room_number?: string;
  category: RequestCategory;
  title: string;
  description?: string;
  status: RequestStatus;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  guest?: Customer;
  property?: Property;
  booking?: Booking;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_type: 'staff' | 'guest';
  sender_name: string;
  sender_id: string;
  body: string;
  created_at: string;
  read_at?: string;
}

export interface Conversation {
  id: string;
  organization_id?: string;
  property_id: string;
  booking_id: string;
  guest_id: string;
  room_number?: string;
  status: 'open' | 'closed';
  unread_count: number;
  last_message_text: string;
  last_message_at: string;
  created_at: string;
  updated_at: string;
  guest?: Customer;
  property?: Property;
  booking?: Booking;
  open_requests_count?: number;
}

export interface GuestToken {
  id: string;
  booking_id: string;
  token: string;
  created_at: string;
  expires_at?: string;
  revoked_at?: string;
}

export interface BusinessSettings {
  name: string;
  legalName: string;
  gstin: string;
  address?: string;
  phone?: string;
  email?: string;
  invoicePrefix?: string;
  receiptPrefix?: string;
  defaultTaxRate?: number;
  termsConditions?: string;
  checkInTime?: string;
  checkOutTime?: string;
  cancellationPolicy?: string;
}

export type SystemSettings = BusinessSettings;

export interface IRepository {
  getProperties(): Promise<Property[]>;
  getProperty(id: string): Promise<Property | null>;
  createProperty(data: Omit<Property, 'id' | 'created_at'>): Promise<Property>;
  updateProperty(id: string, data: Partial<Property>): Promise<Property>;

  getCustomers(): Promise<Customer[]>;
  getCustomer(id: string): Promise<Customer | null>;
  createCustomer(data: Omit<Customer, 'id' | 'created_at'>): Promise<Customer>;
  updateCustomer(id: string, data: Partial<Customer>): Promise<Customer>;

  getBookings(propertyId?: string): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking | null>;
  createBooking(data: Omit<Booking, 'id' | 'created_at'>): Promise<Booking>;
  updateBooking(id: string, data: Partial<Booking>): Promise<Booking>;

  getPayments(bookingId?: string): Promise<Payment[]>;
  getAllPayments(propertyId?: string): Promise<Payment[]>;
  createPayment(data: Omit<Payment, 'id' | 'created_at'>): Promise<Payment>;

  getNotifications(bookingId?: string): Promise<Notification[]>;
  createNotification(data: Omit<Notification, 'id' | 'created_at'>): Promise<Notification>;

  // Conversations & Guest Communication
  getConversations(filters?: {
    propertyId?: string;
    status?: string;
    filterType?: 'all' | 'unread' | 'open_requests' | 'assigned_to_me';
    search?: string;
    guestId?: string;
  }): Promise<Conversation[]>;
  getConversation(id: string): Promise<Conversation | null>;
  getConversationByBooking(bookingId: string): Promise<Conversation | null>;
  createConversation(data: Omit<Conversation, 'id' | 'created_at' | 'updated_at' | 'guest' | 'property' | 'booking' | 'open_requests_count'>): Promise<Conversation>;
  updateConversation(id: string, data: Partial<Conversation>): Promise<Conversation>;

  // Messages
  getMessages(conversationId: string): Promise<Message[]>;
  createMessage(data: Omit<Message, 'id' | 'created_at'>): Promise<Message>;

  // Requests
  getRequests(filters?: {
    propertyId?: string;
    bookingId?: string;
    conversationId?: string;
    status?: string;
  }): Promise<Request[]>;
  getRequest(id: string): Promise<Request | null>;
  createRequest(data: Omit<Request, 'id' | 'created_at' | 'updated_at' | 'guest' | 'property' | 'booking'>): Promise<Request>;
  updateRequest(id: string, data: Partial<Request>): Promise<Request>;

  // Guest Stay Portal
  getStayByToken(token: string): Promise<{
    booking: Booking;
    customer: Customer;
    property: Property;
    conversation: Conversation;
    requests: Request[];
    messages: Message[];
  } | null>;
  createStayMessage(token: string, body: string): Promise<Message>;
  createStayRequest(token: string, category: RequestCategory, title: string, description?: string): Promise<Request>;

  getSettings(): Promise<BusinessSettings>;
  updateSettings(data: Partial<BusinessSettings>): Promise<BusinessSettings>;

  resetDemoData(): Promise<void>;
}
