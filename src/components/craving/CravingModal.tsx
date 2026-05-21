import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { collection, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';

interface Props {
  visible: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const CravingModal = ({ visible, onClose, onComplete }: Props) => {
  const [step, setStep] = useState(1);
  const [trigger, setTrigger] = useState('');
  const totalSteps = 6;

  const handleSurvive = async () => {
    await processResult('survived');
  };

  const handleRelapse = async () => {
    await processResult('relapsed');
  };

  const processResult = async (status: 'survived' | 'relapsed') => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      
      const pRef = doc(db, 'smokerProfiles', user.uid);
      const pSnap = await getDoc(pRef);
      if (!pSnap.exists()) return;
      const profile = pSnap.data();

      // Rules:
      // Survived = +50 water
      // Relapsed = +15 water, reset streak
      const waterAdded = status === 'survived' ? 50 : 15;
      const newTotalWater = (profile.totalWater || 0) + waterAdded;
      
      // Stage thresholds
      const thresholds = [0, 100, 300, 1000, 2000, 3500];
      let newStage = 1;
      for (let i = thresholds.length - 1; i >= 0; i--) {
        if (newTotalWater >= thresholds[i]) {
          newStage = i + 1; // Fixed: array index is 0-5, but stages are 1-6
          break;
        }
      }

      await addDoc(collection(db, 'cravingLogs'), {
        smokerId: user.uid,
        trigger,
        status,
        waterAdded,
        createdAt: new Date(),
      });

      const updateData: any = {
        totalWater: newTotalWater,
        treeStage: Math.max(newStage, profile.treeStage), // Stage never decreases
        updatedAt: new Date()
      };

      if (status === 'relapsed') {
        updateData.lastRelapseAt = new Date().toISOString();
      }

      await updateDoc(pRef, updateData);
      setStep(7); // Result screen
    } catch (e) {
      console.error(e);
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.handle} />
          
          {step <= 6 && (
            <View style={styles.progressContainer}>
              {[1,2,3,4,5,6].map(i => (
                <View key={i} style={[styles.progressItem, { backgroundColor: i < step ? '#A2D093' : i === step ? '#688E52' : '#EBE5D9' }]} />
              ))}
            </View>
          )}

          {step === 1 && (
            <View>
              <Text style={styles.title}>Hei, kamu lagi craving? 🌊</Text>
              <Text style={styles.subtitle}>Tenang dulu. Craving itu biasanya cuma bertahan 3–5 menit. Yuk, kita lewatin bareng.</Text>
              <TouchableOpacity style={styles.primaryBtn} onPress={() => setStep(2)}>
                <Text style={styles.primaryBtnText}>Oke, aku siap ⟶</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryBtn} onPress={onClose}>
                <Text style={styles.secondaryBtnText}>Nggak, aku baik-baik aja</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 2 && (
            <View>
              <Text style={styles.title}>Coba tarik napas dalam 4 hitungan 🌬️</Text>
              <Text style={styles.subtitle}>Hirup lewat hidung selama 4 detik → tahan 4 detik → hembuskan lewat mulut 4 detik. Ulangi 3×. Selesai?</Text>
              <TouchableOpacity style={styles.primaryBtn} onPress={() => setStep(3)}>
                <Text style={styles.primaryBtnText}>Sudah, rasanya lebih baik ✓</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryBtn} onPress={() => setStep(3)}>
                <Text style={styles.secondaryBtnText}>Skip, lanjut</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 3 && (
            <View>
              <Text style={styles.title}>Apa yang sebenarnya kamu rasakan? 🤔</Text>
              <Text style={styles.subtitle}>Biasanya craving muncul karena stress, bosan, atau kebiasaan. Coba identifikasi.</Text>
              <TouchableOpacity style={[styles.secondaryBtn, {marginBottom: 12}]} onPress={() => { setTrigger('stress'); setStep(4); }}>
                <Text style={styles.secondaryBtnText}>Stress / Tekanan</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.secondaryBtn, {marginBottom: 12}]} onPress={() => { setTrigger('bored'); setStep(4); }}>
                <Text style={styles.secondaryBtnText}>Bosan</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryBtn} onPress={() => { setTrigger('habit'); setStep(4); }}>
                <Text style={styles.secondaryBtnText}>Kebiasaan / Refleks</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 4 && (
            <View>
              <Text style={styles.title}>Minum air putih sekarang 💧</Text>
              <Text style={styles.subtitle}>Kadang tubuh salah mengartikan dehidrasi sebagai craving. Minum segelas air putih sekarang.</Text>
              <TouchableOpacity style={styles.primaryBtn} onPress={() => setStep(5)}>
                <Text style={styles.primaryBtnText}>Sudah minum ✓</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryBtn} onPress={() => setStep(5)}>
                <Text style={styles.secondaryBtnText}>Nggak ada air, lanjut</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 5 && (
            <View>
              <Text style={styles.title}>Ingat kenapa kamu mulai berhenti 🌱</Text>
              <Text style={styles.subtitle}>Kamu sudah berjuang sejauh ini. Jangan biarkan satu momen menghancurkan progressmu.</Text>
              <TouchableOpacity style={styles.primaryBtn} onPress={() => setStep(6)}>
                <Text style={styles.primaryBtnText}>Aku ingat, aku kuat ✓</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 6 && (
            <View>
              <Text style={styles.title}>Kamu sudah berjuang keras 💪</Text>
              <Text style={styles.subtitle}>Ini keputusanmu. Tapi ingat — satu batang bukan "cuma" satu batang. Itu awal dari kebiasaan lama. Masih mau merokok?</Text>
              <View style={styles.decisionRow}>
                <TouchableOpacity style={styles.dangerBtn} onPress={handleRelapse}>
                  <Text style={styles.dangerBtnText}>😔 Aku akan merokok</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.successBtn} onPress={handleSurvive}>
                  <Text style={styles.successBtnText}>💪 Tidak! Aku tahan</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {step === 7 && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultEmoji}>🎉</Text>
              <Text style={styles.resultTitle}>Tercatat!</Text>
              <Text style={styles.resultSubtitle}>Pohonmu sudah mendapatkan tambahan air.</Text>
              <TouchableOpacity style={styles.primaryBtnFull} onPress={() => { setStep(1); onClose(); onComplete(); }}>
                <Text style={styles.primaryBtnText}>Tutup</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  content: { backgroundColor: '#F7F3EE', borderTopLeftRadius: 28, borderTopRightRadius: 28, width: '100%', padding: 20, paddingBottom: 40 },
  handle: { width: 36, height: 4, backgroundColor: '#C8B89A', borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  progressContainer: { flexDirection: 'row', gap: 4, marginBottom: 20 },
  progressItem: { flex: 1, height: 4, borderRadius: 2 },
  title: { fontSize: 18, fontWeight: '600', color: '#1A1A1A', marginBottom: 8 },
  subtitle: { fontSize: 12, color: '#8B7355', marginBottom: 20, lineHeight: 20 },
  primaryBtn: { backgroundColor: '#688E52', padding: 14, borderRadius: 16, alignItems: 'center', marginBottom: 12 },
  primaryBtnFull: { width: '100%', backgroundColor: '#688E52', padding: 14, borderRadius: 16, alignItems: 'center' },
  primaryBtnText: { color: '#FFF', fontWeight: '600' },
  secondaryBtn: { backgroundColor: '#FFF', borderWidth: 2, borderColor: '#DDD3C0', padding: 14, borderRadius: 16, alignItems: 'center' },
  secondaryBtnText: { color: '#1A1A1A', fontWeight: '600' },
  decisionRow: { flexDirection: 'row', gap: 12 },
  dangerBtn: { flex: 1, backgroundColor: '#FDECEA', borderWidth: 2, borderColor: '#F43F5E', padding: 14, borderRadius: 16, alignItems: 'center' },
  dangerBtnText: { color: '#F43F5E', fontWeight: '600' },
  successBtn: { flex: 1, backgroundColor: '#EDF5E8', borderWidth: 2, borderColor: '#A2D093', padding: 14, borderRadius: 16, alignItems: 'center' },
  successBtnText: { color: '#3A6147', fontWeight: '600' },
  resultContainer: { alignItems: 'center', paddingVertical: 16 },
  resultEmoji: { fontSize: 48, marginBottom: 16 },
  resultTitle: { fontFamily: 'serif', fontSize: 24, color: '#1A1A1A', marginBottom: 8 },
  resultSubtitle: { color: '#8B7355', textAlign: 'center', marginBottom: 24 }
});
