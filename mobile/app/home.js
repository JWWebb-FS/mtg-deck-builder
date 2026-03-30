import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, FlatList, 
  Alert, ActivityIndicator, Image, RefreshControl 
} from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  
  const API_URL = 'https://mtg-deck-builder-o20y.onrender.com/api/cards';

  const fetchCards = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        router.replace('/'); 
        return;
      }
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCards(response.data);
    } catch (_error) {
      console.log("Fetch Error");
      Alert.alert('Error', 'Could not fetch your vault.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCards();
  }, [fetchCards]);

  // NEW: Calculate total value from the card array
  const totalValue = cards.reduce((sum, card) => {
    const price = parseFloat(card.price) || 0;
    return sum + price;
  }, 0).toFixed(2);

  const handleDelete = async (id, name) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCards(prev => prev.filter(card => card._id !== id));
      Alert.alert('Deleted', `${name} removed from vault.`);
    } catch (_error) {
      Alert.alert('Error', 'Failed to delete card.');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    router.replace('/');
  };

  const renderRightActions = (id, name) => (
    <TouchableOpacity style={styles.deleteAction} onPress={() => handleDelete(id, name)}>
      <Text style={styles.actionText}>Delete</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Waking up the Vault...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>MTG Vault</Text>
            {/* NEW: Total Value Display */}
            <Text style={styles.vaultValue}>Total Value: ${totalValue}</Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={() => router.push('/add-card')} style={styles.addButton}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={cards}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
          }
          renderItem={({ item }) => (
            <Swipeable renderRightActions={() => renderRightActions(item._id, item.name)}>
              <TouchableOpacity onPress={() => router.push(`/card-details/${item._id}`)}>
                <View style={styles.cardItem}>
                  {item.imageUrl && (
                    <Image source={{ uri: item.imageUrl }} style={styles.cardImage} resizeMode="contain" />
                  )}
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardName}>{item.name}</Text>
                    <Text style={styles.cardType}>{item.type}</Text>
                    <Text style={styles.cardPrice}>${item.price || '0.00'}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Swipeable>
          )}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1a1a1a', paddingTop: 50 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a1a' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#aaa' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  headerButtons: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  // NEW Style for Value Badge
  vaultValue: { color: '#28a745', fontSize: 14, fontWeight: 'bold', marginTop: 4 },
  addButton: { backgroundColor: '#28a745', width: 35, height: 35, borderRadius: 17.5, justifyContent: 'center', alignItems: 'center' },
  addButtonText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  logoutButton: { backgroundColor: '#ff4d4d', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  logoutText: { color: '#fff', fontWeight: 'bold' },
  cardItem: { backgroundColor: '#2a2a2a', padding: 12, borderRadius: 12, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  cardImage: { width: 50, height: 70, borderRadius: 4, marginRight: 12 },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  cardType: { fontSize: 12, color: '#aaa' },
  cardPrice: { fontSize: 14, color: '#3a86ff', fontWeight: 'bold', marginTop: 4 },
  deleteAction: { backgroundColor: '#ff006e', justifyContent: 'center', alignItems: 'center', width: 80, height: '87%', borderRadius: 12, marginBottom: 10 },
  actionText: { color: '#fff', fontWeight: 'bold' },
});