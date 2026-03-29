import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state
  const router = useRouter();
  
  // Update this to your live Render URL once it finishes deploying!
  const API_URL = 'http://192.168.1.153:5000/api/decks';

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        setLoading(true); // Start the spinner
        const token = await AsyncStorage.getItem('userToken');
        
        if (!token) {
          router.replace('/'); 
          return;
        }

        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setDecks(response.data);
      } catch (error) {
        console.log(error);
        Alert.alert('Error', 'Could not fetch your decks. Is the server awake?');
      } finally {
        setLoading(false); // Stop the spinner regardless of success or failure
      }
    };

    fetchDecks();
  }, [router]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    router.replace('/');
  };

  // If the app is still fetching data, show the loading circle
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Waking up the Vault...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MTG Vault</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>Your Decks (Protected Data)</Text>

      {decks.length === 0 ? (
        <Text style={styles.emptyText}>No decks found. The vault is empty!</Text>
      ) : (
        <FlatList
          data={decks}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.deckCard}>
              <Text style={styles.deckName}>{item.name || item.title || 'Unnamed Deck'}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 15,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 50,
    fontStyle: 'italic',
  },
  deckCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  deckName: {
    fontSize: 18,
    fontWeight: '600',
  },
});