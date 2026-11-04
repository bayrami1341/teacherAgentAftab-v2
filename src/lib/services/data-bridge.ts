import { School, PlatformModuleId, ClassData } from '../../types';
import { initialSchools, initialSchoolClasses, initialSchoolTeachers, generateMockClass } from '../../utils/mockData';
import { auditLogger } from '../audit/audit-logger';

export interface FinancialVoucher {
  id: string;
  schoolId: string;
  schoolName: string;
  amount: number; // in Tomans
  type: 'payment' | 'invoice' | 'discount' | 'credit';
  date: string; // Jalali format
  refNumber: string;
  description: string;
  status: 'confirmed' | 'pending' | 'rejected';
}

export type TicketCategory = 'ITIL_HARDWARE' | 'ITIL_SOFTWARE' | 'ITIL_PEDAGOGY';

export interface TicketMessage {
  id: string;
  sender: string;
  role: 'user' | 'support';
  message: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  schoolId: string;
  schoolName: string;
  creatorName: string;
  category: TicketCategory;
  priority: 'low' | 'medium' | 'high' | 'critical';
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

export interface CommittedRosterStudent {
  id: string;
  name: string;
  nationalCode: string;
  parentPhone: string;
  pinCode: string;
  deskCode: string;
}

export interface CommittedRosterClass {
  id: string;
  schoolId: string;
  className: string;
  grade: number;
  committedAt: string;
  students: CommittedRosterStudent[];
}

// Demo Sandbox Seed Data for "دبستان نمونه آفتاب"
const DEMO_SANDBOX_SCHOOL: School = {
  id: 'sch-aftab-demo',
  name: 'دبستان نمونه آفتاب (نسخه دمو)',
  username: 'aftab_demo',
  type: 'school',
  startDate: '۱۴۰۳/۰۷/۰۱',
  endDate: '۱۴۰۴/۰۷/۰۱',
  seatsTotal: 300,
  seatsUsed: 145,
  status: 'active',
  enabledModules: ['javaneh_garden', 'teacher_assistant', 'math_game', 'rosha_v1', 'teacher_widgets'],
};

const DEMO_INITIAL_VOUCHERS: FinancialVoucher[] = [
  {
    id: 'v-101',
    schoolId: 'sch-aftab-demo',
    schoolName: 'دبستان نمونه آفتاب (نسخه دمو)',
    amount: 15000000,
    type: 'invoice',
    date: '۱۴۰۳/۰۷/۰۵',
    refNumber: 'INV-4030705-1',
    description: 'صورت‌حساب لایسنس سالانه ۱۵۰ کاربر فعال پلتفرم جوانه و پداگوژی آفتاب',
    status: 'confirmed',
  },
  {
    id: 'v-102',
    schoolId: 'sch-aftab-demo',
    schoolName: 'دبستان نمونه آفتاب (نسخه دمو)',
    amount: 10000000,
    type: 'payment',
    date: '۱۴۰۳/۰۷/۱۰',
    refNumber: 'PAY-88291042',
    description: 'پرداخت پیش‌پرداخت قرارداد از طریق چک صیادی شماره ۰۹۱۲۴۸',
    status: 'confirmed',
  },
  {
    id: 'v-103',
    schoolId: 'sch-1',
    schoolName: 'دبستان شهید بهشتی',
    amount: 8000000,
    type: 'payment',
    date: '۱۴۰۳/۰۸/۰۱',
    refNumber: 'PAY-44102931',
    description: 'تسویه قسط اول قرارداد سالانه',
    status: 'confirmed',
  },
];

const DEMO_INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-801',
    schoolId: 'sch-aftab-demo',
    schoolName: 'دبستان نمونه آفتاب (نسخه دمو)',
    creatorName: 'خانم مرادی (معلم پایه سوم)',
    category: 'ITIL_HARDWARE',
    priority: 'high',
    subject: 'عدم انطباق رزولوشن ویدیوپروجکتور کلاس سوم الف در حالت ایمن',
    status: 'in_progress',
    createdAt: '۱۴۰۳/۰۸/۱۲ - ۰۹:۳۰',
    updatedAt: '۱۴۰۳/۰۸/۱۲ - ۱۰:۱۵',
    messages: [
      {
        id: 'msg-1',
        sender: 'خانم مرادی (معلم پایه سوم)',
        role: 'user',
        message: 'هنگام فعال کردن حالت ایمن پروجکتور، تصویر حاشیه راست کلاس از کادر خارج می‌شود.',
        timestamp: '۰۹:۳۰ UTC',
      },
      {
        id: 'msg-2',
        sender: 'پشتیبانی فنی آفتاب (مهندس حسینی)',
        role: 'support',
        message: 'با درود؛ تنظیمات Aspect Ratio کادر درگاه پروجکتور روی 16:9 تثبیت شد. لطفاً کلید F11 را مجدداً فشار دهید.',
        timestamp: '۱۰:۱۵ UTC',
      },
    ],
  },
  {
    id: 'tkt-802',
    schoolId: 'sch-1',
    schoolName: 'دبستان شهید بهشتی',
    creatorName: 'مدیریت مدرسه (آقای بهرامی)',
    category: 'ITIL_SOFTWARE',
    priority: 'medium',
    subject: 'درخواست افزودن ستون کد ملی در استخراج فایل اکسل روسترینگ',
    status: 'open',
    createdAt: '۱۴۰۳/۰۸/۱۴ - ۱۱:۰۰',
    updatedAt: '۱۴۰۳/۰۸/۱۴ - ۱۱:۰۰',
    messages: [
      {
        id: 'msg-3',
        sender: 'مدیریت مدرسه (آقای بهرامی)',
        role: 'user',
        message: 'امکان چاپ کارت‌های پین دانش‌آموزی بر اساس ترتیب حروف الفبا وجود دارد؟',
        timestamp: '۱۱:۰۰ UTC',
      },
    ],
  },
  {
    id: 'tkt-803',
    schoolId: 'sch-aftab-demo',
    schoolName: 'دبستان نمونه آفتاب (نسخه دمو)',
    creatorName: 'آقای صالحی (سرگروه ریاضی)',
    category: 'ITIL_PEDAGOGY',
    priority: 'low',
    subject: 'درخواست افزودن تمرینات اعشار و حجم برای پایه پنجم در ماژول روشا',
    status: 'resolved',
    createdAt: '۱۴۰۳/۰۸/۰۱ - ۰۸:۰۰',
    updatedAt: '۱۴۰۳/۰۸/۰۳ - ۱۴:۲۰',
    messages: [
      {
        id: 'msg-4',
        sender: 'آقای صالحی (سرگروه ریاضی)',
        role: 'user',
        message: 'محتوای گلوگاه‌های شناختی اعشار و تبدیل واحدهای حجم به پکیج آنلاین اضافه شد؟',
        timestamp: '۰۸:۰۰ UTC',
      },
      {
        id: 'msg-5',
        sender: 'دستیار پداگوژی آفتاب',
        role: 'support',
        message: 'بله، کارتریج پایه ۵ شامل دهان‌های dec_point_sum_digits و volume_capacity_mismatch در نسخه جدید فعال گردید.',
        timestamp: '۱۴:۲۰ UTC',
      },
    ],
  },
];

