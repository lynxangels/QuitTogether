import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Radius } from '@/constants/Colors';

const { width } = Dimensions.get('window');
const QUIT_DATE = new Date(Date.now() - 100 * 24 * 60 * 60 * 1000);

function useTimer() {
  const [elapsed, setElapsed] = useState(Date.now() - QUIT_DATE.getTime());
  useEffect(() => {
    const id = setInterval(() => setElapsed(Date.now() - QUIT_DATE.getTime()), 30000);
    return () => clearInterval(id);
  }, []);
  const totalMins = Math.floor(elapsed / 60000);
  return {
    days: Math.floor(totalMins / 1440),
    hours: String(Math.floor((totalMins % 1440) / 60)).padStart(2, '0'),
    mins: String(totalMins % 60).padStart(2, '0'),
  };
}

function StatCard({ icon, value, label, bg }: { icon: string; value: string; label: string; bg: string }) {
  return (
    <View style={[styles.statCard]}>
      <View style={[styles.statIconBox, { backgroundColor: bg }]}>
        <Text style={{ fontSize: 16 }}>{icon}</Text>
      </View>
      <Text style={styles.statNum}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const { days, hours, mins } = useTimer();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.appTitle}>QuitTogether</Text>
        <TouchableOpacity style={styles.gearBtn}>
          <Text style={{ color: Colors.textMuted, fontSize: 16 }}>⚙</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Timer */}
        <View style={styles.timerSection}>
          <View style={styles.timerRow}>
            <View style={styles.timerItem}>
              <Text style={styles.timerNum}>{days}</Text>
              <Text style={styles.timerLabel}>Days</Text>
            </View>
            <Text style={styles.timerSep}>:</Text>
            <View style={styles.timerItem}>
              <Text style={styles.timerNum}>{hours}</Text>
              <Text style={styles.timerLabel}>Hours</Text>
            </View>
            <Text style={styles.timerSep}>:</Text>
            <View style={styles.timerItem}>
              <Text style={styles.timerNum}>{mins}</Text>
              <Text style={styles.timerLabel}>Minutes</Text>
            </View>
          </View>
          <Text style={styles.timerMsg}>You're doing great! 🌱</Text>
        </View>

        {/* Tree Scene */}
        <View style={styles.treeScene}>
          {/* Canopy layers */}
          <View style={[styles.canopy, { width: 170, height: 120, bottom: 120, backgroundColor: '#4A8A3A', zIndex: 1 }]} />
          <View style={[styles.canopy, { width: 180, height: 120, bottom: 100, backgroundColor: '#5A9A4A', zIndex: 2 }]} />
          <View style={[styles.canopy, { width: 165, height: 110, bottom: 90, backgroundColor: '#6AAA58', zIndex: 3 }]} />
          <View style={[styles.canopy, { width: 140, height: 100, bottom: 100, backgroundColor: '#7BBF68', zIndex: 4 }]} />
          <View style={[styles.canopy, { width: 120, height: 88, bottom: 108, backgroundColor: '#8FCC78', zIndex: 5 }]} />
          {/* Flowers */}
          <View style={[styles.flower, { left: width / 2 - 60, bottom: 175, zIndex: 6 }]} />
          <View style={[styles.flower, { left: width / 2 + 25, bottom: 180, backgroundColor: '#F9A825', zIndex: 6 }]} />
          <View style={[styles.flower, { left: width / 2 - 5, bottom: 194, width: 8, height: 8, zIndex: 6 }]} />
          {/* Trunk */}
          <View style={styles.trunk} />
          {/* Grass */}
          <View style={styles.grass} />
          {/* Companion bubble RIGHT side */}
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>don't you dare smoke or i'll be angry &gt;:‹</Text>
          </View>
          <View style={styles.compAvatar}>
            <Text style={styles.compAvaLabel}>AR</Text>
          </View>
        </View>

        {/* Bottom cards */}
        <View style={styles.cards}>

          {/* Water progress */}
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.cardTitle}>Air Pohon Janji</Text>
              <View style={styles.pill}>
                <Text style={styles.pillText}>Stage 3 — Pohon Kecil</Text>
              </View>
            </View>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: '62%' }]} />
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.cardSub}>620 / 1000 air terkumpul</Text>
              <Text style={styles.cardSub}>380 lagi → Pohon Sedang</Text>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsGrid}>
            <StatCard icon="📊" value="300" label="cigarettes avoided" bg={Colors.greenPale} />
            <StatCard icon="💰" value="Rp 900k" label="money saved" bg={Colors.amberLight} />
            <StatCard icon="✓" value="18" label="cravings avoided" bg={Colors.bluePale} />
            <StatCard icon="⏱" value="50h" label="time won back" bg={Colors.rosePale} />
          </View>

          {/* Companion */}
          <View>
            <Text style={styles.sectionLabel}>Companion</Text>
            <View style={styles.companionCard}>
              <View style={styles.compAvaSmall}>
                <Text style={styles.compAvaSmallText}>AR</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.compName}>Andi Rizky</Text>
                <Text style={styles.compSub}>Sedang memantau pohonmu</Text>
              </View>
              <View style={styles.onlineDot} />
            </View>
          </View>

        </View>

        <View style={{ height: 110 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },

  topBar: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 24, paddingBottom: 8,
  },
  appTitle: { fontSize: 20, fontWeight: '600', color: Colors.textPrimary, letterSpacing: -0.3 },
  gearBtn: {
    width: 36, height: 36, borderRadius: 18,
    borderWidth: 1.5, borderColor: Colors.brownLight,
    backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center',
  },

  scrollContent: {},

  timerSection: { paddingHorizontal: 24, paddingBottom: 16, alignItems: 'center' },
  timerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 4 },
  timerItem: { alignItems: 'center', minWidth: 64 },
  timerNum: { fontSize: 40, fontWeight: '300', color: Colors.textPrimary, lineHeight: 44 },
  timerLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '500', marginTop: 2 },
  timerSep: { fontSize: 28, color: Colors.brownLight, fontWeight: '300', marginTop: 6 },
  timerMsg: { fontSize: 13, color: Colors.textMuted },

  // Tree scene
  treeScene: {
    height: 250, position: 'relative', overflow: 'hidden',
    backgroundColor: Colors.skyTop,
  },
  canopy: {
    position: 'absolute', borderRadius: 999,
    alignSelf: 'center', left: undefined,
  },
  trunk: {
    position: 'absolute', bottom: 36,
    width: 18, height: 65,
    backgroundColor: '#8B5E3C', borderRadius: 6,
    alignSelf: 'center', zIndex: 1,
  },
  grass: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 40, backgroundColor: Colors.grass,
    borderTopLeftRadius: 80, borderTopRightRadius: 80,
    zIndex: 0,
  },
  flower: {
    position: 'absolute', width: 11, height: 11,
    borderRadius: 6, backgroundColor: Colors.amber,
  },
  speechBubble: {
    position: 'absolute', bottom: 50, right: 16,
    backgroundColor: Colors.white,
    borderRadius: 14, borderBottomRightRadius: 4,
    padding: 9, maxWidth: 148,
    borderWidth: 1, borderColor: '#E0D5C5',
    zIndex: 8,
  },
  speechText: { fontSize: 11.5, color: Colors.textPrimary, lineHeight: 16 },
  compAvatar: {
    position: 'absolute', bottom: 36, right: 172,
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.greenPale,
    borderWidth: 2.5, borderColor: Colors.greenLight,
    alignItems: 'center', justifyContent: 'center', zIndex: 8,
  },
  compAvaLabel: { fontSize: 13, fontWeight: '600', color: Colors.greenDark },

  // Cards
  cards: { padding: 16, gap: 12 },
  card: {
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border, padding: 14, gap: 8,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  cardSub: { fontSize: 11, color: Colors.textMuted },
  pill: { backgroundColor: Colors.greenPale, borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 3 },
  pillText: { fontSize: 11, color: Colors.greenDark, fontWeight: '500' },
  progressBg: { height: 9, backgroundColor: Colors.creamDark, borderRadius: 9, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.greenLight, borderRadius: 9 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: {
    width: '47.5%', backgroundColor: Colors.white, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border, padding: 13, gap: 5,
  },
  statIconBox: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  statNum: { fontSize: 22, fontWeight: '300', color: Colors.textPrimary, lineHeight: 26 },
  statLabel: { fontSize: 11, color: Colors.textMuted },

  sectionLabel: { fontSize: 11, fontWeight: '600', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  companionCard: {
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border,
    padding: 13, flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  compAvaSmall: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: Colors.greenPale, borderWidth: 1.5,
    borderColor: Colors.greenLight, alignItems: 'center', justifyContent: 'center',
  },
  compAvaSmallText: { fontSize: 13, fontWeight: '600', color: Colors.greenDark },
  compName: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  compSub: { fontSize: 11, color: Colors.textMuted, marginTop: 1 },
  onlineDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: Colors.greenLight },
});
