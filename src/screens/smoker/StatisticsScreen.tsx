import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import Svg, { Path } from 'react-native-svg';
import { auth, db } from '../../firebase/config';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';

const ChevronLeft = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B7355" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M15 18l-6-6 6-6" />
  </Svg>
);

const ChevronRight = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B7355" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 18l6-6-6-6" />
  </Svg>
);

export const StatisticsScreen = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateObj, setSelectedDateObj] = useState<{ id: string, day: number, type: string, log?: any } | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    let unsubscribeLogs: () => void;

    const fetchInitialDataAndListen = async () => {
      try {
        const pDoc = await getDoc(doc(db, 'smokerProfiles', user.uid));
        if (pDoc.exists()) setProfile(pDoc.data());

        const q = query(collection(db, 'cravingLogs'), where('smokerId', '==', user.uid));
        
        // Listen in real-time
        unsubscribeLogs = onSnapshot(q, (snapshot) => {
          const fetchedLogs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          setLogs(fetchedLogs);
          setLoading(false); // Stop loading once first data arrives
        }, (error) => {
          console.error('Error fetching statistics data', error);
          setLoading(false);
        });

      } catch (e) {
        console.error('Error fetching profile data', e);
        setLoading(false);
      }
    };
    
    fetchInitialDataAndListen();

    return () => {
      if (unsubscribeLogs) unsubscribeLogs();
    };
  }, []);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate calendar days for current month
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed
  
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const quitStartDate = profile?.quitStartDate ? new Date(profile.quitStartDate) : new Date();

  const dates = [];
  // padding
  for (let i = 0; i < firstDayOfMonth; i++) {
    dates.push({ id: `pad${i}`, empty: true });
  }

  // Populate days
  for (let i = 1; i <= daysInMonth; i++) {
    const currentIterDate = new Date(year, month, i);
    // Remove time portion for comparison
    const iterDateString = currentIterDate.toDateString();
    
    // Find logs for this date
    const dayLogs = logs.filter(log => {
      const logDate = log.createdAt?.toDate ? log.createdAt.toDate() : new Date(log.createdAt);
      return logDate.toDateString() === iterDateString;
    });

    let type = 'normal'; // default (Clean / safe)
    let primaryLog = null;

    if (currentIterDate > today) {
      type = 'future';
    } else if (currentIterDate < quitStartDate && quitStartDate.toDateString() !== iterDateString) {
      type = 'future'; // Before quit date, treat as disabled/empty
    } else {
      if (dayLogs.length > 0) {
        // If there's any relapse, it's a danger day
        const hasRelapse = dayLogs.some(l => l.status === 'relapsed');
        if (hasRelapse) {
          type = 'danger';
          primaryLog = dayLogs.find(l => l.status === 'relapsed');
        } else {
          // If logs exist but all are survived
          type = 'warning';
          primaryLog = dayLogs[0];
        }
      } else {
        type = 'active'; // Clean day!
      }
    }

    dates.push({ id: i.toString(), day: i, type, log: primaryLog, fullDate: currentIterDate });
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDateObj(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDateObj(null);
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  if (loading) {
    return (
      <ScreenWrapper style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#5BA86A" />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper style={styles.container}>
      <Text style={styles.title}>Statistics</Text>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.monthHeader}>
          <TouchableOpacity style={styles.navBtn} onPress={handlePrevMonth}>
            <ChevronLeft />
          </TouchableOpacity>
          <Text style={styles.monthText}>{monthNames[month]} {year}</Text>
          <TouchableOpacity style={styles.navBtn} onPress={handleNextMonth}>
            <ChevronRight />
          </TouchableOpacity>
        </View>

        <View style={styles.calendarWrapper}>
          <View style={styles.weekDays}>
            {daysOfWeek.map((day) => (
              <Text key={day} style={styles.weekDayText}>{day}</Text>
            ))}
          </View>
          
          <View style={styles.daysGrid}>
            {dates.map((dateObj) => {
              if (dateObj.empty) {
                return <View key={dateObj.id} style={styles.dayCell} />;
              }

              let cellStyle: any[] = [styles.dayCellInner];
              let textStyle: any[] = [styles.dayText];
              
              const isSelected = selectedDateObj?.id === dateObj.id;
              if (isSelected) {
                cellStyle.push({ borderWidth: 2, borderColor: '#1A1A1A' });
              }

              switch (dateObj.type) {
                case 'normal':
                  cellStyle.push(styles.cellNormal);
                  textStyle.push(styles.textNormal);
                  break;
                case 'warning':
                  cellStyle.push(styles.cellWarning);
                  textStyle.push(styles.textWarning);
                  break;
                case 'danger':
                  cellStyle.push(styles.cellDanger);
                  textStyle.push(styles.textDanger);
                  break;
                case 'active':
                  cellStyle.push(styles.cellActive);
                  textStyle.push(styles.textActive);
                  break;
                case 'future':
                  cellStyle.push(styles.cellFuture);
                  textStyle.push(styles.textFuture);
                  break;
              }

              return (
                <TouchableOpacity 
                  key={dateObj.id} 
                  style={styles.dayCell}
                  onPress={() => {
                    if (dateObj.type !== 'future') {
                      setSelectedDateObj(dateObj as any);
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <View style={cellStyle}>
                    <Text style={textStyle}>{dateObj.day}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Selected Date Details */}
        {selectedDateObj && (
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsDate}>
              {new Date(year, month, selectedDateObj.day).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </Text>
            
            {selectedDateObj.type === 'active' && (
              <View style={[styles.historyCard, { borderColor: '#81C784', backgroundColor: '#EDF5E8' }]}>
                <Text style={styles.historyTitle}>Hari yang Bersih! 🌿</Text>
                <Text style={styles.historyDesc}>Tidak ada catatan craving. Anda berhasil melewati hari ini dengan luar biasa.</Text>
                <View style={styles.tagsRow}>
                  <View style={[styles.tag, { borderColor: '#4A694B' }]}>
                    <Text style={[styles.tagText, { color: '#4A694B' }]}>100% Clean</Text>
                  </View>
                </View>
              </View>
            )}

            {selectedDateObj.type === 'warning' && (
              <View style={[styles.historyCard, { borderColor: '#FBC02D', backgroundColor: '#FFFDE7' }]}>
                <Text style={styles.historyTitle}>Craving Teratasi 💪</Text>
                <Text style={styles.historyDesc}>
                  Anda merasakan craving karena {selectedDateObj.log?.trigger === 'stress' ? 'stres/tekanan' : selectedDateObj.log?.trigger === 'bored' ? 'rasa bosan' : 'kebiasaan lama'}, tapi Anda berhasil melawannya!
                </Text>
                <View style={styles.tagsRow}>
                  <View style={[styles.tag, { borderColor: '#F57F17', backgroundColor: '#FFF' }]}>
                    <Text style={[styles.tagText, { color: '#F57F17' }]}>Survived</Text>
                  </View>
                  <View style={[styles.tag, { borderColor: '#8B7355', backgroundColor: '#FFF' }]}>
                    <Text style={[styles.tagText, { color: '#8B7355' }]}>+{selectedDateObj.log?.waterAdded} Air</Text>
                  </View>
                </View>
              </View>
            )}

            {selectedDateObj.type === 'danger' && (
              <View style={[styles.historyCard, { borderColor: '#E57373', backgroundColor: '#FDECEA' }]}>
                <Text style={styles.historyTitle}>Relapsed 😔</Text>
                <Text style={styles.historyDesc}>
                  Anda merokok karena {selectedDateObj.log?.trigger === 'stress' ? 'stres/tekanan' : selectedDateObj.log?.trigger === 'bored' ? 'rasa bosan' : 'kebiasaan lama'}. Jangan menyerah, besok kita mulai lagi!
                </Text>
                <View style={styles.tagsRow}>
                  <View style={[styles.tag, { borderColor: '#D32F2F', backgroundColor: '#FFF' }]}>
                    <Text style={[styles.tagText, { color: '#D32F2F' }]}>Relapsed</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7F3EE' },
  container: {
    flex: 1,
    backgroundColor: '#F7F3EE',
    paddingHorizontal: 20,
    paddingTop: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 24,
    letterSpacing: -0.5
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 32
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#DDD3C0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  monthText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1A1A1A',
    width: 140,
    textAlign: 'center'
  },
  calendarWrapper: {
    marginBottom: 24
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
    color: '#8B7355'
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 3,
  },
  dayCellInner: {
    flex: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600'
  },
  cellNormal: {
    backgroundColor: '#EDF5E8',
    borderColor: '#81C784',
  },
  textNormal: {
    color: '#2E7D32'
  },
  cellWarning: {
    backgroundColor: '#FFFDE7',
    borderColor: '#FBC02D',
  },
  textWarning: {
    color: '#F57F17'
  },
  cellDanger: {
    backgroundColor: '#FDECEA',
    borderColor: '#E57373',
  },
  textDanger: {
    color: '#D32F2F'
  },
  cellActive: {
    backgroundColor: '#4A694B',
    borderColor: '#4A694B',
  },
  textActive: {
    color: '#FFFFFF'
  },
  cellFuture: {
    backgroundColor: '#EBE5D9',
    borderColor: '#EBE5D9',
  },
  textFuture: {
    color: '#BDBDBD'
  },
  detailsContainer: {
    marginTop: 16,
    paddingHorizontal: 4
  },
  detailsDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
    textTransform: 'capitalize'
  },
  historyCard: {
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8
  },
  historyDesc: {
    fontSize: 14,
    color: '#4A4A4A',
    lineHeight: 20,
    marginBottom: 16
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  }
});