class DataBridgeService {
  private schools: School[] = [];
  private vouchers: FinancialVoucher[] = [];
  private tickets: SupportTicket[] = [];
  private committedRosters: CommittedRosterClass[] = [];
  private listeners: Array<() => void> = [];

  constructor() {
    this.initializeState();
  }

  private initializeState() {
    try {
      const storedSchools = localStorage.getItem('aftab_schools');
      const storedVouchers = localStorage.getItem('aftab_vouchers');
      const storedTickets = localStorage.getItem('aftab_tickets');
      const storedRosters = localStorage.getItem('aftab_rosters');

      if (storedSchools) {
        this.schools = JSON.parse(storedSchools);
      } else {
        this.schools = [DEMO_SANDBOX_SCHOOL, ...initialSchools];
      }

      if (storedVouchers) {
        this.vouchers = JSON.parse(storedVouchers);
      } else {
        this.vouchers = [...DEMO_INITIAL_VOUCHERS];
      }

      if (storedTickets) {
        this.tickets = JSON.parse(storedTickets);
      } else {
        this.tickets = [...DEMO_INITIAL_TICKETS];
      }

      if (storedRosters) {
        this.committedRosters = JSON.parse(storedRosters);
      } else {
        this.committedRosters = [];
      }
    } catch (e) {
      console.warn('Failed to parse state from localStorage, resetting to default demo seed:', e);
      this.resetToDemoSandbox();
    }
  }

