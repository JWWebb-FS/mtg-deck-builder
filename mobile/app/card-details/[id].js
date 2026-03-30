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
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  const API_URL = 'https://mtg-deck-builder-o20y.onrender.com/api/cards';

  useEffect(() => {
    const fetchCardDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCard(response.data);
      } catch (_err) {
        Alert.alert('Error', 'Could not load card details.');
        router.back();
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCardDetails();
  }, [id, router]);

  // NEW: Refresh Price Logic
  const refreshPrice = async () => {
    setUpdating(true);
    try {
      // 1. Get fresh data from Scryfall
      const scryfallRes = await axios.get(`https://api.scryfall.com/cards/named?fuzzy=${card.name}`);
      const newPrice = scryfallRes.data.prices.usd || "0.00";

      // 2. Update your Render backend
      const token = await AsyncStorage.getItem('userToken');
      await axios.put(`${API_URL}/${id}`, 
        { price: newPrice }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 3. Update local UI
      setCard({ ...card, price: newPrice });
      Alert.alert('Success', `Price updated to $${newPrice}`);
    } catch (_err) {
      Alert.alert('Error', 'Could not update price.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#007bff" /></View>
  );

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Back to Vault</Text>
      </TouchableOpacity>

      <View style={styles.cardWrapper}>
        <Image source={{ uri: card.imageUrl }} style={styles.fullCardImage} resizeMode="contain" />
        
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
              <Text style={styles.statValue}>${card.price}</Text>
            </View>
          </View>

          {/* NEW: Refresh Button */}
          <TouchableOpacity 
            style={[styles.refreshButton, updating && { opacity: 0.6 }]} 
            onPress={refreshPrice}
            disabled={updating}
          >
            <Text style={styles.refreshText}>
              {updating ? 'Updating...' : 'Refresh Live Price'}
            </Text>
          </TouchableOpacity>
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
  detailsBox: { width: '100%', backgroundColor: '#2a2a2a', padding: 20, borderRadius: 15, marginTop: 20, borderWidth: 1, borderColor: '#444' },
  cardName: { color: '#fff', fontSize: 26, fontWeight: 'bold' },
  cardType: { color: '#aaa', fontSize: 16, marginTop: 5, fontStyle: 'italic' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25, marginBottom: 20 },
  statItem: { alignItems: 'center' },
  statLabel: { color: '#888', fontSize: 12, textTransform: 'uppercase', marginBottom: 5 },
  statValue: { color: '#3a86ff', fontSize: 20, fontWeight: 'bold' },
  refreshButton: { backgroundColor: '#3a86ff', padding: 15, borderRadius: 10, alignItems: 'center' },
  refreshText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});