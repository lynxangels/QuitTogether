import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Radius } from '@/constants/Colors';

type DayStatus = 'clean' | 'craving' | 'relapsed' | 'today' | 'future';

const calData: Record<number, DayStatus> = {
  1:'clean',2:'clean',3:'clean',4:'clean',5:'clean',6:'clean',7:'clean',
  8:'clean',9:'clean',10:'clean',11:'craving',12:'clean',13:'clean',14:'clean',
  15:'clean',16:'clean',17:'relapsed',18:'clean',19:'clean',20:'craving',
  21:'clean',22:'clean',23:'craving',24:'clean',25:'clean',26:'clean',
  27:'craving',28:'clean',29:'clean',30:'today',
};

const dayDetails: Record<number, { time: string; trigger: string; note: string; outcome: string }[]> = {
  11: [{ time: '14:30', trigger: 'Stress rapat', note: 'Jalan-jalan 10 menit, craving hilang.', outcome: 'survived' }],
  17: [{ time: '23:40', trigger: 'Malam sebelum tidur', note: 'Tidak kuat tahan, 1 batang. Besok lebih baik.', outcome: 'relapsed' }],
  20: [{ time: '13:15', trigger: 'Setelah makan siang', note: 'Minum air putih dan tarik napas, berhasil tahan.', outcome: 'survived' }],
  23: [{ time: '10:00', trigger: 'Stress deadline', note: 'Dengerin musik, craving reda dalam 8 menit.', outcome: 'survived' }],
  27: [{ time: '19:30', trigger: 'Kumpul teman', note: 'Teman-teman merokok tapi aku kuat!', outcome: 'survived' }],
};

const MONTH_NAMES = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const DAY_NAMES = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];

const statusStyle: Record<string, { bg: string; border: string; textColor: string; dotColor: string }> = {
  clean:   { bg: Colors.greenPale, border: Colors.greenLight, textColor: Colors.greenDark, dotColor: Colors.greenLight },
  craving: { bg: Colors.amberLight, border: Colors.amber, textColor: Colors.amberDark, dotColor: Colors.amber },
  relapsed:{ bg: Colors.rosePale, border: Colors.rose, textColor: Colors.roseDark, dotColor: Colors.rose },
  today:   { bg: Colors.greenMid, border: Colors.greenDark, textColor: Colors.white, dotColor: Colors.white },
  future:  { bg: Colors.creamDark, border: Colors.border, textColor: Colors.brownLight, dotColor: Colors.brownLight },
};

// Craving flow steps
const STEPS = [
  { q: 'Hei, kamu lagi craving? 🌊', hint: 'Tenang dulu. Craving itu biasanya cuma bertahan 3–5 menit. Yuk, kita lewatin bareng.', buttons: ['Oke, aku siap ⟶', 'Nggak, aku baik-baik aja'] },
  { q: 'Coba tarik napas dalam 4 hitungan 🌬️', hint: 'Hirup lewat hidung 4 detik → tahan 4 detik → hembuskan 4 detik. Ulangi 3×.', buttons: ['Sudah, rasanya lebih baik ✓', 'Skip, lanjut'] },
  { q: 'Apa yang sebenarnya kamu rasakan? 🤔', hint: 'Identifikasi penyebab craving — ini bisa membantu kamu lebih kuat menahan.', buttons: ['Stress / Tekanan kerja', 'Bosan / Nggak ada kerjaan', 'Kebiasaan / Refleks'] },
  { q: 'Minum air putih sekarang 💧', hint: 'Kadang tubuh salah mengartikan dehidrasi sebagai craving. Minum segelas air putih sekarang.', buttons: ['Sudah minum ✓', 'Nggak ada air, lanjut'] },
  { q: 'Ingat kenapa kamu mulai berhenti 🌱', hint: 'Pohon kamu sudah tumbuh 100 hari. Kamu sudah menghindari 300 batang dan hemat Rp 900 ribu.', buttons: ['Aku ingat, aku kuat ✓', 'Lanjut ke pertanyaan terakhir'] },
];

