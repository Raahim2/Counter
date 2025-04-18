import React from 'react';
import { View, StyleSheet, Modal, Text, TextInput, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';

interface EditCounterProps {
  showEditModal: boolean;
  editedCounter: any;
  setEditedCounter: any;
  handleInputChange: any;
  handleSaveCounter: any;
  setShowEditModal: any;
  handleDeleteCounter: any;
  bgColor: string;
  textColor: string;
}

const EditCounter: React.FC<EditCounterProps> = ({
  showEditModal,
  editedCounter,
  setEditedCounter,
  handleInputChange,
  handleSaveCounter,
  setShowEditModal,
  handleDeleteCounter,
  bgColor,
  textColor
}) => {
  return (
    <Modal visible={showEditModal} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: bgColor, borderColor: textColor, borderWidth: 1 }]}>
          <Text style={[styles.modalTitle, { color: textColor }]}>Edit Counter</Text>

          {editedCounter ? (
            <>
              <Text style={[styles.label, { color: textColor }]}>Counter Name</Text>
              <TextInput
                style={[styles.input, { color: textColor, backgroundColor: bgColor, borderColor: textColor }]}
                placeholder="Counter Name"
                value={editedCounter.counterName}
                onChangeText={(text) => setEditedCounter({ ...editedCounter, counterName: text })}
                placeholderTextColor={textColor + '88'} // slightly transparent
              />
              <Text style={[styles.label, { color: textColor }]}>Lap Limit</Text>
              <TextInput
                style={[styles.input, { color: textColor, backgroundColor: bgColor, borderColor: textColor }]}
                placeholder="Lap Limit"
                value={editedCounter.lapLimit.toString()}
                keyboardType="numeric"
                onChangeText={(text) => handleInputChange('lapLimit', Math.min(Number(text), 100000).toString())}
                placeholderTextColor={textColor + '88'}
              />
              <Text style={[styles.label, { color: textColor }]}>Current Value</Text>
              <TextInput
                style={[styles.input, { color: textColor, backgroundColor: bgColor, borderColor: textColor }]}
                placeholder="Current Value"
                value={editedCounter.count.toString()}
                keyboardType="numeric"
                onChangeText={(text) => handleInputChange('count', Math.min(Number(text), 100000).toString())}
                placeholderTextColor={textColor + '88'}
              />
              <Text style={[styles.label, { color: textColor }]}>Multiplier: {editedCounter.multiplier}</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={10}
                step={1}
                value={editedCounter.multiplier}
                onValueChange={(value) => handleInputChange('multiplier', value.toString())}
                minimumTrackTintColor={textColor}
                thumbTintColor={textColor}
              />
            </>
          ) : null}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.saveButton, { backgroundColor: textColor }]} onPress={handleSaveCounter}>
              <Text style={[styles.buttonText, { color: bgColor }]}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.cancelButton, { backgroundColor: '#888' }]} onPress={() => setShowEditModal(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.deleteButton]} onPress={handleDeleteCounter}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
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
  modalContent: {
    width: '90%',
    padding: 25,
    borderRadius: 15,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 14,
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 25,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 5,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#f44336',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 5,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
  },
});

export default EditCounter;
