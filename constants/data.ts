export type DayStatus = 'clean' | 'craving' | 'relapsed' | 'today' | 'future';
export type CravingOutcome = 'survived' | 'relapsed';

export interface StreakDay {
  date: number;
  status: DayStatus;
}

export interface CravingEntry {
  time: string;
  trigger: string;
  note: string;
  tags: string[];
  outcome: CravingOutcome;
}

export interface CalendarDayData {
  status: DayStatus;
  entries?: CravingEntry[];
}

// Generate streak days (last 30 days)
export function generateStreakDays(): StreakDay[] {
  const statuses: DayStatus[] = [
    'clean','clean','clean','craving','clean','clean','relapsed',
    'clean','clean','clean','craving','clean','clean','clean','clean',
    'clean','craving','clean','clean','clean','clean','clean','clean',
    'craving','clean','clean','clean','clean','clean','today',
  ];
  const today = new Date();
  return statuses.map((status, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (29 - i));
    return { date: d.getDate(), status };
  });
}

export const calendarData: Record<number, CalendarDayData> = {
  1:{status:'clean'},2:{status:'clean'},3:{status:'clean'},4:{status:'clean'},
  5:{status:'clean'},6:{status:'clean'},7:{status:'clean'},8:{status:'clean'},
  9:{status:'clean'},10:{status:'clean'},
  11:{status:'craving', entries:[{time:'14:30',trigger:'Stress rapat',note:'Jalan-jalan 10 menit, craving hilang.',tags:['survived','stress'],outcome:'survived'}]},
  12:{status:'clean'},13:{status:'clean'},14:{status:'clean'},15:{status:'clean'},
  16:{status:'clean'},
  17:{status:'relapsed', entries:[{time:'23:40',trigger:'Malam sebelum tidur',note:'Tidak kuat tahan, 1 batang. Besok lebih baik.',tags:['relapsed','malam'],outcome:'relapsed'}]},
  18:{status:'clean'},19:{status:'clean'},
  20:{status:'craving', entries:[{time:'13:15',trigger:'Setelah makan siang',note:'Minum air putih dan tarik napas, berhasil tahan.',tags:['survived','post-meal'],outcome:'survived'}]},
  21:{status:'clean'},22:{status:'clean'},
  23:{status:'craving', entries:[{time:'10:00',trigger:'Stress deadline',note:'Dengerin musik, craving reda dalam 8 menit.',tags:['survived','stress'],outcome:'survived'}]},
  24:{status:'clean'},25:{status:'clean'},26:{status:'clean'},
  27:{status:'craving', entries:[{time:'19:30',trigger:'Kumpul teman',note:'Teman-teman merokok tapi aku kuat!',tags:['survived','sosial'],outcome:'survived'}]},
  28:{status:'clean'},29:{status:'clean'},30:{status:'today'},
};

export const userProfile = {
  name: 'Dika Kurniawan',
  initials: 'DK',
  email: 'dika@email.com',
  quitDate: '12 Agustus 2024',
  daysClean: 100,
  cigsPerDay: 12,
  pricePerPack: 30000,
  cigsPerPack: 20,
  referralCode: 'QT-X7K3M',
  companion: {
    name: 'Andi Rizky',
    initials: 'AR',
    isOnline: true,
    daysTogether: 100,
    cravingsHelped: 14,
    responseRate: 98,
    daysClean: 87,
    lastMessage: 'Hei! Sudah hari ke-100 nih, kamu luar biasa! Jangan nyerah ya 💪',
    lastMessageTime: '5 menit lalu',
  },
};
