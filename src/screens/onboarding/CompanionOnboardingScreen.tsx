import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { collection, query, where, getDocs, doc, setDoc, updateDoc, limit } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';

export const CompanionOnboardingScreen = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedCode, setSuggestedCode] = useState('');

  // Fetch an available code to make testing easy ("tanpa ribet")
  useEffect(() => {
    const fetchAvailableCode = async () => {
      try {
        const q = query(collection(db, 'smokerProfiles'), where('activeCompanion', '==', false), limit(1));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setSuggestedCode(snapshot.docs[0].data().referralCode);
        }
      } catch (e) {
        console.log("Could not fetch suggested code:", e);
      }
    };
    fetchAvailableCode();
  }, []);

  const handleComplete = async () => {
    const user = auth.currentUser;
    if (!user) return;

    if (!code.trim()) {
      Alert.alert('Error', 'Masukkan kode referral terlebih dahulu');
      return;
    }

    setLoading(true);
    try {
      const cleanCode = code.trim().toUpperCase();
      // Find smoker by referral code
      const smokerQ = query(collection(db, 'smokerProfiles'), where('referralCode', '==', cleanCode));
      const querySnapshot = await getDocs(smokerQ);
      
      if (querySnapshot.empty) {
        Alert.alert('Error', 'Kode referral tidak ditemukan. Pastikan kodenya benar.');
        setLoading(false);
        return;
      }

      const smokerDoc = querySnapshot.docs[0];
      const smokerData = smokerDoc.data();

      if (smokerData.activeCompanion) {
        Alert.alert('Error', 'Smoker ini sudah memiliki companion aktif.');
        setLoading(false);
        return;
      }

      // Link companion
      const linkId = smokerDoc.id + '_' + user.uid;
      await setDoc(doc(db, 'companionLinks', linkId), {
        smokerId: smokerDoc.id,
        companionId: user.uid,
        referralCode: cleanCode,
        status: 'active',
        createdAt: new Date().toISOString(),
      });

      // Update smoker profile
      await updateDoc(doc(db, 'smokerProfiles', smokerDoc.id), {
        companionId: user.uid,
        activeCompanion: true,
        updatedAt: new Date().toISOString(),
      });

      // Update current user
      await updateDoc(doc(db, 'users', user.uid), {
        role: 'companion',
        onboardingCompleted: true,
      });

    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
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
            <Text style={styles.title}>Hubungkan Akun</Text>
            <Text style={styles.subtitle}>Masukkan kode referral dari teman atau keluarga yang ingin kamu bantu.</Text>
          </View>
          
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.input}
              placeholder="QT-XXXXX"
              placeholderTextColor="#A19382"
              value={code}
              onChangeText={setCode}
              autoCapitalize="characters"
              autoCorrect={false}
            />
            
            {suggestedCode ? (
              <TouchableOpacity onPress={() => setCode(suggestedCode)} style={styles.suggestionBox}>
                <Text style={styles.suggestionText}>
                  💡 Coba kode tersedia: <Text style={styles.suggestionCode}>{suggestedCode}</Text>
                </Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleComplete}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>{loading ? 'Menghubungkan...' : 'Mulai Jadi Companion'}</Text>
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
    textAlign: 'center', 
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: -0.5
  },
  subtitle: { 
    textAlign: 'center', 
    color: '#8B7355', 
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: 10
  },
  inputContainer: { 
    gap: 16 
  },
  input: { 
    backgroundColor: '#FFFFFF', 
    borderWidth: 1.5, 
    borderColor: '#DDD3C0', 
    borderRadius: 16, 
    padding: 18, 
    textAlign: 'center', 
    fontSize: 20, 
    letterSpacing: 2, 
    color: '#1A1A1A', 
    fontWeight: '600',
    textTransform: 'uppercase' 
  },
  suggestionBox: {
    backgroundColor: '#EDF5E8',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A1BCA8',
    marginTop: -8,
    marginBottom: 4
  },
  suggestionText: {
    color: '#3A6147',
    fontSize: 13,
  },
  suggestionCode: {
    fontWeight: '700',
  },
  button: { 
    backgroundColor: '#4A7C59', 
    paddingVertical: 18, 
    borderRadius: 16, 
    alignItems: 'center', 
    marginTop: 8,
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
    fontSize: 16 
  }
});
