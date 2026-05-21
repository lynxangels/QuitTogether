import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Ellipse, Circle } from 'react-native-svg';

export type TreeStage = 1 | 2 | 3 | 4 | 5 | 6;

interface Props {
  stage: TreeStage;
}

export const PohonJanji = ({ stage }: Props) => {
  return (
    <View style={styles.container}>
      <Svg viewBox="0 0 260 210" fill="none">
        {/* Shadow */}
        {stage > 1 && <Ellipse cx="130" cy="195" rx="40" ry="7" fill="#4A8050" opacity="0.25" />}
        
        {/* Trunk */}
        {stage === 2 && (
          <Rect x="126" y="170" width="8" height="26" rx="4" fill="#8B5E3C" />
        )}
        {stage >= 3 && (
          <>
            <Rect x="122" y="138" width="16" height="58" rx="6" fill="#8B5E3C"/>
            <Rect x="112" y="152" width="10" height="5" rx="2.5" fill="#7A5030" transform="rotate(-28 112 152)"/>
            <Rect x="138" y="160" width="10" height="5" rx="2.5" fill="#7A5030" transform="rotate(28 138 160)"/>
          </>
        )}

        {/* Leaves */}
        {stage >= 3 && (
          <>
            <Ellipse cx="130" cy="122" rx={stage > 3 ? 50 : 30} ry={stage > 3 ? 40 : 25} fill="#4A8A3A"/>
            <Ellipse cx="96" cy="134" rx={stage > 3 ? 36 : 20} ry={stage > 3 ? 29 : 16} fill="#5A9A4A"/>
            <Ellipse cx="164" cy="132" rx={stage > 3 ? 36 : 20} ry={stage > 3 ? 29 : 16} fill="#5A9A4A"/>
          </>
        )}
        
        {/* More leaves */}
        {stage >= 4 && (
          <>
            <Ellipse cx="130" cy="104" rx="42" ry="34" fill="#6AAA58"/>
            <Ellipse cx="112" cy="92" rx="26" ry="21" fill="#7BBF68"/>
            <Ellipse cx="148" cy="90" rx="26" ry="21" fill="#7BBF68"/>
            <Ellipse cx="100" cy="112" rx="16" ry="13" fill="#6CBF58" opacity="0.85"/>
            <Ellipse cx="158" cy="110" rx="16" ry="13" fill="#6CBF58" opacity="0.85"/>
          </>
        )}

        {/* Top leaves */}
        {stage >= 5 && (
          <>
            <Ellipse cx="130" cy="80" rx="24" ry="19" fill="#8FCC78"/>
            <Ellipse cx="120" cy="76" rx="11" ry="9" fill="#A8E088" opacity="0.65"/>
          </>
        )}

        {/* Fruits */}
        {stage >= 6 && (
          <>
            <Circle cx="104" cy="97" r="4" fill="#F5C542" opacity="0.9"/>
            <Circle cx="154" cy="93" r="3.5" fill="#F5C542" opacity="0.9"/>
            <Circle cx="130" cy="84" r="3.5" fill="#F9A825" opacity="0.9"/>
            <Circle cx="114" cy="110" r="3" fill="#F5C542" opacity="0.85"/>
          </>
        )}

        {/* Seed */}
        {stage === 1 && (
          <Ellipse cx="130" cy="190" rx="6" ry="4" fill="#8B5E3C" />
        )}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', width: 240, height: 210, zIndex: 10 }
});
