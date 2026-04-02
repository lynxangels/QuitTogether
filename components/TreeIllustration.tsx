import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Rect, Ellipse, Circle, Path } from 'react-native-svg';
import { Colors } from '../constants/Colors';

interface TreeIllustrationProps {
  companionName?: string;
  message?: string;
}

export default function TreeIllustration({ companionName = 'AR', message = "don't you dare smoke or i'll be angry >:‹" }: TreeIllustrationProps) {
  return (
    <View style={styles.treeBg}>
      {/* Tree SVG */}
      <Svg width={240} height={210} viewBox="0 0 260 210">
        {/* Trunk */}
        <Rect x="122" y="138" width="16" height="58" rx="6" fill="#8B5E3C" />
        <Rect x="112" y="152" width="10" height="5" rx="2.5" fill="#7A5030"
          transform="rotate(-28 112 152)" />
        <Rect x="138" y="160" width="10" height="5" rx="2.5" fill="#7A5030"
          transform="rotate(28 138 160)" />
        {/* Canopy */}
        <Ellipse cx="130" cy="122" rx="50" ry="40" fill="#4A8A3A" />
        <Ellipse cx="96" cy="134" rx="36" ry="29" fill="#5A9A4A" />
        <Ellipse cx="164" cy="132" rx="36" ry="29" fill="#5A9A4A" />
        <Ellipse cx="130" cy="104" rx="42" ry="34" fill="#6AAA58" />
        <Ellipse cx="112" cy="92" rx="26" ry="21" fill="#7BBF68" />
        <Ellipse cx="148" cy="90" rx="26" ry="21" fill="#7BBF68" />
        <Ellipse cx="130" cy="80" rx="24" ry="19" fill="#8FCC78" />
        <Ellipse cx="100" cy="112" rx="16" ry="13" fill="#6CBF58" opacity="0.85" />
        <Ellipse cx="158" cy="110" rx="16" ry="13" fill="#6CBF58" opacity="0.85" />
        <Ellipse cx="120" cy="76" rx="11" ry="9" fill="#A8E088" opacity="0.65" />
        {/* Flowers */}
        <Circle cx="104" cy="97" r="4" fill="#F5C542" opacity="0.9" />
        <Circle cx="154" cy="93" r="3.5" fill="#F5C542" opacity="0.9" />
        <Circle cx="130" cy="84" r="3.5" fill="#F9A825" opacity="0.9" />
        <Circle cx="114" cy="110" r="3" fill="#F5C542" opacity="0.85" />
        {/* Shadow */}
        <Ellipse cx="130" cy="195" rx="40" ry="7" fill="#4A8050" opacity="0.25" />
      </Svg>

      {/* Companion avatar + bubble on right */}
      <View style={styles.companionGroup}>
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>{message}</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{companionName}</Text>
        </View>
      </View>

      {/* Grass ground */}
      <View style={styles.grass} />
    </View>
  );
}

const styles = StyleSheet.create({
  treeBg: {
    backgroundColor: Colors.skyTop,
    alignItems: 'center',
    paddingTop: 12,
    minHeight: 250,
    position: 'relative',
    overflow: 'hidden',
  },
  companionGroup: {
    position: 'absolute',
    bottom: 36,
    right: 16,
    alignItems: 'flex-end',
    gap: 6,
  },
  bubble: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderBottomRightRadius: 4,
    padding: 9,
    maxWidth: 148,
    borderWidth: 1,
    borderColor: '#E0D5C5',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  bubbleText: {
    fontSize: 11.5,
    color: Colors.textPrimary,
    lineHeight: 16,
    fontFamily: 'System',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.greenPale,
    borderWidth: 2.5,
    borderColor: Colors.greenLight,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.greenDark,
  },
  grass: {
    width: '100%',
    height: 32,
    backgroundColor: Colors.grass,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    marginTop: -10,
  },
});
