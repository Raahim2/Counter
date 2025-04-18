import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
  weatherData: any;
}

const InfoModal: React.FC<InfoModalProps> = ({ visible, onClose, weatherData }) => {
  if (!weatherData) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Weather Details</Text>
          
          <Text style={styles.modalText}>City: {weatherData.name}</Text>
          <Text style={styles.modalText}>Country: {weatherData.sys.country}</Text> 
          <Text style={styles.modalText}>Temperature: {weatherData.main.temp}°C</Text>
           <Text style={styles.modalText}>Feels Like: {weatherData.main.feels_like}°C</Text>

          {/* Correctly render weather description */}
          <Text style={styles.modalText}>Weather: {weatherData.weather[0]?.description}</Text>

          <Text style={styles.modalText}>Humidity: {weatherData.main.humidity}%</Text>
          <Text style={styles.modalText}>Wind Speed: {weatherData.wind.speed} m/s</Text>
          <Text style={styles.modalText}>Pressure: {weatherData.main.pressure} hPa</Text>
          <Text style={styles.modalText}>Visibility: {weatherData.visibility } km</Text>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default InfoModal;
