import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Radius } from '@/constants/Colors';

export default function ProfileScreen() {
  const [cigPerDay, setCigPerDay] = useState(12);
  const [pricePerPack, setPricePerPack] = useState('30000');
  const [showHabitModal, setShowHabitModal] = useState(false);
  const [tempCig, setTempCig] = useState(12);
  const [tempPrice, setTempPrice] = useState('30000');
  const [copied, setCopied] = useState(false);

  const days = 100;
  const totalCigs = cigPerDay * days;
  const perCigPrice = parseInt(pricePerPack) / 20;
  const moneySaved = totalCigs * perCigPrice;
  const formatRp = (n: number) => n >= 1000000 ? `Rp ${(n/1000000).toFixed(1)}jt` : `Rp ${n.toLocaleString('id-ID')}`;

  function openHabit() { setTempCig(cigPerDay); setTempPrice(pricePerPack); setShowHabitModal(true); }
  function saveHabit() { setCigPerDay(tempCig); setPricePerPack(tempPrice); setShowHabitModal(false); }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <Text style={styles.pageTitle}>Profile</Text>
        <TouchableOpacity style={styles.editBtn}>
          <Text style={{ color: Colors.textMuted, fontSize: 13 }}>✏</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>DK</Text>
            <View style={styles.avatarEdit}><Text style={{ color: Colors.white, fontSize: 9 }}>✏</Text></View>
          </View>
          <Text style={styles.profileName}>Dika Kurniawan</Text>
          <Text style={styles.profileSince}>Bergabung Agustus 2024</Text>
          <View style={styles.quitBadge}><Text style={styles.quitBadgeText}>🌱 {days} Hari Bebas Rokok</Text></View>
        </View>

        {/* Personal info */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Informasi Pribadi</Text>
          <View style={styles.infoCard}>
            {[
              { icon: '👤', label: 'Nama', value: 'Dika Kurniawan' },
              { icon: '📧', label: 'Email', value: 'dika@email.com' },
              { icon: '📅', label: 'Mulai berhenti', value: '12 Agustus 2024', badge: `${days} hari` },
            ].map((r, i, arr) => (
              <View key={r.label} style={[styles.infoRow, { borderBottomWidth: i < arr.length - 1 ? 1 : 0 }]}>
                <View style={styles.infoIcon}><Text style={{ fontSize: 15 }}>{r.icon}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>{r.label}</Text>
                  <Text style={styles.infoValue}>{r.value}</Text>
                </View>
                {r.badge
                  ? <View style={styles.greenBadge}><Text style={styles.greenBadgeText}>{r.badge}</Text></View>
                  : <Text style={styles.chevron}>›</Text>
                }
              </View>
            ))}
          </View>
        </View>

        {/* Smoking habit */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Kebiasaan Merokok (Sebelum Berhenti)</Text>
          <View style={styles.habitCard}>
            <View style={styles.habitTop}>
              <View>
                <Text style={styles.habitTitle}>Data Awal Setup</Text>
                <Text style={styles.habitSubtitle}>Digunakan untuk menghitung statistik</Text>
              </View>
              <TouchableOpacity onPress={openHabit}><Text style={styles.editLink}>Edit</Text></TouchableOpacity>
            </View>
            <View style={styles.habitGrid}>
              <View style={styles.habitItem}>
                <Text style={styles.habitItemLabel}>Batang per hari</Text>
                <Text style={styles.habitItemVal}>{cigPerDay}</Text>
                <Text style={styles.habitItemSub}>batang/hari</Text>
              </View>
              <View style={styles.habitItem}>
                <Text style={styles.habitItemLabel}>Harga per bungkus</Text>
                <Text style={styles.habitItemVal}>{formatRp(parseInt(pricePerPack)||0)}</Text>
                <Text style={styles.habitItemSub}>20 batang/bungkus</Text>
              </View>
              <View style={styles.habitItem}>
                <Text style={styles.habitItemLabel}>Total batang dihindari</Text>
                <Text style={[styles.habitItemVal, { color: Colors.greenDark }]}>{totalCigs.toLocaleString()}</Text>
                <Text style={styles.habitItemSub}>dalam {days} hari</Text>
              </View>
              <View style={styles.habitItem}>
                <Text style={styles.habitItemLabel}>Uang tersimpan</Text>
                <Text style={[styles.habitItemVal, { color: Colors.greenDark }]}>{formatRp(moneySaved)}</Text>
                <Text style={styles.habitItemSub}>dalam {days} hari</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Referral */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Kode Companion</Text>
          <View style={styles.refCard}>
            <Text style={styles.refTitle}>Referral Code</Text>
            <Text style={styles.refSub}>Bagikan ke teman untuk jadi companion</Text>
            <View style={styles.refCodeBox}>
              <Text style={styles.refCodeText}>QT-X7K3M</Text>
              <TouchableOpacity
                style={styles.copyBtn}
                onPress={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }}
              >
                <Text style={styles.copyBtnText}>{copied ? '✓ Copied!' : 'Salin'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.refStats}>
              {[['1','Companion aktif'],['3','Kode dibagikan'],['100%','Acceptance rate']].map(([v,l]) => (
                <View key={l} style={styles.refStat}>
                  <Text style={styles.refStatVal}>{v}</Text>
                  <Text style={styles.refStatLabel}>{l}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Pengaturan</Text>
          <View style={styles.infoCard}>
            <View style={[styles.infoRow, { borderBottomWidth: 1 }]}>
              <View style={[styles.infoIcon, { backgroundColor: Colors.rosePale }]}><Text style={{ fontSize: 15 }}>🔔</Text></View>
              <View style={{ flex: 1 }}><Text style={styles.infoLabel}>Notifikasi</Text><Text style={styles.infoValue}>Aktif</Text></View>
              <View style={styles.greenBadge}><Text style={styles.greenBadgeText}>ON</Text></View>
            </View>
            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: Colors.greenPale }]}><Text style={{ fontSize: 15 }}>⏰</Text></View>
              <View style={{ flex: 1 }}><Text style={styles.infoLabel}>Pengingat harian</Text><Text style={styles.infoValue}>08:00 pagi</Text></View>
              <Text style={styles.chevron}>›</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Keluar dari Akun</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Edit habit modal */}
      <Modal visible={showHabitModal} transparent animationType="slide" onRequestClose={() => setShowHabitModal(false)}>
        <Pressable style={styles.overlay} onPress={() => setShowHabitModal(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.handle} />
            <Text style={styles.modalTitle}>Edit Kebiasaan Merokok</Text>

            <Text style={styles.modalLabel}>Batang per hari (dulu)</Text>
            <View style={styles.stepperRow}>
              <TouchableOpacity style={styles.stepperBtn} onPress={() => setTempCig(c => Math.max(1, c - 1))}>
                <Text style={styles.stepperBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.stepperVal}>{tempCig}</Text>
              <TouchableOpacity style={styles.stepperBtn} onPress={() => setTempCig(c => Math.min(60, c + 1))}>
                <Text style={styles.stepperBtnText}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.stepperUnit}>batang / hari</Text>

            <Text style={styles.modalLabel}>Harga per bungkus (Rp)</Text>
            <TextInput
              style={styles.priceInput}
              value={tempPrice}
              onChangeText={setTempPrice}
              keyboardType="numeric"
              placeholder="cth: 30000"
              placeholderTextColor={Colors.brownLight}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={saveHabit}>
              <Text style={styles.saveBtnText}>Simpan</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingBottom: 8 },
  pageTitle: { fontSize: 18, fontWeight: '600', color: Colors.textPrimary },
  editBtn: { width: 36, height: 36, borderRadius: 18, borderWidth: 1.5, borderColor: Colors.brownLight, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center' },

  avatarSection: { alignItems: 'center', paddingHorizontal: 24, paddingBottom: 18 },
  avatarCircle: { width: 72, height: 72, borderRadius: 24, backgroundColor: Colors.greenPale, borderWidth: 2.5, borderColor: Colors.greenLight, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  avatarText: { fontSize: 26, fontWeight: '700', color: Colors.greenDark },
  avatarEdit: { position: 'absolute', bottom: -4, right: -4, width: 22, height: 22, borderRadius: 7, backgroundColor: Colors.greenMid, borderWidth: 2, borderColor: Colors.cream, alignItems: 'center', justifyContent: 'center' },
  profileName: { fontSize: 20, fontWeight: '300', color: Colors.textPrimary, marginBottom: 2 },
  profileSince: { fontSize: 12, color: Colors.textMuted, marginBottom: 6 },
  quitBadge: { backgroundColor: Colors.greenPale, borderWidth: 1, borderColor: Colors.greenLight, borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 4 },
  quitBadgeText: { fontSize: 11, color: Colors.greenDark, fontWeight: '600' },

  section: { padding: 16, paddingBottom: 0 },
  sectionLabel: { fontSize: 11, fontWeight: '600', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  infoCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 13, borderBottomColor: '#F0E8DC' },
  infoIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: Colors.greenPale, alignItems: 'center', justifyContent: 'center' },
  infoLabel: { fontSize: 11, color: Colors.textMuted, marginBottom: 1 },
  infoValue: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  greenBadge: { backgroundColor: Colors.greenPale, borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 2 },
  greenBadgeText: { fontSize: 10, color: Colors.greenDark, fontWeight: '600' },
  chevron: { fontSize: 18, color: Colors.brownLight },

  habitCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, padding: 14 },
  habitTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  habitTitle: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  habitSubtitle: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  editLink: { fontSize: 12, color: Colors.greenMid, fontWeight: '600' },
  habitGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  habitItem: { width: '47.5%', backgroundColor: Colors.cream, borderRadius: 12, padding: 10 },
  habitItemLabel: { fontSize: 10, color: Colors.textMuted, marginBottom: 4 },
  habitItemVal: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  habitItemSub: { fontSize: 10, color: Colors.textMuted, marginTop: 2 },

  refCard: { borderRadius: Radius.lg, padding: 16, backgroundColor: Colors.greenDark },
  refTitle: { fontSize: 13, fontWeight: '600', color: Colors.white },
  refSub: { fontSize: 11, color: 'rgba(255,255,255,0.72)', marginTop: 1, marginBottom: 10 },
  refCodeBox: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  refCodeText: { fontSize: 22, fontWeight: '300', color: Colors.white, letterSpacing: 2 },
  copyBtn: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  copyBtnText: { fontSize: 11, fontWeight: '600', color: Colors.white },
  refStats: { flexDirection: 'row', gap: 12 },
  refStat: { alignItems: 'center' },
  refStatVal: { fontSize: 16, fontWeight: '700', color: Colors.white },
  refStatLabel: { fontSize: 10, color: 'rgba(255,255,255,0.65)' },

  logoutBtn: { marginHorizontal: 16, marginTop: 16, backgroundColor: Colors.white, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, padding: 12 },
  logoutText: { fontSize: 13, color: Colors.roseDark, textAlign: 'center', fontWeight: '500' },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: Colors.cream, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 36 },
  handle: { width: 36, height: 4, backgroundColor: Colors.brownLight, borderRadius: 2, alignSelf: 'center', marginBottom: 18 },
  modalTitle: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary, marginBottom: 16 },
  modalLabel: { fontSize: 11, fontWeight: '600', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  stepperBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  stepperBtnText: { fontSize: 18, fontWeight: '600', color: Colors.textPrimary },
  stepperVal: { flex: 1, textAlign: 'center', fontSize: 28, fontWeight: '300', color: Colors.textPrimary },
  stepperUnit: { fontSize: 12, color: Colors.textMuted, textAlign: 'center', marginBottom: 16 },
  priceInput: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, borderRadius: 14, padding: 12, fontSize: 14, color: Colors.textPrimary, marginBottom: 16 },
  saveBtn: { backgroundColor: Colors.greenMid, borderRadius: Radius.lg, padding: 13 },
  saveBtnText: { color: Colors.white, fontSize: 14, fontWeight: '600', textAlign: 'center' },
});
