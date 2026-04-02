import { create } from 'zustand';

export type DayStatus = 'clean' | 'craving' | 'relapsed' | 'today' | 'future';

export interface CravingEntry {
  id: string;
  date: string; // YYYY-MM-DD
  time: string;
  trigger: string;
  note: string;
  outcome: 'survived' | 'relapsed';
  intensity: number;
  tags: string[];
}

export interface AppState {
  // User profile
  name: string;
  email: string;
  quitDate: Date;
  cigsPerDay: number;
  pricePerPack: number;
  referralCode: string;

  // Companion
  companion: { name: string; initials: string; daysTogether: number } | null;

  // Craving log
  cravings: CravingEntry[];

  // Actions
  setProfile: (data: Partial<AppState>) => void;
  addCraving: (entry: Omit<CravingEntry, 'id'>) => void;
  setCompanion: (companion: AppState['companion']) => void;
}

export const useAppStore = create<AppState>((set) => ({
  name: 'Dika Kurniawan',
  email: 'dika@email.com',
  quitDate: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000),
  cigsPerDay: 12,
  pricePerPack: 30000,
  referralCode: 'QT-X7K3M',

  companion: {
    name: 'Andi Rizky',
    initials: 'AR',
    daysTogether: 100,
  },

  cravings: [
    {
      id: '1',
      date: (() => { const d = new Date(); d.setDate(d.getDate() - 0); return d.toISOString().split('T')[0]; })(),
      time: '13:45',
      trigger: 'Setelah makan siang',
      note: 'Minum air putih, tahan 15 menit. Lewat!',
      outcome: 'survived',
      intensity: 6,
      tags: ['Post-meal', 'Air putih'],
    },
    {
      id: '2',
      date: (() => { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().split('T')[0]; })(),
      time: '23:55',
      trigger: 'Malam sebelum tidur',
      note: 'Tidak kuat, terhitung 1 batang.',
      outcome: 'relapsed',
      intensity: 10,
      tags: ['Malam hari'],
    },
  ],

  setProfile: (data) => set((s) => ({ ...s, ...data })),
  addCraving: (entry) =>
    set((s) => ({
      cravings: [{ ...entry, id: Date.now().toString() }, ...s.cravings],
    })),
  setCompanion: (companion) => set({ companion }),
}));

// Computed helpers
export function getDaysSinceQuit(quitDate: Date) {
  return Math.floor((Date.now() - quitDate.getTime()) / (1000 * 60 * 60 * 24));
}

export function getMoneySaved(days: number, cigsPerDay: number, pricePerPack: number) {
  const cigsAvoided = days * cigsPerDay;
  return Math.floor((cigsAvoided / 20) * pricePerPack);
}
