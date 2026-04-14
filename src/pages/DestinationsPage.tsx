import { useState } from 'react';
import { useAppData } from '../contexts/AppDataContext';

const uid = (): string => `dest_${Math.random().toString(36).slice(2, 8)}`;

export const DestinationsPage = () => {
  const { data, saveDestination } = useAppData();
  const [name, setName] = useState('');

  if (!data) return null;

  return (
    <div className="space-y-3">
      <section className="app-card p-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-emerald-700/70">Destinations</p>
        <h2 className="text-lg font-semibold">出荷先管理</h2>

        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return;
            saveDestination({
              id: uid(),
              name,
              address: '',
              phone: '',
              contactPerson: '',
              email: '',
              notes: '',
              isFavorite: false,
              isActive: true,
              sortOrder: data.destinations.length + 1,
            });
            setName('');
          }}
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-base"
            placeholder="出荷先名"
          />
          <button className="btn-primary">追加</button>
        </form>
      </section>

      <ul className="space-y-2">
        {data.destinations.map((dest) => (
          <li key={dest.id} className="app-card p-3 text-sm">
            <div className="font-medium">{dest.name}</div>
            <div className="text-xs text-emerald-900/70">お気に入り: {dest.isFavorite ? '★' : '-'}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};
