import { addDays, subDays, format } from 'date-fns';

const today = new Date();

export const DOCTORS = [
  { id: 'd1', name: 'Dr. Priya Sharma', speciality: 'General Physician', avatar: 'PS' },
  { id: 'd2', name: 'Dr. Rahul Mehta', speciality: 'Internal Medicine', avatar: 'RM' },
  { id: 'd3', name: 'Dr. Anita Desai', speciality: 'Paediatrician', avatar: 'AD' },
];

export const INITIAL_PATIENTS = [
  {
    id: 'p1', name: 'Ramesh Patil', phone: '9876543210',
    visitDate: format(subDays(today, 6), 'yyyy-MM-dd'),
    doctorId: 'd1', complaint: 'Fever and body ache',
    status: 'responded', linkSent: true,
    feedback: {
      improvement: 'recovered', daysToRecover: 4,
      sideEffects: false, referredElsewhere: false,
      satisfaction: 5, notes: 'Medicines worked well.'
    }
  },
  {
    id: 'p2', name: 'Sunita Kulkarni', phone: '9823456789',
    visitDate: format(subDays(today, 4), 'yyyy-MM-dd'),
    doctorId: 'd2', complaint: 'Headache and nausea',
    status: 'pending', linkSent: true, feedback: null
  },
  {
    id: 'p3', name: 'Ajay Nair', phone: '9765432109',
    visitDate: format(subDays(today, 5), 'yyyy-MM-dd'),
    doctorId: 'd1', complaint: 'Cough and cold',
    status: 'responded', linkSent: true,
    feedback: {
      improvement: 'partial', daysToRecover: null,
      sideEffects: true, referredElsewhere: false,
      satisfaction: 3, notes: 'Slight rash appeared after antibiotic.'
    }
  },
  {
    id: 'p4', name: 'Meena Joshi', phone: '9812345678',
    visitDate: format(subDays(today, 7), 'yyyy-MM-dd'),
    doctorId: 'd3', complaint: 'Child fever 103°F',
    status: 'no-response', linkSent: true, feedback: null
  },
  {
    id: 'p5', name: 'Vikram Rao', phone: '9754321098',
    visitDate: format(subDays(today, 3), 'yyyy-MM-dd'),
    doctorId: 'd2', complaint: 'Back pain',
    status: 'responded', linkSent: true,
    feedback: {
      improvement: 'worsened', daysToRecover: null,
      sideEffects: false, referredElsewhere: true,
      satisfaction: 2, notes: 'Pain increased. Referred to orthopaedic.'
    }
  },
  {
    id: 'p6', name: 'Kavya Iyer', phone: '9698765432',
    visitDate: format(subDays(today, 1), 'yyyy-MM-dd'),
    doctorId: 'd1', complaint: 'Allergic reaction',
    status: 'scheduled', linkSent: false, feedback: null
  },
  {
    id: 'p7', name: 'Deepak Sawant', phone: '9587654321',
    visitDate: format(subDays(today, 5), 'yyyy-MM-dd'),
    doctorId: 'd3', complaint: 'Stomach infection',
    status: 'responded', linkSent: true,
    feedback: {
      improvement: 'recovered', daysToRecover: 3,
      sideEffects: false, referredElsewhere: false,
      satisfaction: 5, notes: 'Fully recovered.'
    }
  },
  {
    id: 'p8', name: 'Priya Bhat', phone: '9476543210',
    visitDate: format(subDays(today, 2), 'yyyy-MM-dd'),
    doctorId: 'd2', complaint: 'Diabetes follow-up',
    status: 'pending', linkSent: true, feedback: null
  },
];

export const STATUS_META = {
  recovered:  { label: 'Recovered',     color: '#10B981', bg: 'rgba(16,185,129,0.12)',  pulse: 'pulse-green' },
  partial:    { label: 'Partially better', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', pulse: 'pulse-amber' },
  worsened:   { label: 'Worsened',      color: '#EF4444', bg: 'rgba(239,68,68,0.12)',   pulse: 'pulse-red'   },
  pending:    { label: 'Awaiting response', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', pulse: 'pulse-amber' },
  'no-response': { label: 'No response', color: '#EF4444', bg: 'rgba(239,68,68,0.12)', pulse: 'pulse-red' },
  scheduled:  { label: 'Link pending',  color: '#3B82F6', bg: 'rgba(59,130,246,0.12)',  pulse: '' },
  responded:  { label: 'Responded',     color: '#10B981', bg: 'rgba(16,185,129,0.12)',  pulse: 'pulse-green' },
};
