import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';

export const SmokerOnboardingScreen = () => {
  const [cigPerDay, setCigPerDay] = useState('');
  const [packPrice, setPackPrice] = useState('');
  const [cigPerPack, setCigPerPack] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleComplete = async () => {
    const user = auth.currentUser;
    if (!user) return;

    if (!cigPerDay || !packPrice || !cigPerPack) {
      Alert.alert('Data belum lengkap', 'Silakan isi semua data terlebih dahulu ya!');
      return;
    }

    const cigPerDayNum = parseInt(cigPerDay);
    const packPriceNum = parseInt(packPrice);
    const cigPerPackNum = parseInt(cigPerPack);

    if (isNaN(cigPerDayNum) || isNaN(packPriceNum) || isNaN(cigPerPackNum)) {
      Alert.alert('Data tidak valid', 'Mohon masukkan angka yang benar.');
      return;
    }

    setIsSaving(true);
    try {
      console.log('Saving smoker profile for:', user.uid);
      const referralCode = 'QT-' + Math.random().toString(36).substring(2, 7).toUpperCase();

      await setDoc(doc(db, 'smokerProfiles', user.uid), {
        userId: user.uid,
        quitStartDate: new Date().toISOString(),
        lastRelapseAt: new Date().toISOString(),
        cigarettesPerDay: cigPerDayNum,
        cigarettesPerPack: cigPerPackNum,
        packPrice: packPriceNum,
        referralCode,
        totalWater: 0,
        treeStage: 1,
        companionId: null,
        activeCompanion: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      console.log('Updating user role and onboarding status...');
      await setDoc(doc(db, 'users', user.uid), {
        role: 'smoker',
        onboardingCompleted: true,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      console.log('Save success, RootNavigator should trigger navigation to Home.');
    } catch (e: any) {
      console.error("Error saving onboarding data:", e);
      Alert.alert('Error', e.message || 'Gagal menyimpan data');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScreenWrapper style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <Text style={styles.title}>Ceritakan kebiasaanmu</Text>
            <Text style={styles.subtitle}>Data ini digunakan untuk menghitung statistik uang yang berhasil kamu hemat.</Text>
          </View>
          
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Batang per hari</Text>
              <TextInput 
                style={styles.input}
                keyboardType="number-pad"
                value={cigPerDay}
                onChangeText={setCigPerDay}
                placeholder="Contoh: 12"
                placeholderTextColor="#A19382"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Harga per bungkus (Rp)</Text>
              <TextInput 
                style={styles.input}
                keyboardType="number-pad"
                value={packPrice}
                onChangeText={setPackPrice}
                placeholder="Contoh: 30000"
                placeholderTextColor="#A19382"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Isi batang per bungkus</Text>
              <TextInput 
                style={styles.input}
                keyboardType="number-pad"
                value={cigPerPack}
                onChangeText={setCigPerPack}
                placeholder="Contoh: 20"
                placeholderTextColor="#A19382"
              />
            </View>

            <TouchableOpacity 
              style={[styles.button, isSaving && styles.buttonDisabled]}
              onPress={handleComplete}
              disabled={isSaving}
              activeOpacity={0.8}
            >
              {isSaving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Mulai Perjalanan</Text>
              )}
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3EE'
  },
  keyboardView: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: 'center'
  },
  header: {
    alignItems: 'center',
    marginBottom: 32
  },
  title: {
    fontSize: 28,
    fontFamily: 'serif',
    color: '#1A1A1A',
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5
  },
  subtitle: {
    fontSize: 15,
    color: '#8B7355',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10
  },
  formContainer: {
    gap: 20
  },
  inputGroup: {
    gap: 8
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3A6147',
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#DDD3C0',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 16,
    color: '#1A1A1A',
  },
  button: {
    backgroundColor: '#4A7C59',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#4A7C59',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  buttonDisabled: {
    backgroundColor: '#A1BCA8',
    shadowOpacity: 0
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  }
});
