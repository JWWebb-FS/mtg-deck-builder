import React, { useState, useEffect } from 'react';
import { 
  View, Text, Image, StyleSheet, ScrollView, 
  TouchableOpacity, ActivityIndicator, Alert 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CardDetailsScreen() {
  const { id } = useLocalSearchParams(); 
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 1. Keep this as the BASE cards path
  const API_URL = 'https://mtg-deck-builder-o20y.onrender.com/api/cards';

  useEffect(() => {
    const fetchCardDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        
        // 2. DEBUG: This will show you the exact URL in your VSCodium terminal
        console.log("Fetching from:", `${API_URL}/${id}`);

        // 3. Ensure there is a SLASH between the URL and the ID
        const response = await axios.get(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setCard(response.data);
      } catch (_err) {
        console.log("Details Error:", _err.response?.data || _err.message);
        Alert.alert('Error', 'Could not load card details. Check if Render is finished deploying.');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCardDetails();
  }, [id, router]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!card) return null;

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Back to Vault</Text>
      </TouchableOpacity>

      <View style={styles.cardWrapper}>
        <Image 
          source={{ uri: card.imageUrl }} 
          style={styles.fullCardImage} 
          resizeMode="contain" 
        />
        
        <View style={styles.detailsBox}>
          <Text style={styles.cardName}>{card.name}</Text>
          <Text style={styles.cardType}>{card.type}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Mana Value</Text>
              <Text style={styles.statValue}>{card.manaValue}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Current Price</Text>
              <Text style={styles.statValue}>${card.price || '0.00'}</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a', padding: 20, paddingTop: 60 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a1a' },
  backButton: { marginBottom: 20 },
  backText: { color: '#007bff', fontSize: 16, fontWeight: 'bold' },
  cardWrapper: { alignItems: 'center', paddingBottom: 40 },
  fullCardImage: { width: '100%', height: 450, borderRadius: 15 },
  detailsBox: { 
    width: '100%', 
    backgroundColor: '#2a2a2a', 
    padding: 20, 
    borderRadius: 15, 
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#444'
  },
  cardName: { color: '#fff', fontSize: 26, fontWeight: 'bold' },
  cardType: { color: '#aaa', fontSize: 16, marginTop: 5, fontStyle: 'italic' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 },
  statItem: { alignItems: 'center' },
  statLabel: { color: '#888', fontSize: 12, textTransform: 'uppercase', marginBottom: 5 },
  statValue: { color: '#3a86ff', fontSize: 20, fontWeight: 'bold' },
});