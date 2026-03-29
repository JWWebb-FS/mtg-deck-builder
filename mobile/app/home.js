import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const [decks, setDecks] = useState([]);
  const router = useRouter();
  
  // Hitting your decks endpoint
  const API_URL = 'http://192.168.1.153:5000/api/decks';

  // This runs automatically when the screen loads
  useEffect(() => {
    // We moved the function INSIDE the useEffect to keep the linter happy!
    const fetchDecks = async () => {
      try {
        // 1. Grab the secure token we saved during Login/Register
        const token = await AsyncStorage.getItem('userToken');
        
        // If there's no token, kick them back to the login screen
        if (!token) {
          router.replace('/'); 
          return;
        }

        // 2. Make the request to your API, attaching the token as proof of auth
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // 3. Save the database data to our state to display it
        setDecks(response.data);
      } catch (error) {
        console.log(error);
        Alert.alert('Error', 'Could not fetch your decks from the vault.');
      }
    };

    // Now we call it right after defining it
    fetchDecks();
  }, [router]); // Added router to the dependency array just in case React asks for it next!

  const handleLogout = async () => {
    // Delete the token from the phone and route back to login
    await AsyncStorage.removeItem('userToken');
    router.replace('/');
  };

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
              {/* Assuming your Deck model has a 'name' or 'title' property */}
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
    paddingTop: 50, // Gives space for the iOS notch
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