  private persistAndNotify() {
    try {
      localStorage.setItem('aftab_schools', JSON.stringify(this.schools));
      localStorage.setItem('aftab_vouchers', JSON.stringify(this.vouchers));
      localStorage.setItem('aftab_tickets', JSON.stringify(this.tickets));
      localStorage.setItem('aftab_rosters', JSON.stringify(this.committedRosters));
    } catch (e) {
      console.warn('Error saving state to localStorage:', e);
    }
    this.listeners.forEach((cb) => cb());
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  // --- SCHOOL MANAGEMENT ---
  public getSchools(): School[] {
    return [...this.schools];
  }

  public getSchoolById(schoolId: string): School | undefined {
    return this.schools.find((s) => s.id === schoolId);
  }

  public addSchool(schoolData: Partial<School>): School {
    const newSchool: School = {
      id: `sch-${Date.now()}`,
      name: schoolData.name || 'مدرسه جدید',
      username: schoolData.username || `school_${Date.now().toString(36)}`,
      type: schoolData.type || 'school',
      startDate: schoolData.startDate || '۱۴۰۳/۰۸/۰۱',
      endDate: schoolData.endDate || '۱۴۰۴/۰۷/۰۱',
      seatsTotal: schoolData.seatsTotal || 100,
      seatsUsed: schoolData.seatsUsed || 0,
      status: 'active',
      enabledModules: schoolData.enabledModules || ['javaneh_garden', 'teacher_assistant', 'math_game'],
    };

    this.schools.unshift(newSchool);

    // Record initial invoice voucher
    const initialInvoice: FinancialVoucher = {
      id: `v-${Date.now()}`,
      schoolId: newSchool.id,
      schoolName: newSchool.name,
      amount: newSchool.seatsTotal * 100000, // 100k Tomans per seat
      type: 'invoice',
      date: new Date().toLocaleDateString('fa-IR'),
      refNumber: `INV-${Date.now().toString().slice(-6)}`,
      description: `صدور لایسنس قرارداد جدید برای ${newSchool.seatsTotal} صندلی کاربر`,
      status: 'confirmed',
    };
    this.vouchers.unshift(initialInvoice);

    auditLogger.logSecurityLicense('SCHOOL_ADDED', {
      schoolId: newSchool.id,
      schoolName: newSchool.name,
      seatsTotal: newSchool.seatsTotal,
    });

    this.persistAndNotify();
    return newSchool;
  }

  public updateSchoolStatus(schoolId: string, status: 'active' | 'suspended' | 'expired'): void {
    this.schools = this.schools.map((s) => (s.id === schoolId ? { ...s, status } : s));
    auditLogger.logSecurityLicense('SCHOOL_STATUS_CHANGED', { schoolId, newStatus: status });
    this.persistAndNotify();
  }

  public updateSchoolSeats(schoolId: string, seatsTotal: number): void {
    this.schools = this.schools.map((s) => (s.id === schoolId ? { ...s, seatsTotal } : s));
    auditLogger.logSecurityLicense('SCHOOL_SEATS_UPDATED', { schoolId, seatsTotal });
    this.persistAndNotify();
  }

  // --- FINANCIAL LEDGER & PAYMENTS ---
  public getVouchers(schoolId?: string): FinancialVoucher[] {
    if (schoolId) {
      return this.vouchers.filter((v) => v.schoolId === schoolId);
    }
    return [...this.vouchers];
  }

  public recordPayment(
    schoolId: string,
    paymentData: {
      amount: number;
      description: string;
      refNumber?: string;
      type?: 'payment' | 'invoice' | 'discount' | 'credit';
    }
  ): FinancialVoucher {
    const school = this.getSchoolById(schoolId);
    const voucher: FinancialVoucher = {
      id: `v-${Date.now()}`,
      schoolId,
      schoolName: school ? school.name : 'مدرسه نا مشخص',
      amount: paymentData.amount,
      type: paymentData.type || 'payment',
      date: new Date().toLocaleDateString('fa-IR'),
      refNumber: paymentData.refNumber || `PAY-${Math.floor(10000000 + Math.random() * 90000000)}`,
      description: paymentData.description,
      status: 'confirmed',
    };

    this.vouchers.unshift(voucher);

    auditLogger.logSecurityLicense('PAYMENT_RECORDED', {
      schoolId,
      amount: paymentData.amount,
      refNumber: voucher.refNumber,
    });

    this.persistAndNotify();
    return voucher;
  }

  public getSchoolFinancialSummary(schoolId: string): {
    totalBilled: number;
    totalPaid: number;
    balance: number; // Positive = Debtor (بدهکار), 0 = Settled
  } {
    const schoolVouchers = this.getVouchers(schoolId);
    let totalBilled = 0;
    let totalPaid = 0;

    for (const v of schoolVouchers) {
      if (v.type === 'invoice') totalBilled += v.amount;
      if (v.type === 'payment' || v.type === 'discount') totalPaid += v.amount;
    }

    return {
      totalBilled,
      totalPaid,
      balance: Math.max(0, totalBilled - totalPaid),
    };
  }

  // --- ITIL TICKETING ---
  public getTickets(schoolId?: string): SupportTicket[] {
    if (schoolId) {
      return this.tickets.filter((t) => t.schoolId === schoolId);
    }
    return [...this.tickets];
  }

  public createTicket(ticketData: {
    schoolId: string;
    schoolName: string;
    creatorName: string;
    category: TicketCategory;
    priority: 'low' | 'medium' | 'high' | 'critical';
    subject: string;
    message: string;
  }): SupportTicket {
    const newTicket: SupportTicket = {
      id: `tkt-${Math.floor(100 + Math.random() * 900)}`,
      schoolId: ticketData.schoolId,
      schoolName: ticketData.schoolName,
      creatorName: ticketData.creatorName,
      category: ticketData.category,
      priority: ticketData.priority,
      subject: ticketData.subject,
      status: 'open',
      createdAt: new Date().toLocaleString('fa-IR'),
      updatedAt: new Date().toLocaleString('fa-IR'),
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: ticketData.creatorName,
          role: 'user',
          message: ticketData.message,
          timestamp: new Date().toLocaleTimeString('fa-IR'),
        },
      ],
    };

