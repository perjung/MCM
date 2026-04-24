import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, PanResponder, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const ROW_HEIGHT = 45; 
const LABEL_WIDTH = 50; 
const CELL_WIDTH = (width * 0.5 - LABEL_WIDTH) / 6; 
const TOTAL_HOURS = 24; 

export default function Timetable({ schedules, onDragComplete, previewColor }) {
  const [isScrollEnabled, setIsScrollEnabled] = useState(true); 
  const [activeDrag, setActiveDrag] = useState(null); 
  const dragInfo = useRef({ start: null, current: null }); 

  // 🔥 핵심 수정: 부모로부터 받은 최신 props를 PanResponder가 볼 수 있게 Ref에 담습니다.
  const propsRef = useRef({ schedules, onDragComplete });
  useEffect(() => {
    propsRef.current = { schedules, onDragComplete };
  }, [schedules, onDragComplete]);

  const getIndexFromXY = (x, y) => {
    const hourIdx = Math.floor(y / ROW_HEIGHT);
    const minIdx = Math.floor((x - LABEL_WIDTH) / CELL_WIDTH);
    const totalIdx = (hourIdx * 6) + Math.max(0, Math.min(minIdx, 5));
    return Math.max(0, Math.min(totalIdx, TOTAL_HOURS * 6 - 1));
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderGrant: (evt) => {
        setIsScrollEnabled(false); 
        const { locationX, locationY } = evt.nativeEvent;
        const index = getIndexFromXY(locationX, locationY);
        dragInfo.current = { start: index, current: index };
        setActiveDrag({ ...dragInfo.current });
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        const index = getIndexFromXY(locationX, locationY);
        dragInfo.current.current = index;
        setActiveDrag({ ...dragInfo.current });
      },
      onPanResponderRelease: () => {
        const { start, current } = dragInfo.current;
        if (start !== null && current !== null) {
          // 🔥 propsRef.current를 통해 App.js의 가장 최신 함수를 호출합니다.
          propsRef.current.onDragComplete(Math.min(start, current), Math.max(start, current));
        }
        dragInfo.current = { start: null, current: null };
        setActiveDrag(null);
        setIsScrollEnabled(true);
      },
    })
  ).current;

  const getCellColor = (idx) => {
    if (activeDrag) {
      const min = Math.min(activeDrag.start, activeDrag.current);
      const max = Math.max(activeDrag.start, activeDrag.current);
      if (idx >= min && idx <= max) return previewColor;
    }
    // 여기서도 propsRef를 쓰면 더 정확합니다.
    const saved = schedules.find(s => idx >= s.startIdx && idx <= s.endIdx);
    if (saved) return saved.color;
    return 'transparent';
  };

  return (
    <View style={styles.container}>
      <ScrollView scrollEnabled={isScrollEnabled}>
        <View {...panResponder.panHandlers} style={{ pointerEvents: 'auto' }}>
          {Array.from({ length: TOTAL_HOURS }).map((_, hIdx) => (
            <View key={hIdx} style={styles.hourRow} pointerEvents="none">
              <View style={styles.hourLabel}>
                <Text style={styles.hourText}>{(6 + hIdx) % 24}시</Text>
              </View>
              <View style={styles.cellsContainer}>
                {[0, 1, 2, 3, 4, 5].map((mIdx) => (
                  <View 
                    key={hIdx * 6 + mIdx} 
                    style={[styles.cell, { backgroundColor: getCellColor(hIdx * 6 + mIdx) }]} 
                  />
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  hourRow: { flexDirection: 'row', height: ROW_HEIGHT, borderBottomWidth: 0.5, borderColor: '#eee' },
  hourLabel: { width: LABEL_WIDTH, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderColor: '#ddd' },
  hourText: { fontSize: 11, color: '#666' },
  cellsContainer: { flexDirection: 'row', flex: 1 },
  cell: { flex: 1, height: '100%', borderRightWidth: 0.5, borderColor: '#eee' },
});