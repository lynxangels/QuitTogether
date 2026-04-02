import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Colors, Radius } from '@/constants/Colors';

const CRAVING_STEPS = [
  { q: 'Hei, kamu lagi craving? 🌊', hint: 'Tenang dulu. Craving itu biasanya cuma bertahan 3–5 menit.', btns: ['Oke, aku siap ⟶', 'Nggak, aku baik-baik aja'] },
  { q: 'Coba tarik napas dalam 4 hitungan 🌬️', hint: 'Hirup 4 detik → tahan 4 detik → hembuskan 4 detik. Ulangi 3×.', btns: ['Sudah, rasanya lebih baik ✓', 'Skip, lanjut'] },
  { q: 'Apa yang kamu rasakan? 🤔', hint: 'Identifikasi penyebab craving — ini membantu kamu lebih kuat menahan.', btns: ['Stress / Tekanan kerja', 'Bosan / Nggak ada kerjaan', 'Kebiasaan / Refleks'] },
  { q: 'Minum air putih sekarang 💧', hint: 'Kadang tubuh salah mengartikan dehidrasi sebagai craving.', btns: ['Sudah minum ✓', 'Nggak ada air, lanjut'] },
  { q: 'Ingat kenapa kamu mulai berhenti 🌱', hint: 'Pohon kamu sudah 100 hari. 300 batang dihindari, Rp 900k tersimpan.', btns: ['Aku ingat, aku kuat ✓', 'Lanjut ke keputusan akhir'] },
];

function CravingModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<'survived' | 'relapsed' | null>(null);
  const isFinal = step === CRAVING_STEPS.length;

  function reset() { setStep(0); setResult(null); onClose(); }
  function next() { setStep(s => s + 1); }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={reset}>
      <Pressable style={s.overlay} onPress={() => {}}>
        <View style={s.sheet}>
          <View style={s.handle} />
          {result !== null ? (
            <View style={s.resultWrap}>
              <Text style={s.resultEmoji}>{result === 'survived' ? '💪' : '😔'}</Text>
              <Text style={s.resultTitle}>{result === 'survived' ? 'Luar biasa! Kamu menang!' : 'Tidak apa-apa...'}</Text>
              <Text style={s.resultSub}>{result === 'survived' ? 'Craving tercatat. Pohonmu makin kuat! 🌱' : 'Sudah tercatat. Besok mulai lagi lebih kuat. 💙'}</Text>
              <TouchableOpacity style={[s.btn, s.btnPrimary, { marginTop: 24 }]} onPress={reset}>
                <Text style={s.btnPrimaryText}>Tutup</Text>
              </TouchableOpacity>
            </View>
          ) : isFinal ? (
            <>
              <Text style={s.cravQ}>Kamu sudah berjuang keras 💪</Text>
              <Text style={s.cravHint}>Ini keputusanmu. Satu batang bukan "cuma" satu batang.</Text>
              <View style={s.finalRow}>
                <TouchableOpacity style={s.btnSmoke} onPress={() => setResult('relapsed')}>
                  <Text style={s.btnSmokeText}>😔 Aku akan merokok</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.btnSurvive} onPress={() => setResult('survived')}>
                  <Text style={s.btnSurviveText}>💪 Tidak! Aku bisa</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View style={s.dots}>
                {CRAVING_STEPS.map((_, i) => (
                  <View key={i} style={[s.dot, i < step && s.dotDone, i === step && s.dotActive]} />
                ))}
              </View>
              <Text style={s.cravQ}>{CRAVING_STEPS[step].q}</Text>
              <Text style={s.cravHint}>{CRAVING_STEPS[step].hint}</Text>
              {CRAVING_STEPS[step].btns.map((b, i) => (
                <TouchableOpacity key={i} style={[s.btn, i === 0 ? s.btnPrimary : s.btnSec]} onPress={next}>
                  <Text style={i === 0 ? s.btnPrimaryText : s.btnSecText}>{b}</Text>
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>
      </Pressable>
    </Modal>
  );
}

export default function RootLayout() {
  const [cravingVisible, setCravingVisible] = useState(false);

  return (
    <SafeAreaProvider>
      <CravingModal visible={cravingVisible} onClose={() => setCravingVisible(false)} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: tabStyles.bar,
          tabBarActiveTintColor: Colors.greenMid,
          tabBarInactiveTintColor: Colors.brownLight,
          tabBarLabelStyle: tabStyles.label,
        }}
      >
        <Tabs.Screen
          name="(tabs)/index"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused }) => <View style={[tabStyles.icon, focused && tabStyles.iconActive]} />,
          }}
        />
        <Tabs.Screen
          name="(tabs)/statistics"
          options={{
            title: 'Statistics',
            tabBarIcon: ({ focused }) => <View style={[tabStyles.icon, focused && tabStyles.iconActive]} />,
          }}
        />
        <Tabs.Screen
          name="(tabs)/craving-placeholder"
          options={{
            title: '',
            tabBarButton: () => (
              <View style={tabStyles.fabWrap}>
                <Text style={tabStyles.fabLabel}>I'm Craving</Text>
                <TouchableOpacity style={tabStyles.fab} onPress={() => setCravingVisible(true)} activeOpacity={0.85}>
                  <Text style={{ fontSize: 20 }}>💧</Text>
                </TouchableOpacity>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="(tabs)/companion"
          options={{
            title: 'Companion',
            tabBarIcon: ({ focused }) => <View style={[tabStyles.icon, focused && tabStyles.iconActive]} />,
          }}
        />
        <Tabs.Screen
          name="(tabs)/profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused }) => <View style={[tabStyles.icon, focused && tabStyles.iconActive]} />,
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}

const tabStyles = StyleSheet.create({
  bar: { backgroundColor: Colors.cream, borderTopColor: Colors.border, borderTopWidth: 1, height: 80, paddingBottom: 12, paddingTop: 8 },
  label: { fontSize: 10, fontWeight: '500' },
  icon: { width: 22, height: 22, borderRadius: 6, backgroundColor: Colors.brownLight },
  iconActive: { backgroundColor: Colors.greenMid },
  fabWrap: { alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 14, width: 80 },
  fabLabel: { fontSize: 9, fontWeight: '600', color: Colors.greenDark, backgroundColor: Colors.greenPale, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2, marginBottom: 5, borderWidth: 1, borderColor: Colors.greenLight, overflow: 'hidden' },
  fab: { width: 56, height: 56, borderRadius: 18, backgroundColor: Colors.greenMid, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: Colors.cream, shadowColor: Colors.greenDark, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 10, bottom: 8 },
});

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: Colors.cream, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 22, paddingBottom: 36 },
  handle: { width: 36, height: 4, backgroundColor: Colors.brownLight, borderRadius: 2, alignSelf: 'center', marginBottom: 18 },
  dots: { flexDirection: 'row', gap: 4, marginBottom: 18 },
  dot: { flex: 1, height: 4, borderRadius: 2, backgroundColor: Colors.creamDark },
  dotDone: { backgroundColor: Colors.greenLight },
  dotActive: { backgroundColor: Colors.greenMid },
  cravQ: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary, lineHeight: 22, marginBottom: 6 },
  cravHint: { fontSize: 12, color: Colors.textMuted, lineHeight: 18, marginBottom: 18 },
  btn: { borderRadius: Radius.lg, padding: 13, marginBottom: 10 },
  btnPrimary: { backgroundColor: Colors.greenMid },
  btnPrimaryText: { color: Colors.white, fontSize: 14, fontWeight: '600', textAlign: 'center' },
  btnSec: { backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.border },
  btnSecText: { color: Colors.textPrimary, fontSize: 14, fontWeight: '500', textAlign: 'center' },
  finalRow: { flexDirection: 'row', gap: 10 },
  btnSmoke: { flex: 1, backgroundColor: Colors.rosePale, borderRadius: Radius.md, padding: 13, borderWidth: 1.5, borderColor: Colors.rose },
  btnSmokeText: { color: Colors.roseDark, fontSize: 13, fontWeight: '600', textAlign: 'center' },
  btnSurvive: { flex: 1, backgroundColor: Colors.greenPale, borderRadius: Radius.md, padding: 13, borderWidth: 1.5, borderColor: Colors.greenLight },
  btnSurviveText: { color: Colors.greenDark, fontSize: 13, fontWeight: '600', textAlign: 'center' },
  resultWrap: { alignItems: 'center', paddingVertical: 10 },
  resultEmoji: { fontSize: 40, marginBottom: 10 },
  resultTitle: { fontSize: 22, fontWeight: '300', color: Colors.textPrimary, marginBottom: 6 },
  resultSub: { fontSize: 13, color: Colors.textMuted, textAlign: 'center', lineHeight: 18 },
});