    this.tickets.unshift(newTicket);

    auditLogger.logSystemError(`ITIL Support Ticket Created: ${newTicket.subject}`, {
      ticketId: newTicket.id,
      category: newTicket.category,
      priority: newTicket.priority,
    });

    this.persistAndNotify();
    return newTicket;
  }

  public addTicketReply(
    ticketId: string,
    sender: string,
    role: 'user' | 'support',
    message: string
  ): SupportTicket | undefined {
    const ticketIndex = this.tickets.findIndex((t) => t.id === ticketId);
    if (ticketIndex === -1) return undefined;

    const ticket = this.tickets[ticketIndex];
    const reply: TicketMessage = {
      id: `msg-${Date.now()}`,
      sender,
      role,
      message,
      timestamp: new Date().toLocaleTimeString('fa-IR'),
    };

    const updatedTicket: SupportTicket = {
      ...ticket,
      status: role === 'support' ? 'in_progress' : 'open',
      updatedAt: new Date().toLocaleString('fa-IR'),
      messages: [...ticket.messages, reply],
    };

    this.tickets[ticketIndex] = updatedTicket;
    this.persistAndNotify();
    return updatedTicket;
  }

  public updateTicketStatus(ticketId: string, status: SupportTicket['status']): void {
    this.tickets = this.tickets.map((t) => (t.id === ticketId ? { ...t, status } : t));
    this.persistAndNotify();
  }

  // --- ROSTERING & EXCEL IMPORT ---
  public getCommittedRosters(schoolId?: string): CommittedRosterClass[] {
    if (schoolId) {
      return this.committedRosters.filter((r) => r.schoolId === schoolId);
    }
    return [...this.committedRosters];
  }

  public commitRoster(
    schoolId: string,
    classData: {
      className: string;
      grade: number;
      students: Array<{ name: string; nationalCode?: string; parentPhone?: string }>;
    }
  ): CommittedRosterClass {
    const school = this.getSchoolById(schoolId);
    const committedStudents: CommittedRosterStudent[] = classData.students.map((st, idx) => ({
      id: `st-${Date.now()}-${idx}`,
      name: st.name,
      nationalCode: st.nationalCode || `00${Math.floor(10000000 + Math.random() * 90000000)}`,
      parentPhone: st.parentPhone || `0912${Math.floor(1000000 + Math.random() * 9000000)}`,
      pinCode: Math.floor(1000 + Math.random() * 9000).toString(),
      deskCode: `DESK-${(idx + 1).toString().padStart(2, '0')}`,
    }));

    const rosterClass: CommittedRosterClass = {
      id: `roster-cls-${Date.now()}`,
      schoolId,
      className: classData.className,
      grade: classData.grade,
      committedAt: new Date().toLocaleString('fa-IR'),
      students: committedStudents,
    };

    this.committedRosters.unshift(rosterClass);

    // Update school seats used
    if (school) {
      const newSeatsUsed = school.seatsUsed + committedStudents.length;
      this.updateSchoolSeats(schoolId, Math.max(school.seatsTotal, newSeatsUsed));
      this.schools = this.schools.map((s) => (s.id === schoolId ? { ...s, seatsUsed: newSeatsUsed } : s));
    }

    auditLogger.logClinicalAccess('admin', `ROSTER_COMMIT_${classData.className}`, 'WRITE', {
      schoolId,
      studentsCount: committedStudents.length,
      grade: classData.grade,
    });

    this.persistAndNotify();
    return rosterClass;
  }

  // --- DEMO SANDBOX RESET ---
  public resetToDemoSandbox(): void {
    this.schools = [DEMO_SANDBOX_SCHOOL, ...initialSchools];
    this.vouchers = [...DEMO_INITIAL_VOUCHERS];
    this.tickets = [...DEMO_INITIAL_TICKETS];
    this.committedRosters = [];

    auditLogger.logSecurityLicense('DEMO_SANDBOX_RESET', {
      timestamp: new Date().toISOString(),
      school: DEMO_SANDBOX_SCHOOL.name,
    });

    this.persistAndNotify();
  }
}

export const dataBridge = new DataBridgeService();
