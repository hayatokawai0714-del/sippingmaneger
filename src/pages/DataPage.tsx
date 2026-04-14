import { useRef, useState } from 'react';
import { useAppData } from '../contexts/AppDataContext';
import { exportAppDataToExcel, importExcelToAppData } from '../utils/excel';
import type { ImportValidationIssue } from '../types/app';

export const DataPage = () => {
  const { data, replaceData } = useAppData();
  const [issues, setIssues] = useState<ImportValidationIssue[]>([]);
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  if (!data) return null;

  return (
    <div className="space-y-3 text-sm">
      <section className="app-card p-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-emerald-700/70">Data I/O</p>
        <h2 className="text-lg font-semibold">データ入出力</h2>

        <div className="mt-3 flex flex-wrap gap-2">
          <button className="btn-primary" onClick={() => exportAppDataToExcel(data)}>
            Excelエクスポート
          </button>
          <button
            className="btn-secondary"
            onClick={() => {
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'shipping-data.json';
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            JSONエクスポート
          </button>
          <button className="btn-secondary" onClick={() => inputRef.current?.click()}>
            Excel取込
          </button>
        </div>
      </section>

      <input
        ref={inputRef}
        type="file"
        accept=".xlsx"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setMessage('Excelを解析中です...');
          const result = await importExcelToAppData(file);
          setIssues(result.issues);
          if (result.issues.some((x) => x.level === 'error')) {
            setMessage('エラーがあるため反映できません');
            return;
          }
          replaceData(result.data);
          setMessage('インポート完了');
        }}
      />

      {message ? <p className="text-xs text-emerald-900/80">{message}</p> : null}

      {issues.length > 0 ? (
        <div className="app-card overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-mist">
              <tr>
                <th className="px-2 py-2">シート</th>
                <th className="px-2 py-2">行</th>
                <th className="px-2 py-2">列</th>
                <th className="px-2 py-2">原因</th>
                <th className="px-2 py-2">修正指示</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue, idx) => (
                <tr key={idx} className="border-t border-line">
                  <td className="px-2 py-1.5">{issue.sheet}</td>
                  <td className="px-2 py-1.5">{issue.row}</td>
                  <td className="px-2 py-1.5">{issue.column}</td>
                  <td className="px-2 py-1.5">{issue.reason}</td>
                  <td className="px-2 py-1.5">{issue.fix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
};
