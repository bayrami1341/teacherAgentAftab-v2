import React, { useState, useEffect } from 'react';
import { LifeBuoy, MessageSquare, Plus, Send, ShieldAlert, Cpu, Wrench, CheckCircle2, Clock, Filter } from 'lucide-react';
import { dataBridge, SupportTicket, TicketCategory } from '../lib/services/data-bridge';
import { sound } from '../utils/audio';

interface SupportTicketingWorkspaceProps {
  onBackToMain?: () => void;
}

export const SupportTicketingWorkspace: React.FC<SupportTicketingWorkspaceProps> = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [activeCategory, setActiveCategory] = useState<TicketCategory | 'ALL'>('ALL');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [replyText, setReplyText] = useState('');

  // New ticket fields
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<TicketCategory>('ITIL_HARDWARE');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [message, setMessage] = useState('');

  const loadTickets = () => {
    const list = dataBridge.getTickets();
    setTickets(list);
    if (selectedTicket) {
      const updated = list.find((t) => t.id === selectedTicket.id);
      if (updated) setSelectedTicket(updated);
    }
  };

  useEffect(() => {
    loadTickets();
    const unsubscribe = dataBridge.subscribe(() => {
      loadTickets();
    });
    return unsubscribe;
  }, []);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    dataBridge.createTicket({
      schoolId: 'sch-aftab-demo',
      schoolName: 'دبستان نمونه آفتاب',
      creatorName: 'کاربر سیستم',
      category,
      priority,
      subject: subject.trim(),
      message: message.trim(),
    });

    sound.playJoyfulChime();
    setSubject('');
    setMessage('');
    setShowNewModal(false);
    loadTickets();
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    dataBridge.addTicketReply(selectedTicket.id, 'پشتیبانی آفتاب', 'support', replyText.trim());
    sound.playPlantClick(600);
    setReplyText('');
    loadTickets();
  };

  const filteredTickets = tickets.filter((t) => {
    if (activeCategory === 'ALL') return true;
    return t.category === activeCategory;
  });

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6 dir-rtl text-slate-100">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <LifeBuoy className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              مرکز پشتیبانی و تیکتینگ ITIL آفتاب
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              مدیریت سه‌گانه تیکت‌های سخت‌افزاری (پروجکتور/شبکه)، نرم‌افزاری و پداگوژی آموزشی
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="px-5 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-cyan-900/40"
        >
          <Plus className="w-4 h-4" />
          ثبت تیکت پشتیبانی جدید
        </button>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Tickets List */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col space-y-4">
          
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-800/60 rounded-2xl border border-slate-700/50 text-xs">
            <button
              onClick={() => setActiveCategory('ALL')}
              className={`flex-1 py-2 rounded-xl font-medium transition-colors ${
                activeCategory === 'ALL' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              همه ({tickets.length})
            </button>
            <button
              onClick={() => setActiveCategory('ITIL_HARDWARE')}
              className={`flex-1 py-2 rounded-xl font-medium transition-colors flex items-center justify-center gap-1 ${
                activeCategory === 'ITIL_HARDWARE' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              سخت‌افزار
            </button>
            <button
              onClick={() => setActiveCategory('ITIL_SOFTWARE')}
              className={`flex-1 py-2 rounded-xl font-medium transition-colors flex items-center justify-center gap-1 ${
                activeCategory === 'ITIL_SOFTWARE' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              نرم‌افزار
            </button>
            <button
              onClick={() => setActiveCategory('ITIL_PEDAGOGY')}
              className={`flex-1 py-2 rounded-xl font-medium transition-colors flex items-center justify-center gap-1 ${
                activeCategory === 'ITIL_PEDAGOGY' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              پداگوژی
            </button>
          </div>

          {/* Tickets Cards */}
          <div className="space-y-3 overflow-y-auto max-h-[600px] pr-1">
            {filteredTickets.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                تیکتی در این دسته‌بندی یافت نشد.
              </div>
            ) : (
              filteredTickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedTicket?.id === t.id
                      ? 'bg-slate-800 border-cyan-500/50 shadow-md'
                      : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        t.category === 'ITIL_HARDWARE'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : t.category === 'ITIL_SOFTWARE'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {t.category === 'ITIL_HARDWARE' ? 'سخت‌افزار' : t.category === 'ITIL_SOFTWARE' ? 'نرم‌افزار' : 'پداگوژی'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{t.createdAt}</span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-200 line-clamp-1">{t.subject}</h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{t.messages[0]?.message}</p>

                  <div className="flex items-center justify-between mt-3 text-[10px] text-slate-400 border-t border-slate-800/80 pt-2">
                    <span>{t.schoolName}</span>
                    <span className={`font-semibold ${t.status === 'resolved' ? 'text-emerald-400' : 'text-cyan-400'}`}>
                      {t.status === 'open' ? 'باز' : t.status === 'in_progress' ? 'در حال بررسی' : 'بسته شده'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

        {/* Right Column: Ticket Conversation Thread */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between min-h-[500px]">
          {selectedTicket ? (
            <div className="flex flex-col h-full justify-between space-y-6">
              
              {/* Thread Header */}
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500">کد تیکت: #{selectedTicket.id}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">اولویت:</span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${
                        selectedTicket.priority === 'critical' || selectedTicket.priority === 'high'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {selectedTicket.priority}
                    </span>
                  </div>
                </div>
                <h2 className="text-base font-bold text-white mt-2">{selectedTicket.subject}</h2>
                <p className="text-xs text-slate-400 mt-1">فرستنده: {selectedTicket.creatorName} ({selectedTicket.schoolName})</p>
              </div>

              {/* Messages History */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 max-h-[400px]">
                {selectedTicket.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.role === 'support' ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-[85%] p-4 rounded-2xl text-xs space-y-1.5 ${
                        m.role === 'support'
                          ? 'bg-cyan-950/60 border border-cyan-800/50 text-cyan-100 rounded-tr-none'
                          : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 border-b border-slate-700/40 pb-1 text-[10px] text-slate-400">
                        <span className="font-semibold">{m.sender}</span>
                        <span>{m.timestamp}</span>
                      </div>
                      <p className="whitespace-pre-wrap leading-relaxed">{m.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="pt-4 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="پاسخ به تیکت پشتیبانی..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  ارسال پاسخ
                </button>
              </form>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-20 text-slate-500 text-xs text-center">
              <MessageSquare className="w-12 h-12 text-slate-700 mb-3" />
              جهت مشاهده گفتگو و پاسخ‌دهی، یک تیکت را از لیست سمت راست انتخاب کنید.
            </div>
          )}
        </div>

      </div>

      {/* New Ticket Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-white">ثبت تیکت پشتیبانی جدید</h2>
            
            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">عنوان تیکت</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="موضوع مشکل یا درخواست..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">دسته ITIL</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="ITIL_HARDWARE">سخت‌افزار (پروجکتور/شبکه)</option>
                    <option value="ITIL_SOFTWARE">نرم‌افزار (سامانه/لایسنس)</option>
                    <option value="ITIL_PEDAGOGY">پداگوژی (محتوا/ریاضی)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">اولویت</label>
                  <select
                    value={priority}
                    onChange={(e: any) => setPriority(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="low">کم</option>
                    <option value="medium">متوسط</option>
                    <option value="high">زیاد</option>
                    <option value="critical">بحرانی</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">متن پیام</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="شرح دقیق مشکل یا درخواست..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-900/30"
                >
                  ثبت تیکت
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
