import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal, StyleSheet,
  ScrollView, Animated, Pressable,
} from 'react-native';
import { Colors } from '../constants/Colors';

interface CravingFlowProps {
  visible: boolean;
  onClose: (outcome?: 'survived' | 'relapsed') => void;
}

const STEPS = [
  {
    q: 'Hei, kamu lagi craving? 🌊',
    hint: 'Tenang dulu. Craving itu biasanya cuma bertahan 3–5 menit. Yuk, kita lewatin bareng.',
    cta: 'Oke, aku siap →',
    skip: 'Nggak, aku baik-baik aja',
  },
  {
    q: 'Coba tarik napas dalam 4 hitungan 🌬️',
    hint: 'Hirup lewat hidung 4 detik → tahan 4 detik → hembuskan 4 detik. Ulangi 3×.',
    cta: 'Sudah, rasanya lebih baik ✓',
    skip: 'Skip, lanjut',
  },
  {
    q: 'Apa yang sebenarnya kamu rasakan? 🤔',
    hint: 'Biasanya craving muncul karena stress, bosan, atau kebiasaan. Identifikasi supaya lebih kuat menahan.',
    options: ['Stress / Tekanan kerja', 'Bosan / Nggak ada kerjaan', 'Kebiasaan / Refleks'],
  },
  {
    q: 'Minum air putih sekarang 💧',
    hint: 'Kadang tubuh salah mengartikan dehidrasi sebagai craving. Minum segelas air putih sekarang.',
    cta: 'Sudah minum ✓',
    skip: 'Nggak ada air, lanjut',
  },
  {
    q: 'Ingat kenapa kamu mulai berhenti 🌱',
    hint: 'Pohon kamu sudah tumbuh 100 hari. Kamu sudah menghindari 1.200 batang rokok dan hemat Rp 1,8 juta. Semua itu akan hangus kalau kamu menyerah sekarang.',
    cta: 'Aku ingat, aku kuat ✓',
    skip: 'Lanjut ke pertanyaan terakhir',
  },
];

