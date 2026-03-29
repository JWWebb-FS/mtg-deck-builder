import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  FlatList, Image, Alert, ActivityIndicator, KeyboardAvoidingView, Platform 
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function AddCardScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const API_URL = 'https://mtg-deck-builder-o20y.onrender.com/api/cards';

  const searchScryfall = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await axios.get(`https://api.scryfall.com/cards/search?q=${query}&order=edhrec`);
      setResults(res.data.data.slice(0, 15));
    } catch (_err) { // Updated to satisfy linter
      Alert.alert('No cards found', 'Try a different name.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPrintings = async (oracleId) => {
    setLoading(true);
    try {
      const res = await axios.get(`https://api.scryfall.com/cards/search?q=oracle_id:${oracleId}&unique=prints`);
      setResults(res.data.data);
    } catch (_err) { // Updated to satisfy linter
      Alert.alert('Error', 'Could not find other sets.');
    } finally {
      setLoading(false);
    }
  };

  const addCard = async (card) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const selectedImage = card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal || "";

      await axios.post(API_URL, {
        name: card.name,
        type: card.type_line,
        manaValue: card.cmc,
        price: card.prices.usd || "0.00",
        imageUrl: selectedImage,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert('Success', `${card.name} added!`);
      router.back();
    } catch (_err) { // Fixed: Renamed to _err to clear the warning
      Alert.alert('Error', 'Could not save card to database.');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backLink}>← Back to Vault</Text>
      </TouchableOpacity>
      
      <Text style={styles.title}>Add New Card</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search for cards..."
          placeholderTextColor="#888"
          value={query}
          onChangeText={setQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={searchScryfall}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.resultItem}>
              <TouchableOpacity style={styles.cardInfoRow} onPress={() => addCard(item)}>
                <Image 
                  source={{ uri: item.image_uris?.small || item.card_faces?.[0]?.image_uris?.small }} 
                  style={styles.resultImage} 
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.resultName}>{item.name}</Text>
                  <Text style={styles.resultSet}>{item.set_name}</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => fetchAllPrintings(item.oracle_id)} 
                style={styles.setButton}
              >
                <Text style={styles.setButtonText}>Change Set / View All Printings</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1a1a1a', paddingTop: 60 },
  backLink: { color: '#007bff', marginBottom: 15, fontSize: 16 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  searchContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  input: { flex: 1, backgroundColor: '#2a2a2a', color: '#fff', padding: 12, borderRadius: 8 },
  searchButton: { backgroundColor: '#3a86ff', padding: 12, borderRadius: 8, justifyContent: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  resultItem: { backgroundColor: '#2a2a2a', padding: 12, borderRadius: 8, marginBottom: 10 },
  cardInfoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  resultImage: { width: 40, height: 55, borderRadius: 4, marginRight: 15 },
  resultName: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  resultSet: { color: '#888', fontSize: 12 },
  setButton: { backgroundColor: '#444', padding: 6, borderRadius: 4, alignSelf: 'flex-start' },
  setButtonText: { color: '#bbb', fontSize: 11 }
});