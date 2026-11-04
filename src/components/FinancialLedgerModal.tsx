import React, { useState, useEffect } from 'react';
import { X, DollarSign, CreditCard, Receipt, FileText, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { dataBridge, FinancialVoucher } from '../lib/services/data-bridge';
import { sound } from '../utils/audio';

interface FinancialLedgerModalProps {
  schoolId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const FinancialLedgerModal: React.FC<FinancialLedgerModalProps> = ({ schoolId, isOpen, onClose }) => {
  const [vouchers, setVouchers] = useState<FinancialVoucher[]>([]);
  const [amount, setAmount] = useState<string>('5000000');
  const [description, setDescription] = useState<string>('');
  const [refNumber, setRefNumber] = useState<string>('');
  const [voucherType, setVoucherType] = useState<'payment' | 'invoice' | 'discount'>('payment');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(schoolId || 'sch-aftab-demo');

  const schools = dataBridge.getSchools();

  const loadData = () => {
    setVouchers(dataBridge.getVouchers(selectedSchoolId));
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, selectedSchoolId]);

  if (!isOpen) return null;

  const currentSchool = schools.find((s) => s.id === selectedSchoolId);
  const summary = dataBridge.getSchoolFinancialSummary(selectedSchoolId);

  const handleAddVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    dataBridge.recordPayment(selectedSchoolId, {
      amount: parseInt(amount, 10) || 0,
      description: description.trim(),
      refNumber: refNumber.trim(),
      type: voucherType,
    });

    sound.playJoyfulChime();
    setDescription('');
    setRefNumber('');
    setShowAddForm(false);
    loadData();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 dir-rtl">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                دفتر معین مالی و تراکنش‌های حساب
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                مدیریت سندهای مالی، تسویه لایسنس و صورت‌حساب‌های پلتفرم آفتاب
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* School Selector & Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50 flex flex-col justify-between">
              <label className="text-xs font-semibold text-slate-400 mb-2 block">انتخاب مدرسه:</label>
              <select
                value={selectedSchoolId}
                onChange={(e) => setSelectedSchoolId(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.seatsTotal} صندلی)
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50">
              <span className="text-xs text-slate-400">مبلغ کل صورت‌حساب‌ها</span>
              <p className="text-lg font-bold text-slate-100 mt-1">
                {summary.totalBilled.toLocaleString('fa-IR')} <span className="text-xs font-normal text-slate-400">تومان</span>
              </p>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50">
              <span className="text-xs text-slate-400">مجموع پرداختی و تخفیف</span>
              <p className="text-lg font-bold text-emerald-400 mt-1">
                {summary.totalPaid.toLocaleString('fa-IR')} <span className="text-xs font-normal text-slate-400">تومان</span>
              </p>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50">
              <span className="text-xs text-slate-400">مانده بدهی (حساب جاری)</span>
              <p className={`text-lg font-bold mt-1 ${summary.balance > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {summary.balance.toLocaleString('fa-IR')} <span className="text-xs font-normal text-slate-400">تومان</span>
              </p>
            </div>
          </div>

          {/* Action Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              ریز اسناد و پرداختی‌های {currentSchool?.name}
            </h3>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-900/30"
            >
              <Plus className="w-4 h-4" />
              ثبت سند یا پرداخت جدید
            </button>
          </div>

          {/* Add Voucher Form */}
          {showAddForm && (
            <form onSubmit={handleAddVoucher} className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">نوع سند</label>
                  <select
                    value={voucherType}
                    onChange={(e: any) => setVoucherType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="payment">پرداختی / واریز (Payment)</option>
                    <option value="invoice">صورت‌حساب / بدهکار (Invoice)</option>
                    <option value="discount">تخفیف / پوئن تشویقی (Discount)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">مبلغ (تومان)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="مبلغ به تومان"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">شماره پیگیری / ارجاع</label>
                  <input
                    type="text"
                    value={refNumber}
                    onChange={(e) => setRefNumber(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="مثلاً PAY-998230"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">توضیحات و بابت</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="علت و بابت واریز یا فاکتور..."
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl text-xs"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  ذخیره سند مالی
                </button>
              </div>
            </form>
          )}

          {/* Ledger Table */}
          <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/50">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-800/80 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3.5">نوع سند</th>
                  <th className="p-3.5">شماره سند/پیگیری</th>
                  <th className="p-3.5">تاریخ ثبت</th>
                  <th className="p-3.5">توضیحات</th>
                  <th className="p-3.5 text-left">مبلغ (تومان)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {vouchers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      هیچ تراکنش مالی برای این مدرسه ثبت نشده است.
                    </td>
                  </tr>
                ) : (
                  vouchers.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium text-[11px] ${
                            v.type === 'payment'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : v.type === 'invoice'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          }`}
                        >
                          {v.type === 'payment' ? 'واریز/پرداخت' : v.type === 'invoice' ? 'صورت‌حساب' : 'تخفیف'}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-400">{v.refNumber}</td>
                      <td className="p-3.5 text-slate-400">{v.date}</td>
                      <td className="p-3.5">{v.description}</td>
                      <td className="p-3.5 text-left font-bold font-mono text-slate-100">
                        {v.amount.toLocaleString('fa-IR')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-between items-center text-xs text-slate-500">
          <span>استاندارد حسابداری پلتفرم آفتاب v4.0</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors font-medium"
          >
            بستن پنجره
          </button>
        </div>

      </div>
    </div>
  );
};
