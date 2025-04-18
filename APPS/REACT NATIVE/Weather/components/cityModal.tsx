import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Modal, FlatList } from 'react-native';

interface CityModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (city: string) => void;
  isDark: boolean;
  api:string;
}

const CityModal: React.FC<CityModalProps> = ({ visible, onClose, onSave, isDark  , api}) => {
  const [searchText, setSearchText] = useState('');
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch city suggestions from OpenWeather API
  const fetchCitySuggestions = async (query: string) => {
    if (query.trim() === '') {
      setCitySuggestions([]); // Clear suggestions if the input is empty
      setErrorMessage('');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/find?q=${query}&type=like&sort=population&cnt=5&appid=${api}`
      );
      const data = await response.json();
      


    

      if (data.list && Array.isArray(data.list) && data.list.length > 0) {
        const cities = data.list.map((city: { name: string }) => city.name);
        setCitySuggestions(cities);
        setErrorMessage('');
      } else {
        setCitySuggestions([]);
        setErrorMessage('No cities found matching your query.');
      }
    } catch (error) {
      console.error('Error fetching city suggestions:', error);
      setCitySuggestions([]);
      setErrorMessage('Failed to fetch city suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchText.length > 1) {
      fetchCitySuggestions(searchText); // Trigger search after typing 3+ characters
    } else {
      setCitySuggestions([]); // Clear suggestions if input is too short
      setErrorMessage('');
    }
  }, [searchText]);

  const handleSave = (city: string) => {
    onSave(city); // Save the selected city
    setSearchText(''); // Clear the search text after saving
    setCitySuggestions([]); // Clear suggestions
    setErrorMessage(''); // Clear any error message
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: isDark ? '#333' : '#fff' }]}>
          <TextInput
            style={[styles.searchInput, { color: isDark ? '#fff' : '#000' }]}
            placeholder="Search for a city"
            placeholderTextColor={isDark ? '#aaa' : '#666'}
            value={searchText}
            onChangeText={setSearchText}
          />

          {loading && <Text style={styles.loadingText}>Loading...</Text>}

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : (
            <FlatList
              data={citySuggestions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.cityItem} onPress={() => handleSave(item)}>
                  <Text style={[styles.cityText, { color: isDark ? '#fff' : '#000' }]}>{item}</Text>
                </TouchableOpacity>
              )}
              style={styles.suggestionsList}
            />
          )}

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  searchInput: {
    width: '100%',
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  suggestionsList: {
    width: '100%',
    maxHeight: 200,
  },
  cityItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '100%',
  },
  cityText: {
    fontSize: 18,
  },
  loadingText: {
    color: '#888',
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
  },
  cancelButton: {
    width: '100%',
    paddingVertical: 10,
    backgroundColor: '#F44336',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CityModal;