export default function CravingFlow({ visible, onClose }: CravingFlowProps) {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<'survived' | 'relapsed' | null>(null);

  const reset = () => { setStep(0); setResult(null); };

  const handleClose = (outcome?: 'survived' | 'relapsed') => {
    onClose(outcome);
    setTimeout(reset, 400);
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else setStep(STEPS.length); // final decision
  };

  const decide = (outcome: 'survived' | 'relapsed') => {
    setResult(outcome);
    setStep(STEPS.length + 1); // result screen
  };

  const isFinalDecision = step === STEPS.length;
  const isResult = step === STEPS.length + 1;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={() => handleClose()}>
      <Pressable style={styles.overlay} onPress={() => handleClose()}>
        <Pressable style={styles.sheet} onPress={e => e.stopPropagation()}>
          <View style={styles.handle} />

          {/* Progress dots */}
          {!isFinalDecision && !isResult && (
            <View style={styles.progressRow}>
              {STEPS.map((_, i) => (
                <View key={i} style={[
                  styles.progressDot,
                  i < step ? styles.dotDone : i === step ? styles.dotActive : {}
                ]} />
              ))}
            </View>
          )}

          {/* Steps */}
          {!isFinalDecision && !isResult && (
            <View>
              <Text style={styles.q}>{STEPS[step].q}</Text>
              <Text style={styles.hint}>{STEPS[step].hint}</Text>

              {STEPS[step].options ? (
                STEPS[step].options!.map((opt, i) => (
                  <TouchableOpacity key={i} style={styles.btnSecondary} onPress={next}>
                    <Text style={styles.btnSecondaryText}>{opt}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <>
                  <TouchableOpacity style={styles.btnPrimary} onPress={next}>
                    <Text style={styles.btnPrimaryText}>{STEPS[step].cta}</Text>
                  </TouchableOpacity>
                  {STEPS[step].skip && (
                    <TouchableOpacity style={styles.btnSecondary} onPress={step === 0 ? () => handleClose() : next}>
                      <Text style={styles.btnSecondaryText}>{STEPS[step].skip}</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          )}

          {/* Final decision */}
          {isFinalDecision && (
            <View>
              <Text style={styles.q}>Kamu sudah berjuang keras 💪</Text>
              <Text style={styles.hint}>Ini keputusanmu. Tapi ingat — satu batang bukan "cuma" satu batang. Kamu masih mau tetap berhenti?</Text>
              <View style={styles.finalRow}>
                <TouchableOpacity style={styles.btnSmoke} onPress={() => decide('relapsed')}>
                  <Text style={styles.btnSmokeText}>😔 Aku akan{'\n'}merokok</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnSurvive} onPress={() => decide('survived')}>
                  <Text style={styles.btnSurviveText}>💪 Tidak!{'\n'}Aku bisa tahan</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Result */}
          {isResult && (
            <View style={styles.resultWrap}>
              <Text style={styles.resultEmoji}>{result === 'survived' ? '💪' : '😔'}</Text>
              <Text style={styles.resultTitle}>
                {result === 'survived' ? 'Luar biasa! Kamu menang!' : 'Tidak apa-apa...'}
              </Text>
              <Text style={styles.resultSub}>
                {result === 'survived'
                  ? 'Craving ini tercatat. Pohonmu makin kuat! +10 air pohon janji 🌱'
                  : 'Sudah tercatat. Besok mulai lagi lebih kuat ya. Kamu bisa! 💙'}
              </Text>
              <TouchableOpacity style={[styles.btnPrimary, { marginTop: 20 }]} onPress={() => handleClose(result!)}>
                <Text style={styles.btnPrimaryText}>Tutup</Text>
              </TouchableOpacity>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: Colors.cream, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 22, paddingBottom: 40 },
  handle: { width: 36, height: 4, backgroundColor: Colors.brownLight, borderRadius: 2, alignSelf: 'center', marginBottom: 18 },
  progressRow: { flexDirection: 'row', gap: 4, marginBottom: 18 },
  progressDot: { flex: 1, height: 4, borderRadius: 2, backgroundColor: Colors.creamDark },
  dotDone: { backgroundColor: Colors.greenLight },
  dotActive: { backgroundColor: Colors.greenMid },
  q: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary, lineHeight: 24, marginBottom: 8 },
  hint: { fontSize: 13, color: Colors.textMuted, lineHeight: 19, marginBottom: 20 },
  btnPrimary: { backgroundColor: Colors.greenMid, borderRadius: 16, padding: 14, alignItems: 'center', marginBottom: 10 },
  btnPrimaryText: { color: Colors.white, fontSize: 14, fontWeight: '700' },
  btnSecondary: { backgroundColor: Colors.white, borderRadius: 16, padding: 13, alignItems: 'center', marginBottom: 10, borderWidth: 1.5, borderColor: Colors.border },
  btnSecondaryText: { color: Colors.textPrimary, fontSize: 13, fontWeight: '600' },
  finalRow: { flexDirection: 'row', gap: 10 },
  btnSmoke: { flex: 1, backgroundColor: Colors.rosePale, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.rose },
  btnSmokeText: { color: Colors.roseDark, fontSize: 13, fontWeight: '700', textAlign: 'center' },
  btnSurvive: { flex: 1, backgroundColor: Colors.greenPale, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.greenLight },
  btnSurviveText: { color: Colors.greenDark, fontSize: 13, fontWeight: '700', textAlign: 'center' },
  resultWrap: { alignItems: 'center', paddingVertical: 10 },
  resultEmoji: { fontSize: 44, marginBottom: 12 },
  resultTitle: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8, textAlign: 'center' },
  resultSub: { fontSize: 13, color: Colors.textMuted, textAlign: 'center', lineHeight: 19 },
});
