import { useState } from 'react';
import { useAppData } from '../contexts/AppDataContext';

const uid = (): string => `unit_${Math.random().toString(36).slice(2, 8)}`;

export const UnitsPage = () => {
  const { data, saveUnit } = useAppData();
  const [name, setName] = useState('');

  if (!data) return null;

  return (
    <div className="space-y-3">
      <section className="app-card p-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-emerald-700/70">Units</p>
        <h2 className="text-lg font-semibold">単位設定</h2>

        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return;
            saveUnit({
              id: uid(),
              name,
              isActive: true,
              sortOrder: data.units.length + 1,
            });
            setName('');
          }}
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-base"
            placeholder="単位名"
          />
          <button className="btn-primary">追加</button>
        </form>
      </section>

      <ul className="space-y-2">
        {data.units.map((unit) => (
          <li key={unit.id} className="app-card p-3 text-sm">
            {unit.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
