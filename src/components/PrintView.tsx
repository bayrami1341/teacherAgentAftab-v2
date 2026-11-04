import React from 'react';
import { ClassData } from '../types';

interface PrintViewProps {
  classData: ClassData;
}

export const PrintView: React.FC<PrintViewProps> = ({ classData }) => {
  const { className, schoolName, radar, plants, seedBank } = classData;

  const stageNames: Record<number, string> = {
    1: 'دانه / جوانه کوچک',
    2: 'جوانه دوبرگی',
    3: 'نهال جوان',
    4: 'بوته پربرگ',
    5: 'شکوفا و بارور',
  };

  const moodNames: Record<string, string> = {
    thriving: 'شاداب',
    content: 'آرام',
    longing: 'دلتنگ',
    alert: 'بی‌تاب',
  };

  return (
    <div className="print-only p-6 font-['Vazirmatn'] text-black bg-white" dir="rtl">
      {/* Print Header */}
      <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold">گزارش مراقبتی باغچه‌ی کلاس — جوانه</h1>
          <p className="text-sm text-gray-700 mt-1">
            {schoolName} • {className}
          </p>
        </div>
        <div className="text-left text-xs text-gray-600">
          <div>تاریخ تهیه: {new Date().toLocaleDateString('fa-IR')}</div>
          <div>روش ارزیابی: مدت غیبت واقعی (بدون رتبه‌بندی)</div>
        </div>
      </div>

      {/* Radar Summary */}
      <div className="border border-gray-300 rounded-lg p-4 mb-6 bg-gray-50">
        <h2 className="text-base font-bold mb-1">وضعیت کلی ریتم کلاس:</h2>
        <p className="text-sm text-gray-800">{radar.overallMessage}</p>
        {radar.needsAttention && radar.needsAttention.length > 0 && (
          <div className="mt-3">
            <h3 className="text-xs font-bold text-gray-700 mb-1">دانش‌آموزان نیازمند گفت‌وگو:</h3>
            <ul className="text-xs list-disc list-inside space-y-1 text-gray-800">
              {radar.needsAttention.map((item, idx) => (
                <li key={idx}>
                  <strong>{item.childName}</strong> (گیاه {item.plantName}) — {item.lastSeenDays} روز غیبت — پیشنهاد: {item.hint}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Garden Plant Table */}
      <div className="garden-print mb-6">
        <h2 className="text-base font-bold mb-2">فهرست گلدان‌های کلاس ({plants.length} گیاه)</h2>
        <table className="w-full text-right text-xs border-collapse border border-gray-400">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400 p-2">ردیف</th>
              <th className="border border-gray-400 p-2">نام گیاه</th>
              <th className="border border-gray-400 p-2">نام دانش‌آموز</th>
              <th className="border border-gray-400 p-2">نسل</th>
              <th className="border border-gray-400 p-2">مرحله رشد</th>
              <th className="border border-gray-400 p-2">حالت عاطفی</th>
              <th className="border border-gray-400 p-2">روزهای همراهی</th>
              <th className="border border-gray-400 p-2">آخرین حضور</th>
            </tr>
          </thead>
          <tbody>
            {plants.map((plant, index) => (
              <tr key={plant.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-400 p-2 text-center">{index + 1}</td>
                <td className="border border-gray-400 p-2 font-bold">{plant.plantName}</td>
                <td className="border border-gray-400 p-2">{plant.childName}</td>
                <td className="border border-gray-400 p-2 text-center">نسل {plant.gen}</td>
                <td className="border border-gray-400 p-2">{stageNames[plant.stage]}</td>
                <td className="border border-gray-400 p-2">{moodNames[plant.mood] || plant.mood}</td>
                <td className="border border-gray-400 p-2 text-center">{plant.growthDays} روز</td>
                <td className="border border-gray-400 p-2">
                  {plant.lastSeenDays === 0 ? 'امروز' : `${plant.lastSeenDays} روز قبل`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Seed Bank Summary */}
      {seedBank && seedBank.length > 0 && (
        <div className="border-t border-gray-300 pt-4 text-xs text-gray-700">
          <h3 className="font-bold mb-1">بذرخانه‌ی کلاس ({seedBank.length} بذر کامل‌شده):</h3>
          <p>
            {seedBank.map((s) => `${s.plantName} (نسل ${s.gen} - ${s.childName})`).join(' ، ')}
          </p>
        </div>
      )}

      {/* Principle Footer */}
      <div className="mt-8 text-center text-[10px] text-gray-500 border-t border-gray-200 pt-3">
        «این باغچه برای مراقبت است، نه رتبه‌بندی. هیچ امتیازی به عنوان نمره یا قضاوت ثبت نمی‌شود.»
      </div>
    </div>
  );
};
