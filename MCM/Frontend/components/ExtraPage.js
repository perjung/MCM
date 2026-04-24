import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Modal } from 'react-native';
import Timetable from './Timetable';

export default function ExtraPage({ schedules, results, onBack }) {
  const [benefitModalVisible, setBenefitModalVisible] = useState(false);
  const [currentBenefit, setCurrentBenefit] = useState("");

  const openBenefit = (timeStr) => {
    const data = results[timeStr];
    if (data) {
      setCurrentBenefit(data.benefit);
      setBenefitModalVisible(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}> 엑스트라 플랜 </Text></View>

      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Text style={styles.sectionTitle}> 엑스트라 플랜 </Text>
          <ScrollView>
            { /*ExtraPage.js 내부 렌더링 부분 예시*/}
            {[...schedules].sort((a, b) => a.startIdx - b.startIdx).map((s) => {
              const res = results[s.timeStr]; // App.js에서 넘겨준 결과
              return (
                <View key={s.id} style={styles.planCard}>
                  <Text style={styles.timeText}>{s.timeStr}</Text>
                  <Text style={styles.myAction}>내 행동: {s.action}</Text>
                  
                  {res && (
                    <View style={styles.extraInfo}>
                      {/* 백엔드 필드명: name, action (프론트에선 extraAction으로 받음) */}
                      <Text style={styles.extraText}>👤 {res.name}: {res.extraAction}</Text>
                      
                      <TouchableOpacity 
                        style={styles.benefitBtn} 
                        onPress={() => openBenefit(s.timeStr)} // 팝업으로 res.benefit 보여줌
                      >
                        <Text style={styles.benefitBtnText}>이점 보기 ✨</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.rightSection}>
          <Timetable schedules={schedules} onDragComplete={() => {}} previewColor="transparent" />
        </View>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>수정하러 돌아가기</Text>
      </TouchableOpacity>

      {/* 🚀 주연의 이점 팝업 (Modal) */}
      <Modal visible={benefitModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.benefitModal}>
            <Text style={styles.benefitTitle}> 효과 </Text>
            <Text style={styles.benefitContent}>{currentBenefit}</Text>
            <TouchableOpacity 
              style={styles.closeBtn} 
              onPress={() => setBenefitModalVisible(false)}
            >
              <Text style={styles.closeBtnText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  header: { padding: 15, backgroundColor: '#000' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFD700', textAlign: 'center' },
  content: { flex: 1, flexDirection: 'row' },
  leftSection: { flex: 1, padding: 10, borderRightWidth: 1, borderColor: '#333' },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', marginBottom: 15, color: '#FFD700' },
  planCard: { marginBottom: 15, padding: 12, backgroundColor: '#2a2a2a', borderRadius: 10 },
  timeText: { fontSize: 10, color: '#FFD700', marginBottom: 4 },
  myAction: { fontSize: 13, color: '#fff', fontWeight: 'bold', marginBottom: 8 },
  extraInfo: { borderTopWidth: 0.5, borderColor: '#444', paddingTop: 8 },
  extraText: { fontSize: 11, color: '#bbb', marginBottom: 10 },
  benefitBtn: { alignSelf: 'flex-end', backgroundColor: '#FFD700', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5 },
  benefitBtnText: { fontSize: 10, fontWeight: 'bold', color: '#000' },
  rightSection: { flex: 1 },
  backButton: { backgroundColor: '#333', padding: 15, margin: 15, borderRadius: 10, alignItems: 'center' },
  backButtonText: { color: '#fff', fontWeight: 'bold' },
  
  // 이점 팝업 스타일
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  benefitModal: { width: '80%', backgroundColor: '#fff', padding: 25, borderRadius: 20, alignItems: 'center' },
  benefitTitle: { fontSize: 18, fontWeight: 'bold', color: '#4CAF50', marginBottom: 15 },
  benefitContent: { fontSize: 15, color: '#333', textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  closeBtn: { backgroundColor: '#1a1a1a', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 10 },
  closeBtnText: { color: '#fff', fontWeight: 'bold' }
});