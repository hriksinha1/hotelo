import {
  IRepository,
  Property,
  Customer,
  Booking,
  Payment,
  Notification,
  BusinessSettings,
  Organization,
  Conversation,
  Message,
  Request,
  RequestCategory,
  GuestToken
} from './types';
import { generateId } from '../utils/formatters';

const STORAGE_KEY = 'bookzee_demo_workspace_v3';

interface DemoDB {
  organizations: Organization[];
  properties: Property[];
  customers: Customer[];
  bookings: Booking[];
  payments: Payment[];
  notifications: Notification[];
  conversations: Conversation[];
  messages: Message[];
  requests: Request[];
  guest_tokens: GuestToken[];
  settings: BusinessSettings;
}

// Helper to format date offset from today
function getDateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function getInitialData(): DemoDB {
  const nowIso = new Date().toISOString();
  const orgId = 'org-bookzee-1';

  const organizations: Organization[] = [
    {
      id: 'org-bookzee-1',
      name: 'Bookzee Stays',
      created_at: nowIso
    },
    {
      id: 'org-northstar-2',
      name: 'Northstar Hospitality',
      created_at: nowIso
    }
  ];

  const properties: Property[] = [
    {
      id: 'p1',
      organization_id: orgId,
      name: 'The Heritage Courtyard',
      property_type: 'Boutique Hotel',
      location: 'City Center',
      address: '12 Temple Road',
      city: 'Mysuru',
      state: 'Karnataka',
      pincode: '570001',
      phone: '+91 98765 43210',
      email: 'heritage@bookzee.local',
      gstin: '29ABCDE1234F1Z5',
      check_in_time: '14:00',
      check_out_time: '11:00',
      description: 'Restored 19th-century royal courtyard with 16 bespoke heritage suites.',
      active: true,
      created_at: nowIso
    },
    {
      id: 'p2',
      organization_id: orgId,
      name: 'Valley View Resort',
      property_type: 'Resort & Spa',
      location: 'Hill Station',
      address: 'Mist Point, Tea Gardens',
      city: 'Munnar',
      state: 'Kerala',
      pincode: '685612',
      phone: '+91 98765 43211',
      email: 'valley@bookzee.local',
      gstin: '32ABCDE1234F1Z5',
      check_in_time: '13:00',
      check_out_time: '11:00',
      description: 'Panoramic tea plantation sanctuary featuring luxury cloud-facing chalets.',
      active: true,
      created_at: nowIso
    },
    {
      id: 'p3',
      organization_id: orgId,
      name: 'Coral Beach Homestay',
      property_type: 'Homestay',
      location: 'North Goa',
      address: 'Beach Lane, Near Flea Market',
      city: 'Anjuna',
      state: 'Goa',
      pincode: '403509',
      phone: '+91 98765 43212',
      email: 'coral@bookzee.local',
      check_in_time: '14:00',
      check_out_time: '11:00',
      description: 'Charming Portuguese heritage villa 150m from the Arabian Sea.',
      active: true,
      created_at: nowIso
    },
    {
      id: 'p4',
      organization_id: orgId,
      name: 'Pinecrest Cabin',
      property_type: 'Homestay',
      location: 'Old Manali',
      address: 'Upper Orchard Road',
      city: 'Manali',
      state: 'Himachal Pradesh',
      pincode: '175131',
      phone: '+91 98765 43213',
      email: 'pine@bookzee.local',
      check_in_time: '12:00',
      check_out_time: '11:00',
      description: 'Handcrafted cedarwood cabin framed by apple orchards and snow-capped peaks.',
      active: true,
      created_at: nowIso
    },
    {
      id: 'p5',
      organization_id: orgId,
      name: 'Oasis Business Hotel',
      property_type: 'Business Hotel',
      location: 'Outer Ring Road',
      address: 'Tech Corridor',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560037',
      phone: '+91 98765 43214',
      email: 'oasis@bookzee.local',
      gstin: '29ABCDE1234F1Z5',
      check_in_time: '14:00',
      check_out_time: '12:00',
      description: 'High-connectivity business rooms with 24/7 dining and conference studios.',
      active: true,
      created_at: nowIso
    }
  ];

  const customers: Customer[] = [
    { id: 'c1', organization_id: orgId, name: 'Rahul Sharma', phone: '+91 91234 56701', email: 'rahul.sharma@example.com', created_at: nowIso },
    { id: 'c2', organization_id: orgId, name: 'Priya Patel', phone: '+91 91234 56702', email: 'priya.patel@example.com', created_at: nowIso },
    { id: 'c3', organization_id: orgId, name: 'Ananya Desai', phone: '+91 91234 56703', email: 'ananya.desai@example.com', created_at: nowIso },
    { id: 'c4', organization_id: orgId, name: 'Vikram Singh', phone: '+91 91234 56704', email: 'vikram.singh@example.com', created_at: nowIso },
    { id: 'c5', organization_id: orgId, name: 'Neha Gupta', phone: '+91 91234 56705', email: 'neha.gupta@example.com', created_at: nowIso },
    { id: 'c6', organization_id: orgId, name: 'Karthik Reddy', phone: '+91 91234 56706', email: 'karthik.reddy@example.com', created_at: nowIso },
    { id: 'c7', organization_id: orgId, name: 'Sonal Iyer', phone: '+91 91234 56707', email: 'sonal.iyer@example.com', created_at: nowIso },
    { id: 'c8', organization_id: orgId, name: 'Arjun Nair', phone: '+91 91234 56708', email: 'arjun.nair@example.com', created_at: nowIso },
    { id: 'c9', organization_id: orgId, name: 'Meera Rao', phone: '+91 91234 56709', email: 'meera.rao@example.com', created_at: nowIso },
    { id: 'c10', organization_id: orgId, name: 'Rohan Mehta', phone: '+91 91234 56710', email: 'rohan.mehta@example.com', created_at: nowIso },
    { id: 'c11', organization_id: orgId, name: 'Kabir Malhotra', phone: '+91 91234 56711', email: 'kabir.m@example.com', created_at: nowIso },
    { id: 'c12', organization_id: orgId, name: 'Aditi Sen', phone: '+91 91234 56712', email: 'aditi.sen@example.com', created_at: nowIso }
  ];

  const bookings: Booking[] = [
    // Today's Arrival 1 (Valley View) - Partially Paid - Room 204
    {
      id: 'b-arr-1',
      organization_id: orgId,
      booking_no: 'BK-1011',
      customer_id: 'c1',
      property_id: 'p2',
      room_number: '204',
      check_in: getDateOffset(0),
      check_out: getDateOffset(2),
      nights: 2,
      rooms: 1,
      guests: 2,
      room_type: 'Valley Deluxe Chalet',
      base_amount: 18000,
      tax_enabled: true,
      tax_rate: 12,
      tax_amount: 2160,
      grand_total: 20160,
      booking_status: 'Confirmed',
      payment_status: 'Partially Paid',
      created_at: getDateOffset(-5)
    },
    // Today's Arrival 2 (The Heritage Courtyard) - Fully Paid - Room 104
    {
      id: 'b-arr-2',
      organization_id: orgId,
      booking_no: 'BK-1012',
      customer_id: 'c2',
      property_id: 'p1',
      room_number: '104',
      check_in: getDateOffset(0),
      check_out: getDateOffset(3),
      nights: 3,
      rooms: 1,
      guests: 2,
      room_type: 'Maharaja Royal Suite',
      base_amount: 24000,
      tax_enabled: true,
      tax_rate: 18,
      tax_amount: 4320,
      grand_total: 28320,
      booking_status: 'Confirmed',
      payment_status: 'Paid',
      created_at: getDateOffset(-8)
    },
    // Today's Arrival 3 (Coral Beach) - Unpaid - Room Sea Breeze 2
    {
      id: 'b-arr-3',
      organization_id: orgId,
      booking_no: 'BK-1013',
      customer_id: 'c5',
      property_id: 'p3',
      room_number: 'Sea Breeze 2',
      check_in: getDateOffset(0),
      check_out: getDateOffset(2),
      nights: 2,
      rooms: 1,
      guests: 2,
      room_type: 'Sea Breeze Suite',
      base_amount: 9000,
      tax_enabled: false,
      tax_rate: 0,
      tax_amount: 0,
      grand_total: 9000,
      booking_status: 'Confirmed',
      payment_status: 'Unpaid',
      created_at: getDateOffset(-3)
    },

    // Today's Departure 1 (Valley View) - Fully Paid - Room 301
    {
      id: 'b-dep-1',
      organization_id: orgId,
      booking_no: 'BK-1008',
      customer_id: 'c8',
      property_id: 'p2',
      room_number: '301',
      check_in: getDateOffset(-3),
      check_out: getDateOffset(0),
      nights: 3,
      rooms: 2,
      guests: 4,
      room_type: 'Plantation Suite',
      base_amount: 36000,
      tax_enabled: true,
      tax_rate: 18,
      tax_amount: 6480,
      grand_total: 42480,
      booking_status: 'Checked In',
      payment_status: 'Paid',
      created_at: getDateOffset(-10)
    },
    // Today's Departure 2 (Pinecrest Cabin) - Balance Due - Room Cedar 5
    {
      id: 'b-dep-2',
      organization_id: orgId,
      booking_no: 'BK-1009',
      customer_id: 'c7',
      property_id: 'p4',
      room_number: 'Cedar 5',
      check_in: getDateOffset(-2),
      check_out: getDateOffset(0),
      nights: 2,
      rooms: 1,
      guests: 2,
      room_type: 'Cedar Chalet',
      base_amount: 14000,
      tax_enabled: true,
      tax_rate: 12,
      tax_amount: 1680,
      grand_total: 15680,
      booking_status: 'Checked In',
      payment_status: 'Partially Paid',
      created_at: getDateOffset(-7)
    },

    // In-House Stays - Room 202 & Room 405
    {
      id: 'b-stay-1',
      organization_id: orgId,
      booking_no: 'BK-1010',
      customer_id: 'c10',
      property_id: 'p1',
      room_number: '202',
      check_in: getDateOffset(-1),
      check_out: getDateOffset(2),
      nights: 3,
      rooms: 1,
      guests: 2,
      room_type: 'Courtyard Deluxe',
      base_amount: 16000,
      tax_enabled: true,
      tax_rate: 18,
      tax_amount: 2880,
      grand_total: 18880,
      booking_status: 'Checked In',
      payment_status: 'Paid',
      created_at: getDateOffset(-4)
    },
    {
      id: 'b-stay-2',
      organization_id: orgId,
      booking_no: 'BK-1007',
      customer_id: 'c11',
      property_id: 'p5',
      room_number: '405',
      check_in: getDateOffset(-2),
      check_out: getDateOffset(1),
      nights: 3,
      rooms: 1,
      guests: 1,
      room_type: 'Executive Club',
      base_amount: 12000,
      tax_enabled: true,
      tax_rate: 18,
      tax_amount: 2160,
      grand_total: 14160,
      booking_status: 'Checked In',
      payment_status: 'Partially Paid',
      created_at: getDateOffset(-6)
    },

    // Upcoming Bookings
    {
      id: 'b-up-1',
      organization_id: orgId,
      booking_no: 'BK-1014',
      customer_id: 'c12',
      property_id: 'p3',
      room_number: 'Palm 1',
      check_in: getDateOffset(2),
      check_out: getDateOffset(5),
      nights: 3,
      rooms: 1,
      guests: 2,
      room_type: 'Palm Cottage',
      base_amount: 15000,
      tax_enabled: false,
      tax_rate: 0,
      tax_amount: 0,
      grand_total: 15000,
      booking_status: 'Confirmed',
      payment_status: 'Unpaid',
      created_at: getDateOffset(-2)
    },
    {
      id: 'b-up-2',
      organization_id: orgId,
      booking_no: 'BK-1015',
      customer_id: 'c4',
      property_id: 'p4',
      room_number: 'Alpine 3',
      check_in: getDateOffset(4),
      check_out: getDateOffset(7),
      nights: 3,
      rooms: 1,
      guests: 3,
      room_type: 'Alpine Loft',
      base_amount: 21000,
      tax_enabled: true,
      tax_rate: 12,
      tax_amount: 2520,
      grand_total: 23520,
      booking_status: 'Confirmed',
      payment_status: 'Partially Paid',
      created_at: getDateOffset(-1)
    },
    {
      id: 'b-up-3',
      organization_id: orgId,
      booking_no: 'BK-1016',
      customer_id: 'c3',
      property_id: 'p2',
      room_number: 'Pod 7',
      check_in: getDateOffset(6),
      check_out: getDateOffset(8),
      nights: 2,
      rooms: 1,
      guests: 2,
      room_type: 'Tea Glamping Pod',
      base_amount: 18000,
      tax_enabled: true,
      tax_rate: 18,
      tax_amount: 3240,
      grand_total: 21240,
      booking_status: 'Confirmed',
      payment_status: 'Paid',
      created_at: getDateOffset(0)
    },

    // Historical Stays
    {
      id: 'b-hist-1',
      organization_id: orgId,
      booking_no: 'BK-1005',
      customer_id: 'c6',
      property_id: 'p1',
      room_number: '102',
      check_in: getDateOffset(-10),
      check_out: getDateOffset(-7),
      nights: 3,
      rooms: 1,
      guests: 2,
      room_type: 'Courtyard Deluxe',
      base_amount: 16500,
      tax_enabled: true,
      tax_rate: 18,
      tax_amount: 2970,
      grand_total: 19470,
      booking_status: 'Completed',
      payment_status: 'Paid',
      created_at: getDateOffset(-14)
    },
    {
      id: 'b-hist-2',
      organization_id: orgId,
      booking_no: 'BK-1004',
      customer_id: 'c9',
      property_id: 'p2',
      room_number: '201',
      check_in: getDateOffset(-12),
      check_out: getDateOffset(-9),
      nights: 3,
      rooms: 1,
      guests: 2,
      room_type: 'Valley Deluxe Chalet',
      base_amount: 27000,
      tax_enabled: true,
      tax_rate: 18,
      tax_amount: 4860,
      grand_total: 31860,
      booking_status: 'Completed',
      payment_status: 'Paid',
      created_at: getDateOffset(-18)
    }
  ];

  const payments: Payment[] = [
    // b-arr-1 partial payment
    {
      id: 'pay-1',
      organization_id: orgId,
      payment_no: 'RCP-2026-001',
      booking_id: 'b-arr-1',
      date: getDateOffset(-5),
      amount: 10000,
      method: 'UPI',
      ref_id: 'UPI-774921008',
      purpose: '50% Advance Booking Deposit',
      status: 'Recorded',
      created_at: getDateOffset(-5)
    },
    // b-arr-2 full payment
    {
      id: 'pay-2',
      organization_id: orgId,
      payment_no: 'RCP-2026-002',
      booking_id: 'b-arr-2',
      date: getDateOffset(-8),
      amount: 28320,
      method: 'Credit Card',
      ref_id: 'CC-9948201',
      purpose: 'Full Prepaid Reservation',
      status: 'Recorded',
      created_at: getDateOffset(-8)
    },
    // b-dep-1 full payment via 2 installments
    {
      id: 'pay-3',
      organization_id: orgId,
      payment_no: 'RCP-2026-003',
      booking_id: 'b-dep-1',
      date: getDateOffset(-10),
      amount: 20000,
      method: 'Net Banking',
      ref_id: 'NB-5529103',
      purpose: 'Advance Stay Deposit',
      status: 'Recorded',
      created_at: getDateOffset(-10)
    },
    {
      id: 'pay-4',
      organization_id: orgId,
      payment_no: 'RCP-2026-004',
      booking_id: 'b-dep-1',
      date: getDateOffset(-1),
      amount: 22480,
      method: 'UPI',
      ref_id: 'UPI-88401928',
      purpose: 'Final Departure Clearance',
      status: 'Recorded',
      created_at: getDateOffset(-1)
    },
    // b-dep-2 partial payment
    {
      id: 'pay-5',
      organization_id: orgId,
      payment_no: 'RCP-2026-005',
      booking_id: 'b-dep-2',
      date: getDateOffset(-7),
      amount: 8000,
      method: 'UPI',
      ref_id: 'UPI-1194029',
      purpose: 'Deposit',
      status: 'Recorded',
      created_at: getDateOffset(-7)
    },
    // b-stay-1 paid
    {
      id: 'pay-6',
      organization_id: orgId,
      payment_no: 'RCP-2026-006',
      booking_id: 'b-stay-1',
      date: getDateOffset(-4),
      amount: 18880,
      method: 'Credit Card',
      ref_id: 'CC-8829104',
      purpose: 'Full Payment at Check-In',
      status: 'Recorded',
      created_at: getDateOffset(-4)
    },
    // b-stay-2 partial
    {
      id: 'pay-7',
      organization_id: orgId,
      payment_no: 'RCP-2026-007',
      booking_id: 'b-stay-2',
      date: getDateOffset(-6),
      amount: 7000,
      method: 'Cash',
      purpose: 'Check-in Advance',
      status: 'Recorded',
      created_at: getDateOffset(-6)
    },
    // b-up-2 partial
    {
      id: 'pay-8',
      organization_id: orgId,
      payment_no: 'RCP-2026-008',
      booking_id: 'b-up-2',
      date: getDateOffset(-1),
      amount: 10000,
      method: 'UPI',
      ref_id: 'UPI-99201948',
      purpose: 'Advance Reservation',
      status: 'Recorded',
      created_at: getDateOffset(-1)
    },
    // b-up-3 paid
    {
      id: 'pay-9',
      organization_id: orgId,
      payment_no: 'RCP-2026-009',
      booking_id: 'b-up-3',
      date: getDateOffset(0),
      amount: 21240,
      method: 'Net Banking',
      ref_id: 'NB-3301948',
      purpose: 'Full Glamping Booking',
      status: 'Recorded',
      created_at: getDateOffset(0)
    },
    // b-hist-1 paid
    {
      id: 'pay-10',
      organization_id: orgId,
      payment_no: 'RCP-2026-010',
      booking_id: 'b-hist-1',
      date: getDateOffset(-14),
      amount: 19470,
      method: 'UPI',
      ref_id: 'UPI-4401928',
      purpose: 'Completed Stay Payment',
      status: 'Recorded',
      created_at: getDateOffset(-14)
    }
  ];

  const guest_tokens: GuestToken[] = [
    {
      id: 'tok-1',
      booking_id: 'b-arr-1',
      token: 'demo-rahul-valley-204',
      created_at: nowIso
    },
    {
      id: 'tok-2',
      booking_id: 'b-arr-2',
      token: 'demo-priya-heritage-104',
      created_at: nowIso
    },
    {
      id: 'tok-3',
      booking_id: 'b-arr-3',
      token: 'demo-neha-coral-2',
      created_at: nowIso
    },
    {
      id: 'tok-4',
      booking_id: 'b-stay-1',
      token: 'demo-rohan-heritage-202',
      created_at: nowIso
    }
  ];

  const conversations: Conversation[] = [
    {
      id: 'conv-1',
      organization_id: orgId,
      property_id: 'p2',
      booking_id: 'b-arr-1',
      guest_id: 'c1',
      room_number: '204',
      status: 'open',
      unread_count: 1,
      last_message_text: 'Can you send two extra towels to Room 204?',
      last_message_at: new Date(Date.now() - 1000 * 60 * 6).toISOString(), // 6 mins ago
      created_at: getDateOffset(-1),
      updated_at: new Date(Date.now() - 1000 * 60 * 6).toISOString()
    },
    {
      id: 'conv-2',
      organization_id: orgId,
      property_id: 'p1',
      booking_id: 'b-arr-2',
      guest_id: 'c2',
      room_number: '104',
      status: 'open',
      unread_count: 0,
      last_message_text: 'Could we request a late checkout tomorrow around 1:00 PM?',
      last_message_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      created_at: getDateOffset(-1),
      updated_at: new Date(Date.now() - 1000 * 60 * 45).toISOString()
    },
    {
      id: 'conv-3',
      organization_id: orgId,
      property_id: 'p3',
      booking_id: 'b-arr-3',
      guest_id: 'c5',
      room_number: 'Sea Breeze 2',
      status: 'open',
      unread_count: 0,
      last_message_text: 'The Wi-Fi in the veranda is working great, thanks for sharing the access code!',
      last_message_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      created_at: getDateOffset(0),
      updated_at: new Date(Date.now() - 1000 * 60 * 120).toISOString()
    },
    {
      id: 'conv-4',
      organization_id: orgId,
      property_id: 'p1',
      booking_id: 'b-stay-1',
      guest_id: 'c10',
      room_number: '202',
      status: 'open',
      unread_count: 0,
      last_message_text: 'Thanks for delivering the extra pillows earlier, great hospitality!',
      last_message_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
      created_at: getDateOffset(-1),
      updated_at: new Date(Date.now() - 1000 * 60 * 240).toISOString()
    }
  ];

  const messages: Message[] = [
    // conv-1 (Rahul Sharma - Valley View 204)
    {
      id: 'msg-1',
      conversation_id: 'conv-1',
      sender_type: 'guest',
      sender_name: 'Rahul Sharma',
      sender_id: 'c1',
      body: "Hi! We're on our way and will check in around 2 PM. Looking forward to our stay!",
      created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      read_at: new Date(Date.now() - 1000 * 60 * 170).toISOString()
    },
    {
      id: 'msg-2',
      conversation_id: 'conv-1',
      sender_type: 'staff',
      sender_name: 'Anika Rao',
      sender_id: 'staff-1',
      body: 'Welcome Rahul! Your Valley Deluxe Chalet (Room 204) is ready with fresh tea garden views. Let us know if you need anything at all.',
      created_at: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
      read_at: new Date(Date.now() - 1000 * 60 * 140).toISOString()
    },
    {
      id: 'msg-3',
      conversation_id: 'conv-1',
      sender_type: 'guest',
      sender_name: 'Rahul Sharma',
      sender_id: 'c1',
      body: 'Can you send two extra towels to Room 204?',
      created_at: new Date(Date.now() - 1000 * 60 * 6).toISOString()
    },

    // conv-2 (Priya Patel)
    {
      id: 'msg-4',
      conversation_id: 'conv-2',
      sender_type: 'guest',
      sender_name: 'Priya Patel',
      sender_id: 'c2',
      body: 'Could we request a late checkout tomorrow around 1:00 PM?',
      created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      read_at: new Date(Date.now() - 1000 * 60 * 30).toISOString()
    },
    {
      id: 'msg-5',
      conversation_id: 'conv-2',
      sender_type: 'staff',
      sender_name: 'Arjun Mehta',
      sender_id: 'staff-2',
      body: "We have noted your request, Priya. Let me check tomorrow's departure schedule and confirm back with you shortly!",
      created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      read_at: new Date(Date.now() - 1000 * 60 * 20).toISOString()
    },

    // conv-3 (Neha Gupta)
    {
      id: 'msg-6',
      conversation_id: 'conv-3',
      sender_type: 'staff',
      sender_name: 'Arjun Mehta',
      sender_id: 'staff-2',
      body: 'Welcome to Coral Beach Homestay, Neha! The Wi-Fi network is "CoralBeachGuest" and password is "sunsetparadise". Enjoy the sea breeze!',
      created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      read_at: new Date(Date.now() - 1000 * 60 * 170).toISOString()
    },
    {
      id: 'msg-7',
      conversation_id: 'conv-3',
      sender_type: 'guest',
      sender_name: 'Neha Gupta',
      sender_id: 'c5',
      body: 'The Wi-Fi in the veranda is working great, thanks for sharing the access code!',
      created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      read_at: new Date(Date.now() - 1000 * 60 * 110).toISOString()
    },

    // conv-4 (Rohan Mehta)
    {
      id: 'msg-8',
      conversation_id: 'conv-4',
      sender_type: 'guest',
      sender_name: 'Rohan Mehta',
      sender_id: 'c10',
      body: 'Could we request two extra hypoallergenic pillows for room 202?',
      created_at: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
      read_at: new Date(Date.now() - 1000 * 60 * 290).toISOString()
    },
    {
      id: 'msg-9',
      conversation_id: 'conv-4',
      sender_type: 'staff',
      sender_name: 'Anika Rao',
      sender_id: 'staff-1',
      body: 'Delivering them right now to Room 202!',
      created_at: new Date(Date.now() - 1000 * 60 * 280).toISOString(),
      read_at: new Date(Date.now() - 1000 * 60 * 270).toISOString()
    },
    {
      id: 'msg-10',
      conversation_id: 'conv-4',
      sender_type: 'guest',
      sender_name: 'Rohan Mehta',
      sender_id: 'c10',
      body: 'Thanks for delivering the extra pillows earlier, great hospitality!',
      created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
      read_at: new Date(Date.now() - 1000 * 60 * 230).toISOString()
    }
  ];

  const requests: Request[] = [
    {
      id: 'req-1',
      conversation_id: 'conv-1',
      organization_id: orgId,
      property_id: 'p2',
      booking_id: 'b-arr-1',
      guest_id: 'c1',
      room_number: '204',
      category: 'Extra towels',
      title: 'Two extra towels for Room 204',
      description: 'Guest requested 2 extra bath towels upon arrival.',
      status: 'in_progress',
      assigned_to: 'Anika Rao',
      created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 3).toISOString()
    },
    {
      id: 'req-2',
      conversation_id: 'conv-2',
      organization_id: orgId,
      property_id: 'p1',
      booking_id: 'b-arr-2',
      guest_id: 'c2',
      room_number: '104',
      category: 'Late checkout',
      title: 'Late checkout request (1:00 PM)',
      description: 'Guest requested late checkout extension until 1 PM.',
      status: 'open',
      created_at: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 40).toISOString()
    },
    {
      id: 'req-3',
      conversation_id: 'conv-4',
      organization_id: orgId,
      property_id: 'p1',
      booking_id: 'b-stay-1',
      guest_id: 'c10',
      room_number: '202',
      category: 'Extra pillows',
      title: 'Two hypoallergenic pillows for Room 202',
      description: 'Guest requested extra pillows.',
      status: 'completed',
      assigned_to: 'Anika Rao',
      created_at: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 250).toISOString(),
      completed_at: new Date(Date.now() - 1000 * 60 * 250).toISOString()
    }
  ];

  const notifications: Notification[] = [
    {
      id: 'notif-1',
      organization_id: orgId,
      booking_id: 'b-arr-1',
      customer_id: 'c1',
      channel: 'WhatsApp',
      type: 'Booking Confirmation',
      recipient: '+91 91234 56701',
      status: 'Demo Sent',
      created_at: getDateOffset(-5)
    }
  ];

  const settings: BusinessSettings = {
    name: 'Bookzee Hospitality Stays',
    legalName: 'Bookzee Leisure Private Limited',
    gstin: '29ABCDE1234F1Z5',
    address: '12 Temple Road, Mysuru, Karnataka - 570001',
    phone: '+91 98765 43210',
    email: 'operations@bookzee.local',
    invoicePrefix: 'INV-2026-',
    receiptPrefix: 'RCP-2026-',
    defaultTaxRate: 12,
    termsConditions: '1. Check-in is valid with government-issued photo ID.\n2. Non-smoking policy in all indoor suites.\n3. Damage to property fixtures subject to replacement charge.',
    checkInTime: '14:00',
    checkOutTime: '11:00',
    cancellationPolicy: 'Complimentary cancellation up to 48 hours prior to arrival.'
  };

  return {
    organizations,
    properties,
    customers,
    bookings,
    payments,
    notifications,
    conversations,
    messages,
    requests,
    guest_tokens,
    settings
  };
}

