import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Radius } from '@/constants/Colors';

export default function CompanionScreen() {
  const [hasCompanion] = useState(true); // toggle to false to see empty state
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState('');

  if (!hasCompanion) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.topBar}><Text style={styles.pageTitle}>Companion</Text></View>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyEmoji}>🤝</Text>
          <Text style={styles.emptyTitle}>You don't have a companion</Text>
          <Text style={styles.emptySub}>do you want to add one?</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)}>
            <Text style={styles.addBtnText}>Tambah Companion</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
          <Pressable style={styles.overlay} onPress={() => setShowModal(false)}>
            <Pressable style={styles.sheet} onPress={() => {}}>
              <View style={styles.handle} />
              <Text style={styles.modalTitle}>Tambah Companion</Text>
              <Text style={styles.modalSub}>Bagikan kode referral kamu, atau masukkan kode teman.</Text>
              <View style={styles.refBox}>
                <Text style={styles.refCode}>QT-X7K3M</Text>
                <Text style={styles.refHint}>Kode referral kamu</Text>
              </View>
              <TouchableOpacity style={styles.shareBtn}><Text style={styles.shareBtnText}>📤 Bagikan Kode</Text></TouchableOpacity>
              <View style={styles.inputRow}>
                <TextInput style={styles.codeInput} placeholder="Masukkan kode teman..." placeholderTextColor={Colors.brownLight} value={code} onChangeText={setCode} />
                <TouchableOpacity style={styles.connectBtn}><Text style={styles.connectBtnText}>Hubungkan</Text></TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowModal(false)}>
                <Text style={styles.cancelBtnText}>Nanti saja</Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}><Text style={styles.pageTitle}>Companion</Text></View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>

        {/* Companion banner */}
        <View style={styles.banner}>
          <View style={styles.bannerTop}>
            <View style={styles.avaLg}><Text style={styles.avaLgText}>AR</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerName}>Andi Rizky</Text>
              <Text style={styles.bannerSince}>Companion sejak 100 hari lalu</Text>
            </View>
            <View style={styles.onlineBadge}>
              <View style={styles.onlineDotSm} />
              <Text style={styles.onlineBadgeText}>Online</Text>
            </View>
          </View>
          <View style={styles.bannerStats}>
            {[['100','Hari bareng'],['14','Craving bantu'],['98%','Response rate']].map(([v,l]) => (
              <View key={l} style={styles.bannerStat}>
                <Text style={styles.bannerStatVal}>{v}</Text>
                <Text style={styles.bannerStatLabel}>{l}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Latest message */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Pesan Terbaru</Text>
          <View style={styles.nudgeCard}>
            <View style={styles.nudgeTop}>
              <Text style={styles.nudgeEmoji}>💬</Text>
              <View>
                <Text style={styles.nudgeName}>Andi Rizky</Text>
                <Text style={styles.nudgeTime}>5 menit lalu</Text>
              </View>
            </View>
            <View style={styles.nudgeMsg}>
              <Text style={styles.nudgeMsgText}>"Hei! Sudah hari ke-100 nih, kamu luar biasa! Jangan nyerah ya, kita sudah sejauh ini bareng 💪"</Text>
            </View>
            <View style={styles.nudgeActions}>
              <TouchableOpacity style={[styles.nudgeBtn, styles.nudgeBtnPrimary]}><Text style={styles.nudgeBtnPrimaryText}>Balas</Text></TouchableOpacity>
              <TouchableOpacity style={styles.nudgeBtn}><Text style={styles.nudgeBtnText}>❤️ React</Text></TouchableOpacity>
              <TouchableOpacity style={styles.nudgeBtn}><Text style={styles.nudgeBtnText}>👍 OK!</Text></TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Progress comparison */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Progress Kalian</Text>
          <View style={styles.card}>
            {[{ label: 'Kamu', initials: 'Aku', days: 100, pct: 0.8, bg: Colors.greenPale, border: Colors.greenLight, tc: Colors.greenDark, bar: Colors.greenLight },
              { label: 'Andi Rizky', initials: 'AR', days: 87, pct: 0.7, bg: Colors.creamDark, border: Colors.brownLight, tc: Colors.textMuted, bar: Colors.brownLight }].map(p => (
              <View key={p.label} style={[styles.progressRow, { marginBottom: p.label === 'Kamu' ? 10 : 0 }]}>
                <View style={[styles.progAva, { backgroundColor: p.bg, borderColor: p.border }]}>
                  <Text style={[styles.progAvaText, { color: p.tc }]}>{p.initials}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.progHeader}>
                    <Text style={styles.progName}>{p.label}</Text>
                    <Text style={styles.progDays}>{p.days} hari</Text>
                  </View>
                  <View style={styles.progBg}>
                    <View style={[styles.progFill, { width: `${p.pct * 100}%`, backgroundColor: p.bar }]} />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Aktivitas Companion</Text>
          {[
            { icon: '🎉', text: 'Andi merayakan 100 hari bersamamu', time: 'Hari ini, 09:00', badge: 'Milestone', badgeBg: Colors.greenPale, badgeColor: Colors.greenDark },
            { icon: '⚡', text: 'Andi membantu kamu saat craving malam', time: '2 hari lalu, 23:50', badge: 'Craving', badgeBg: Colors.amberLight, badgeColor: Colors.amberDark },
            { icon: '💬', text: 'Andi mengirim pesan semangat', time: '3 hari lalu, 18:20', badge: null, badgeBg: '', badgeColor: '' },
          ].map((a, i) => (
            <View key={i} style={[styles.actItem, { marginBottom: i < 2 ? 8 : 0 }]}>
              <View style={styles.actIcon}><Text style={{ fontSize: 17 }}>{a.icon}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.actText}>{a.text}</Text>
                <Text style={styles.actTime}>{a.time}</Text>
              </View>
              {a.badge && <View style={[styles.actBadge, { backgroundColor: a.badgeBg }]}><Text style={[styles.actBadgeText, { color: a.badgeColor }]}>{a.badge}</Text></View>}
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.removeBtn}>
          <Text style={styles.removeBtnText}>Lepaskan Companion</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  topBar: { paddingHorizontal: 24, paddingBottom: 8 },
  pageTitle: { fontSize: 18, fontWeight: '600', color: Colors.textPrimary },

  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, paddingBottom: 100 },
  emptyEmoji: { fontSize: 52, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '300', color: Colors.textPrimary, textAlign: 'center', marginBottom: 6 },
  emptySub: { fontSize: 13, color: Colors.textMuted, textAlign: 'center', marginBottom: 28, lineHeight: 20 },
  addBtn: { width: '100%', backgroundColor: Colors.greenMid, borderRadius: Radius.lg, padding: 15 },
  addBtnText: { color: Colors.white, fontSize: 14, fontWeight: '600', textAlign: 'center' },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: Colors.cream, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 36 },
  handle: { width: 36, height: 4, backgroundColor: Colors.brownLight, borderRadius: 2, alignSelf: 'center', marginBottom: 18 },
  modalTitle: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary, marginBottom: 6 },
  modalSub: { fontSize: 12, color: Colors.textMuted, marginBottom: 16, lineHeight: 18 },
  refBox: { backgroundColor: Colors.white, borderRadius: Radius.lg, borderWidth: 1.5, borderColor: Colors.greenLight, borderStyle: 'dashed', padding: 16, alignItems: 'center', marginBottom: 12 },
  refCode: { fontSize: 28, fontWeight: '300', color: Colors.greenDark, letterSpacing: 3 },
  refHint: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  shareBtn: { backgroundColor: Colors.greenMid, borderRadius: Radius.md, padding: 13, marginBottom: 8 },
  shareBtnText: { color: Colors.white, fontSize: 14, fontWeight: '600', textAlign: 'center' },
  inputRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  codeInput: { flex: 1, backgroundColor: Colors.white, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, padding: 10, fontSize: 13, color: Colors.textPrimary },
  connectBtn: { backgroundColor: Colors.greenPale, borderRadius: Radius.md, padding: 10, borderWidth: 1.5, borderColor: Colors.greenLight, justifyContent: 'center' },
  connectBtnText: { fontSize: 12, fontWeight: '600', color: Colors.greenDark },
  cancelBtn: { backgroundColor: Colors.white, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, padding: 10 },
  cancelBtnText: { fontSize: 13, color: Colors.textMuted, textAlign: 'center' },

  banner: { marginHorizontal: 16, borderRadius: Radius.xl, padding: 18, backgroundColor: Colors.greenDark, marginBottom: 0 },
  bannerTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  avaLg: { width: 52, height: 52, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 2, borderColor: 'rgba(255,255,255,0.35)', alignItems: 'center', justifyContent: 'center' },
  avaLgText: { fontSize: 18, fontWeight: '700', color: Colors.white },
  bannerName: { fontSize: 16, fontWeight: '700', color: Colors.white },
  bannerSince: { fontSize: 11, color: 'rgba(255,255,255,0.72)', marginTop: 2 },
  onlineBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  onlineDotSm: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#6EE28A' },
  onlineBadgeText: { fontSize: 11, color: '#A8F0C0', fontWeight: '600' },
  bannerStats: { flexDirection: 'row', gap: 8 },
  bannerStat: { flex: 1, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: 8, alignItems: 'center' },
  bannerStatVal: { fontSize: 16, fontWeight: '700', color: Colors.white },
  bannerStatLabel: { fontSize: 10, color: 'rgba(255,255,255,0.65)' },

  section: { padding: 16, paddingBottom: 0 },
  sectionLabel: { fontSize: 11, fontWeight: '600', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },

  nudgeCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, padding: 14 },
  nudgeTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  nudgeEmoji: { fontSize: 18 },
  nudgeName: { fontSize: 12, fontWeight: '600', color: Colors.textPrimary },
  nudgeTime: { fontSize: 11, color: Colors.textMuted },
  nudgeMsg: { backgroundColor: Colors.cream, borderRadius: 12, padding: 10, marginBottom: 10, borderLeftWidth: 3, borderLeftColor: Colors.greenLight },
  nudgeMsgText: { fontSize: 13, color: Colors.textPrimary, lineHeight: 19 },
  nudgeActions: { flexDirection: 'row', gap: 6 },
  nudgeBtn: { flex: 1, backgroundColor: Colors.white, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, padding: 8, alignItems: 'center' },
  nudgeBtnPrimary: { backgroundColor: Colors.greenPale, borderColor: Colors.greenLight },
  nudgeBtnPrimaryText: { fontSize: 11, fontWeight: '600', color: Colors.greenDark },
  nudgeBtnText: { fontSize: 11, fontWeight: '500', color: Colors.textPrimary },

  card: { backgroundColor: Colors.white, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, padding: 14 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  progAva: { width: 32, height: 32, borderRadius: 10, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  progAvaText: { fontSize: 11, fontWeight: '700' },
  progHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  progName: { fontSize: 12, fontWeight: '600', color: Colors.textPrimary },
  progDays: { fontSize: 11, color: Colors.textMuted },
  progBg: { height: 7, backgroundColor: Colors.creamDark, borderRadius: 7, overflow: 'hidden' },
  progFill: { height: '100%', borderRadius: 7 },

  actItem: { backgroundColor: Colors.white, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  actIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: Colors.greenPale, alignItems: 'center', justifyContent: 'center' },
  actText: { fontSize: 12.5, fontWeight: '500', color: Colors.textPrimary },
  actTime: { fontSize: 11, color: Colors.textMuted, marginTop: 1 },
  actBadge: { borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 2 },
  actBadgeText: { fontSize: 10, fontWeight: '600' },

  removeBtn: { marginHorizontal: 16, marginTop: 16, backgroundColor: Colors.white, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, padding: 11 },
  removeBtnText: { fontSize: 13, color: Colors.roseDark, textAlign: 'center', fontWeight: '500' },
});