export default function StatisticsScreen() {
  const [viewMonth, setViewMonth] = useState(6);
  const [viewYear, setViewYear] = useState(2025);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showCreaving, setShowCreaving] = useState(false);
  const [cravingStep, setCravingStep] = useState(0);
  const [cravingResult, setCravingResult] = useState<'survived' | 'relapsed' | null>(null);

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  function changeMonth(dir: number) {
    let m = viewMonth + dir, y = viewYear;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setViewMonth(m); setViewYear(y);
  }

  function openDay(day: number, status: DayStatus) {
    if (status === 'future') return;
    setSelectedDay(day);
  }

  function openCreaving() {
    setCravingStep(0); setCravingResult(null); setShowCreaving(true);
  }

  function handleCravingBtn(btnIndex: number) {
    if (cravingStep < STEPS.length - 1) {
      setCravingStep(s => s + 1);
    } else {
      // Last step: btn 0 = smoke, btn 1 = survive
      setCravingResult(btnIndex === 0 ? 'relapsed' : 'survived');
    }
  }

  const selectedStatus = selectedDay ? (calData[selectedDay] || 'clean') : 'clean';
  const selectedEntries = selectedDay ? (dayDetails[selectedDay] || []) : [];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <Text style={styles.pageTitle}>Statistics</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>

        {/* Summary strip */}
        <View style={styles.summaryStrip}>
          {[['28','Hari Bersih', Colors.greenDark],['4','Craving','#B87A10'],['1','Relapsed', Colors.roseDark]].map(([n,l,c]) => (
            <View key={l} style={styles.sumChip}>
              <Text style={[styles.sumNum, { color: c as string }]}>{n}</Text>
              <Text style={styles.sumLabel}>{l}</Text>
            </View>
          ))}
        </View>

        {/* Month nav */}
        <View style={styles.monthNav}>
          <TouchableOpacity style={styles.monthBtn} onPress={() => changeMonth(-1)}>
            <Text style={{ color: Colors.textMuted, fontSize: 16 }}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.monthName}>{MONTH_NAMES[viewMonth]} {viewYear}</Text>
          <TouchableOpacity style={styles.monthBtn} onPress={() => changeMonth(1)}>
            <Text style={{ color: Colors.textMuted, fontSize: 16 }}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          {[['Bersih', Colors.greenLight], ['Craving (tahan)', Colors.amber], ['Relapsed', Colors.rose]].map(([l, c]) => (
            <View key={l} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: c }]} />
              <Text style={styles.legendText}>{l}</Text>
            </View>
          ))}
        </View>

        {/* Calendar */}
        <View style={styles.calWrap}>
          <View style={styles.dayNames}>
            {DAY_NAMES.map(d => <Text key={d} style={styles.dayName}>{d}</Text>)}
          </View>
          <View style={styles.calGrid}>
            {Array.from({ length: firstDay }, (_, i) => (
              <View key={`empty-${i}`} style={styles.calCell} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const status: DayStatus = day === 30 ? 'today' : (calData[day] || (day > 30 ? 'future' : 'clean'));
              const s = statusStyle[status];
              return (
                <TouchableOpacity
                  key={day}
                  style={[styles.calCell, { backgroundColor: s.bg, borderColor: s.border, borderWidth: 1.5 }]}
                  onPress={() => openDay(day, status)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.calNum, { color: s.textColor }]}>{day}</Text>
                  <View style={[styles.calDot, { backgroundColor: s.dotColor }]} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* FAB craving */}
      <View style={styles.fabWrap}>
        <Text style={styles.fabLabel}>I'm Craving</Text>
        <TouchableOpacity style={styles.fab} onPress={openCreaving} activeOpacity={0.85}>
          <Text style={{ fontSize: 22 }}>💧</Text>
        </TouchableOpacity>
      </View>

      {/* Day detail modal */}
      <Modal visible={selectedDay !== null} transparent animationType="slide" onRequestClose={() => setSelectedDay(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedDay(null)}>
          <Pressable style={styles.detailSheet} onPress={() => {}}>
            <View style={styles.sheetHandle} />
            <Text style={styles.detailDate}>
              {selectedDay} {MONTH_NAMES[viewMonth]} {viewYear}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: statusStyle[selectedStatus].bg }]}>
              <Text style={[styles.statusBadgeText, { color: statusStyle[selectedStatus].textColor }]}>
                {selectedStatus === 'clean' ? '● Hari Bersih' : selectedStatus === 'craving' ? '◆ Ada Craving (Tahan)' : selectedStatus === 'relapsed' ? '✕ Relapsed' : '● Hari Ini'}
              </Text>
            </View>
            {selectedEntries.length > 0 ? selectedEntries.map((e, i) => (
              <View key={i} style={styles.entryCard}>
                <Text style={styles.entryTime}>{e.time}</Text>
                <Text style={styles.entryTrigger}>{e.trigger}</Text>
                <Text style={styles.entryNote}>{e.note}</Text>
                <View style={styles.entryTags}>
                  <View style={[styles.tag, { backgroundColor: e.outcome === 'survived' ? Colors.greenPale : Colors.rosePale }]}>
                    <Text style={[styles.tagText, { color: e.outcome === 'survived' ? Colors.greenDark : Colors.roseDark }]}>
                      {e.outcome === 'survived' ? 'Survived ✓' : 'Relapsed ✕'}
                    </Text>
                  </View>
                </View>
              </View>
            )) : (
              <View style={styles.emptyDay}>
                <Text style={styles.emptyDayText}>🌿 Tidak ada craving hari ini.{'\n'}Hari yang sempurna!</Text>
              </View>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      {/* Craving flow modal */}
      <Modal visible={showCreaving} transparent animationType="slide" onRequestClose={() => setShowCreaving(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => {}}>
          <View style={styles.detailSheet}>
            <View style={styles.sheetHandle} />

            {/* Progress dots */}
            {cravingResult === null && (
              <View style={styles.progressDots}>
                {STEPS.map((_, i) => (
                  <View key={i} style={[styles.progDot, i < cravingStep ? styles.progDone : i === cravingStep ? styles.progActive : {}]} />
                ))}
              </View>
            )}

            {cravingResult !== null ? (
              <View style={styles.resultWrap}>
                <Text style={styles.resultEmoji}>{cravingResult === 'survived' ? '💪' : '😔'}</Text>
                <Text style={styles.resultTitle}>{cravingResult === 'survived' ? 'Luar biasa! Kamu menang!' : 'Tidak apa-apa...'}</Text>
                <Text style={styles.resultSub}>{cravingResult === 'survived' ? 'Craving tercatat. Pohonmu makin kuat! +10 air 🌱' : 'Sudah tercatat. Besok mulai lagi lebih kuat ya. 💙'}</Text>
                <TouchableOpacity style={[styles.cravBtn, styles.cravBtnPrimary, { marginTop: 24 }]} onPress={() => setShowCreaving(false)}>
                  <Text style={styles.cravBtnPrimaryText}>Tutup</Text>
                </TouchableOpacity>
              </View>
            ) : cravingStep < STEPS.length ? (
              <>
                <Text style={styles.cravQ}>{STEPS[cravingStep].q}</Text>
                <Text style={styles.cravHint}>{STEPS[cravingStep].hint}</Text>
                {STEPS[cravingStep].buttons.map((btn, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[styles.cravBtn, i === 0 ? styles.cravBtnPrimary : styles.cravBtnSec]}
                    onPress={() => handleCravingBtn(i)}
                  >
                    <Text style={i === 0 ? styles.cravBtnPrimaryText : styles.cravBtnSecText}>{btn}</Text>
                  </TouchableOpacity>
                ))}
              </>
            ) : (
              <>
                <Text style={styles.cravQ}>Kamu sudah berjuang keras 💪</Text>
                <Text style={styles.cravHint}>Ini keputusanmu. Tapi ingat — satu batang bukan "cuma" satu batang. Kamu masih mau tetap berhenti?</Text>
                <View style={styles.finalRow}>
                  <TouchableOpacity style={styles.btnSmoke} onPress={() => setCravingResult('relapsed')}>
                    <Text style={styles.btnSmokeText}>😔 Aku akan merokok</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnSurvive} onPress={() => setCravingResult('survived')}>
                    <Text style={styles.btnSurviveText}>💪 Tidak! Aku bisa</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </Pressable>
      </Modal>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIcon} /><Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <View style={[styles.navIcon, styles.navActive]} /><Text style={[styles.navLabel, styles.navLabelActive]}>Statistics</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIcon} /><Text style={styles.navLabel}>Companion</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIcon} /><Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  topBar: { paddingHorizontal: 24, paddingBottom: 8 },
  pageTitle: { fontSize: 18, fontWeight: '600', color: Colors.textPrimary },
  summaryStrip: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 14 },
  sumChip: { flex: 1, backgroundColor: Colors.white, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, padding: 10, alignItems: 'center' },
  sumNum: { fontSize: 20, fontWeight: '300', lineHeight: 24 },
  sumLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '500', marginTop: 2 },
  monthNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12 },
  monthName: { fontSize: 18, fontWeight: '300', color: Colors.textPrimary },
  monthBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  legend: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingBottom: 12, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, color: Colors.textMuted },
  calWrap: { paddingHorizontal: 16 },
  dayNames: { flexDirection: 'row', marginBottom: 6 },
  dayName: { flex: 1, textAlign: 'center', fontSize: 10, fontWeight: '600', color: Colors.textMuted },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  calCell: { width: '13%', aspectRatio: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center', gap: 2 },
  calNum: { fontSize: 12, fontWeight: '500' },
  calDot: { width: 5, height: 5, borderRadius: 3 },

  // FAB
  fabWrap: { position: 'absolute', bottom: 88, alignSelf: 'center', alignItems: 'center', zIndex: 20 },
  fabLabel: { fontSize: 9, fontWeight: '600', color: Colors.greenDark, backgroundColor: Colors.greenPale, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginBottom: 6, borderWidth: 1, borderColor: Colors.greenLight, overflow: 'hidden' },
  fab: { width: 56, height: 56, borderRadius: 18, backgroundColor: Colors.greenMid, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: Colors.cream, shadowColor: Colors.greenDark, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8 },

  // Bottom Nav
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, backgroundColor: Colors.cream, borderTopWidth: 1, borderTopColor: Colors.border, flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 16, paddingTop: 10 },
  navItem: { flex: 1, alignItems: 'center', gap: 4 },
  navIcon: { width: 22, height: 22, borderRadius: 6, backgroundColor: Colors.brownLight },
  navActive: { backgroundColor: Colors.greenMid },
  navLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '500' },
  navLabelActive: { color: Colors.greenMid },

  // Day detail modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  detailSheet: { backgroundColor: Colors.cream, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 40, maxHeight: '70%' },
  sheetHandle: { width: 36, height: 4, backgroundColor: Colors.brownLight, borderRadius: 2, alignSelf: 'center', marginBottom: 14 },
  detailDate: { fontSize: 18, fontWeight: '300', color: Colors.textPrimary, marginBottom: 4 },
  statusBadge: { alignSelf: 'flex-start', borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 4, marginBottom: 14 },
  statusBadgeText: { fontSize: 12, fontWeight: '600' },
  entryCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, padding: 12, marginBottom: 8 },
  entryTime: { fontSize: 11, color: Colors.textMuted, marginBottom: 4 },
  entryTrigger: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4 },
  entryNote: { fontSize: 12, color: Colors.textMuted, lineHeight: 17 },
  entryTags: { flexDirection: 'row', gap: 5, marginTop: 6 },
  tag: { borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 2 },
  tagText: { fontSize: 10, fontWeight: '500' },
  emptyDay: { paddingVertical: 24, alignItems: 'center' },
  emptyDayText: { fontSize: 13, color: Colors.textMuted, textAlign: 'center', lineHeight: 20 },

  // Craving flow
  progressDots: { flexDirection: 'row', gap: 4, marginBottom: 18 },
  progDot: { flex: 1, height: 4, borderRadius: 2, backgroundColor: Colors.creamDark },
  progDone: { backgroundColor: Colors.greenLight },
  progActive: { backgroundColor: Colors.greenMid },
  cravQ: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary, lineHeight: 22, marginBottom: 6 },
  cravHint: { fontSize: 12, color: Colors.textMuted, lineHeight: 18, marginBottom: 18 },
  cravBtn: { borderRadius: Radius.lg, padding: 13, marginBottom: 10 },
  cravBtnPrimary: { backgroundColor: Colors.greenMid },
  cravBtnPrimaryText: { color: Colors.white, fontSize: 14, fontWeight: '600', textAlign: 'center' },
  cravBtnSec: { backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.border },
  cravBtnSecText: { color: Colors.textPrimary, fontSize: 14, fontWeight: '500', textAlign: 'center' },
  finalRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  btnSmoke: { flex: 1, backgroundColor: Colors.rosePale, borderRadius: Radius.md, padding: 13, borderWidth: 1.5, borderColor: Colors.rose },
  btnSmokeText: { color: Colors.roseDark, fontSize: 13, fontWeight: '600', textAlign: 'center' },
  btnSurvive: { flex: 1, backgroundColor: Colors.greenPale, borderRadius: Radius.md, padding: 13, borderWidth: 1.5, borderColor: Colors.greenLight },
  btnSurviveText: { color: Colors.greenDark, fontSize: 13, fontWeight: '600', textAlign: 'center' },
  resultWrap: { alignItems: 'center', paddingVertical: 10 },
  resultEmoji: { fontSize: 40, marginBottom: 10 },
  resultTitle: { fontSize: 22, fontWeight: '300', color: Colors.textPrimary, marginBottom: 6 },
  resultSub: { fontSize: 13, color: Colors.textMuted, textAlign: 'center', lineHeight: 18 },
});