class DemoRepositoryImpl implements IRepository {
  private db: DemoDB;

  constructor() {
    this.db = this.load();
  }

  private load(): DemoDB {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.properties && parsed.customers && parsed.bookings && parsed.conversations && parsed.requests) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read demo database from localStorage, initializing fresh workspace.', e);
    }
    const fresh = getInitialData();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch (e) {
      console.error('Failed to write demo database to localStorage', e);
    }
    return fresh;
  }

  private save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.db));
    } catch (e) {
      console.error('Failed to persist demo database to localStorage', e);
    }
  }

  // --- Properties ---
  async getProperties(): Promise<Property[]> {
    return [...this.db.properties];
  }

  async getProperty(id: string): Promise<Property | null> {
    return this.db.properties.find(p => p.id === id) || null;
  }

  async createProperty(data: Omit<Property, 'id' | 'created_at'>): Promise<Property> {
    const prop: Property = {
      ...data,
      id: generateId('p-'),
      created_at: new Date().toISOString()
    };
    this.db.properties.push(prop);
    this.save();
    return prop;
  }

  async updateProperty(id: string, data: Partial<Property>): Promise<Property> {
    const index = this.db.properties.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Property not found');
    this.db.properties[index] = { ...this.db.properties[index], ...data };
    this.save();
    return this.db.properties[index];
  }

  // --- Customers / Guests ---
  async getCustomers(): Promise<Customer[]> {
    return [...this.db.customers];
  }

  async getCustomer(id: string): Promise<Customer | null> {
    return this.db.customers.find(c => c.id === id) || null;
  }

  async createCustomer(data: Omit<Customer, 'id' | 'created_at'>): Promise<Customer> {
    const cust: Customer = {
      ...data,
      id: generateId('guest-'),
      created_at: new Date().toISOString()
    };
    this.db.customers.push(cust);
    this.save();
    return cust;
  }

  async updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
    const index = this.db.customers.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Customer not found');
    this.db.customers[index] = { ...this.db.customers[index], ...data };
    this.save();
    return this.db.customers[index];
  }

  // --- Bookings ---
  async getBookings(propertyId?: string): Promise<Booking[]> {
    let list = this.db.bookings;
    if (propertyId) {
      list = list.filter(b => b.property_id === propertyId);
    }
    return list.map(b => ({
      ...b,
      customer: this.db.customers.find(c => c.id === b.customer_id),
      property: this.db.properties.find(p => p.id === b.property_id)
    }));
  }

  async getBooking(id: string): Promise<Booking | null> {
    const b = this.db.bookings.find(item => item.id === id);
    if (!b) return null;
    return {
      ...b,
      customer: this.db.customers.find(c => c.id === b.customer_id),
      property: this.db.properties.find(p => p.id === b.property_id)
    };
  }

  async createBooking(data: Omit<Booking, 'id' | 'created_at'>): Promise<Booking> {
    const id = generateId('b-');
    const booking: Booking = {
      ...data,
      id,
      created_at: new Date().toISOString()
    };
    this.db.bookings.push(booking);

    // Auto-create a demo stay token for convenience
    const token = `stay-${id}`;
    this.db.guest_tokens.push({
      id: generateId('tok-'),
      booking_id: id,
      token,
      created_at: new Date().toISOString()
    });

    // Auto-create an open conversation for this booking
    const customer = this.db.customers.find(c => c.id === booking.customer_id);
    const convId = generateId('conv-');
    this.db.conversations.push({
      id: convId,
      organization_id: booking.organization_id || 'org-bookzee-1',
      property_id: booking.property_id,
      booking_id: booking.id,
      guest_id: booking.customer_id,
      room_number: booking.room_number,
      status: 'open',
      unread_count: 0,
      last_message_text: `Reservation ${booking.booking_no} created`,
      last_message_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    this.db.messages.push({
      id: generateId('msg-'),
      conversation_id: convId,
      sender_type: 'staff',
      sender_name: 'Bookzee Operations',
      sender_id: 'system',
      body: `Welcome ${customer?.name || 'Guest'}! Your reservation ${booking.booking_no} for ${booking.room_type}${booking.room_number ? ' (' + booking.room_number + ')' : ''} is confirmed. Message us anytime here during your stay.`,
      created_at: new Date().toISOString()
    });

    this.save();
    return {
      ...booking,
      customer,
      property: this.db.properties.find(p => p.id === booking.property_id)
    };
  }

  async updateBooking(id: string, data: Partial<Booking>): Promise<Booking> {
    const index = this.db.bookings.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Booking not found');
    this.db.bookings[index] = { ...this.db.bookings[index], ...data };
    this.save();
    return {
      ...this.db.bookings[index],
      customer: this.db.customers.find(c => c.id === this.db.bookings[index].customer_id),
      property: this.db.properties.find(p => p.id === this.db.bookings[index].property_id)
    };
  }

  // --- Payments ---
  async getPayments(bookingId?: string): Promise<Payment[]> {
    if (bookingId) {
      return this.db.payments.filter(p => p.booking_id === bookingId);
    }
    return [...this.db.payments];
  }

  async getAllPayments(propertyId?: string): Promise<Payment[]> {
    let payments = [...this.db.payments];
    if (propertyId) {
      const propertyBookingIds = new Set(
        this.db.bookings.filter(b => b.property_id === propertyId).map(b => b.id)
      );
      payments = payments.filter(p => propertyBookingIds.has(p.booking_id));
    }
    return payments.map(p => {
      const booking = this.db.bookings.find(b => b.id === p.booking_id);
      return {
        ...p,
        booking: booking
          ? {
              ...booking,
              customer: this.db.customers.find(c => c.id === booking.customer_id),
              property: this.db.properties.find(prop => prop.id === booking.property_id)
            }
          : undefined
      };
    });
  }

  async createPayment(data: Omit<Payment, 'id' | 'created_at'>): Promise<Payment> {
    const payment: Payment = {
      ...data,
      id: generateId('pay-'),
      created_at: new Date().toISOString()
    };
    this.db.payments.push(payment);

    // Sync booking payment status automatically
    const booking = this.db.bookings.find(b => b.id === payment.booking_id);
    if (booking) {
      const allBookingPayments = this.db.payments.filter(p => p.booking_id === booking.id);
      let totalPaid = 0;
      let totalRefunded = 0;
      for (const p of allBookingPayments) {
        if (p.status === 'Recorded' || p.status === 'Completed') totalPaid += Number(p.amount) || 0;
        else if (p.status === 'Refunded') totalRefunded += Number(p.amount) || 0;
      }
      const net = totalPaid - totalRefunded;
      if (net >= booking.grand_total) {
        booking.payment_status = 'Paid';
      } else if (net > 0) {
        booking.payment_status = 'Partially Paid';
      } else {
        booking.payment_status = 'Unpaid';
      }
    }

    this.save();
    return payment;
  }

  // --- Notifications ---
  async getNotifications(bookingId?: string): Promise<Notification[]> {
    if (bookingId) {
      return this.db.notifications.filter(n => n.booking_id === bookingId);
    }
    return [...this.db.notifications];
  }

  async createNotification(data: Omit<Notification, 'id' | 'created_at'>): Promise<Notification> {
    const notif: Notification = {
      ...data,
      id: generateId('notif-'),
      created_at: new Date().toISOString()
    };
    this.db.notifications.push(notif);
    this.save();
    return notif;
  }

  // --- Conversations & Guest Communication ---
  async getConversations(filters?: {
    propertyId?: string;
    status?: string;
    filterType?: 'all' | 'unread' | 'open_requests' | 'assigned_to_me';
    search?: string;
    guestId?: string;
  }): Promise<Conversation[]> {
    let list = [...this.db.conversations];

    if (filters?.propertyId) {
      list = list.filter(c => c.property_id === filters.propertyId);
    }

    if (filters?.status) {
      list = list.filter(c => c.status === filters.status);
    }

    if (filters?.guestId) {
      list = list.filter(c => c.guest_id === filters.guestId);
    }

    // Hydrate relations
    let hydrated = list.map(c => {
      const guest = this.db.customers.find(cust => cust.id === c.guest_id);
      const property = this.db.properties.find(p => p.id === c.property_id);
      const booking = this.db.bookings.find(b => b.id === c.booking_id);
      const openRequests = this.db.requests.filter(
        r => r.conversation_id === c.id && r.status !== 'completed' && r.status !== 'cancelled'
      );

      return {
        ...c,
        room_number: c.room_number || booking?.room_number,
        guest,
        property,
        booking: booking
          ? {
              ...booking,
              customer: guest,
              property
            }
          : undefined,
        open_requests_count: openRequests.length
      };
    });

    // Apply Filter Type
    if (filters?.filterType === 'unread') {
      hydrated = hydrated.filter(c => c.unread_count > 0);
    } else if (filters?.filterType === 'open_requests') {
      hydrated = hydrated.filter(c => (c.open_requests_count || 0) > 0);
    } else if (filters?.filterType === 'assigned_to_me') {
      // Assigned to logged-in user or active requests
      hydrated = hydrated.filter(c => {
        const hasAssigned = this.db.requests.some(
          r => r.conversation_id === c.id && r.assigned_to && r.status !== 'completed' && r.status !== 'cancelled'
        );
        return hasAssigned;
      });
    }

    // Apply Search
    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      hydrated = hydrated.filter(c =>
        c.guest?.name.toLowerCase().includes(q) ||
        c.booking?.booking_no.toLowerCase().includes(q) ||
        (c.room_number && c.room_number.toLowerCase().includes(q)) ||
        c.property?.name.toLowerCase().includes(q) ||
        c.last_message_text.toLowerCase().includes(q)
      );
    }

    // Sort by latest message descending
    return hydrated.sort(
      (a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
    );
  }

  async getConversation(id: string): Promise<Conversation | null> {
    const c = this.db.conversations.find(conv => conv.id === id);
    if (!c) return null;

    const guest = this.db.customers.find(cust => cust.id === c.guest_id);
    const property = this.db.properties.find(p => p.id === c.property_id);
    const booking = this.db.bookings.find(b => b.id === c.booking_id);
    const openRequests = this.db.requests.filter(
      r => r.conversation_id === c.id && r.status !== 'completed' && r.status !== 'cancelled'
    );

    return {
      ...c,
      room_number: c.room_number || booking?.room_number,
      guest,
      property,
      booking: booking ? { ...booking, customer: guest, property } : undefined,
      open_requests_count: openRequests.length
    };
  }

  async getConversationByBooking(bookingId: string): Promise<Conversation | null> {
    const c = this.db.conversations.find(conv => conv.booking_id === bookingId);
    if (!c) return null;
    return this.getConversation(c.id);
  }

  async createConversation(data: Omit<Conversation, 'id' | 'created_at' | 'updated_at' | 'guest' | 'property' | 'booking' | 'open_requests_count'>): Promise<Conversation> {
    const now = new Date().toISOString();
    const conv: Conversation = {
      ...data,
      id: generateId('conv-'),
      created_at: now,
      updated_at: now
    };
    this.db.conversations.push(conv);
    this.save();
    return (await this.getConversation(conv.id))!;
  }

  async updateConversation(id: string, data: Partial<Conversation>): Promise<Conversation> {
    const index = this.db.conversations.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Conversation not found');
    this.db.conversations[index] = {
      ...this.db.conversations[index],
      ...data,
      updated_at: new Date().toISOString()
    };
    this.save();
    return (await this.getConversation(id))!;
  }

  // --- Messages ---
  async getMessages(conversationId: string): Promise<Message[]> {
    return this.db.messages
      .filter(m => m.conversation_id === conversationId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  async createMessage(data: Omit<Message, 'id' | 'created_at'>): Promise<Message> {
    const now = new Date().toISOString();
    const msg: Message = {
      ...data,
      id: generateId('msg-'),
      created_at: now
    };
    this.db.messages.push(msg);

    // Update conversation metadata
    const convIndex = this.db.conversations.findIndex(c => c.id === data.conversation_id);
    if (convIndex !== -1) {
      this.db.conversations[convIndex].last_message_text = data.body;
      this.db.conversations[convIndex].last_message_at = now;
      this.db.conversations[convIndex].updated_at = now;
      if (data.sender_type === 'guest') {
        this.db.conversations[convIndex].unread_count += 1;
      }
    }

    this.save();
    return msg;
  }

  // --- Requests ---
  async getRequests(filters?: {
    propertyId?: string;
    bookingId?: string;
    conversationId?: string;
    status?: string;
  }): Promise<Request[]> {
    let list = [...this.db.requests];

    if (filters?.propertyId) {
      list = list.filter(r => r.property_id === filters.propertyId);
    }
    if (filters?.bookingId) {
      list = list.filter(r => r.booking_id === filters.bookingId);
    }
    if (filters?.conversationId) {
      list = list.filter(r => r.conversation_id === filters.conversationId);
    }
    if (filters?.status) {
      list = list.filter(r => r.status === filters.status);
    }

    return list.map(r => {
      const guest = this.db.customers.find(c => c.id === r.guest_id);
      const property = this.db.properties.find(p => p.id === r.property_id);
      const booking = this.db.bookings.find(b => b.id === r.booking_id);
      return {
        ...r,
        room_number: r.room_number || booking?.room_number,
        guest,
        property,
        booking
      };
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  async getRequest(id: string): Promise<Request | null> {
    const r = this.db.requests.find(item => item.id === id);
    if (!r) return null;
    const guest = this.db.customers.find(c => c.id === r.guest_id);
    const property = this.db.properties.find(p => p.id === r.property_id);
    const booking = this.db.bookings.find(b => b.id === r.booking_id);
    return {
      ...r,
      room_number: r.room_number || booking?.room_number,
      guest,
      property,
      booking
    };
  }

  async createRequest(data: Omit<Request, 'id' | 'created_at' | 'updated_at' | 'guest' | 'property' | 'booking'>): Promise<Request> {
    const now = new Date().toISOString();
    const req: Request = {
      ...data,
      id: generateId('req-'),
      created_at: now,
      updated_at: now
    };
    this.db.requests.push(req);
    this.save();
    return (await this.getRequest(req.id))!;
  }

  async updateRequest(id: string, data: Partial<Request>): Promise<Request> {
    const index = this.db.requests.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Request not found');

    const now = new Date().toISOString();
    const current = this.db.requests[index];
    const updated = {
      ...current,
      ...data,
      updated_at: now
    };

    if (data.status === 'completed' && !current.completed_at) {
      updated.completed_at = now;
    }

    this.db.requests[index] = updated;
    this.save();
    return (await this.getRequest(id))!;
  }

  // --- Guest Stay Portal ---
  async getStayByToken(token: string): Promise<{
    booking: Booking;
    customer: Customer;
    property: Property;
    conversation: Conversation;
    requests: Request[];
    messages: Message[];
  } | null> {
    const tokenRecord = this.db.guest_tokens.find(t => t.token === token);
    if (!tokenRecord) {
      // Also allow direct lookup by booking ID for demo flexibility
      const directBooking = this.db.bookings.find(b => b.id === token || b.booking_no === token);
      if (!directBooking) return null;
      return this.assembleStayData(directBooking.id);
    }

    if (tokenRecord.revoked_at) {
      return null;
    }

    return this.assembleStayData(tokenRecord.booking_id);
  }

  private async assembleStayData(bookingId: string) {
    const booking = await this.getBooking(bookingId);
    if (!booking || !booking.customer || !booking.property) return null;

    let conversation = await this.getConversationByBooking(bookingId);
    if (!conversation) {
      // Auto-create conversation if none existed
      conversation = await this.createConversation({
        organization_id: booking.organization_id || 'org-bookzee-1',
        property_id: booking.property_id,
        booking_id: booking.id,
        guest_id: booking.customer_id,
        room_number: booking.room_number,
        status: 'open',
        unread_count: 0,
        last_message_text: `Welcome to ${booking.property.name}!`,
        last_message_at: new Date().toISOString()
      });
    }

    const [requests, messages] = await Promise.all([
      this.getRequests({ bookingId }),
      this.getMessages(conversation.id)
    ]);

    return {
      booking,
      customer: booking.customer,
      property: booking.property,
      conversation,
      requests,
      messages
    };
  }

  async createStayMessage(token: string, body: string): Promise<Message> {
    const stay = await this.getStayByToken(token);
    if (!stay) throw new Error('Stay session not found');

    return this.createMessage({
      conversation_id: stay.conversation.id,
      sender_type: 'guest',
      sender_name: stay.customer.name,
      sender_id: stay.customer.id,
      body: body.trim()
    });
  }

  async createStayRequest(token: string, category: RequestCategory, title: string, description?: string): Promise<Request> {
    const stay = await this.getStayByToken(token);
    if (!stay) throw new Error('Stay session not found');

    const req = await this.createRequest({
      conversation_id: stay.conversation.id,
      organization_id: stay.booking.organization_id || 'org-bookzee-1',
      property_id: stay.property.id,
      booking_id: stay.booking.id,
      guest_id: stay.customer.id,
      room_number: stay.booking.room_number,
      category,
      title,
      description,
      status: 'open'
    });

    // Also post an automated notification message to the conversation thread
    await this.createMessage({
      conversation_id: stay.conversation.id,
      sender_type: 'guest',
      sender_name: stay.customer.name,
      sender_id: stay.customer.id,
      body: `[Request: ${category}] ${title}${description ? ' — ' + description : ''}`
    });

    return req;
  }

  // --- Settings ---
  async getSettings(): Promise<BusinessSettings> {
    return { ...this.db.settings };
  }

  async updateSettings(data: Partial<BusinessSettings>): Promise<BusinessSettings> {
    this.db.settings = { ...this.db.settings, ...data };
    this.save();
    return { ...this.db.settings };
  }

  // --- Reset Demo Data ---
  async resetDemoData(): Promise<void> {
    this.db = getInitialData();
    this.save();
  }
}

export const repository = new DemoRepositoryImpl();
