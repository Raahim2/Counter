import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface CreateCounterModalProps {
    showCreateModal: boolean;
    newCounterName: string;
    setNewCounterName: (name: string) => void;
    handleCreateCounter: () => void;
    setShowCreateModal: (visible: boolean) => void;
    bgColor: string;
    textColor: string;
}

const CreateCounterModal: React.FC<CreateCounterModalProps> = ({
    showCreateModal,
    newCounterName,
    setNewCounterName,
    handleCreateCounter,
    setShowCreateModal,
    bgColor,
    textColor
}) => {
    return (
        <Modal visible={showCreateModal} animationType="fade" transparent>
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: bgColor, borderColor: textColor, borderWidth: 1 }]}>
                    <Text style={[styles.modalTitle, { color: textColor }]}>Create Counter</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: bgColor, borderColor: textColor, color: textColor }]}
                        placeholder="Counter Name"
                        placeholderTextColor={textColor + '88'}
                        value={newCounterName}
                        onChangeText={setNewCounterName}
                    />
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={[styles.createButton, { backgroundColor: textColor }]} onPress={handleCreateCounter}>
                            <Text style={[styles.buttonText, { color: bgColor }]}>Create</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.cancelButton, { backgroundColor: '#888' }]} onPress={() => setShowCreateModal(false)}>
                            <Text style={styles.buttonText}>Cancel</Text>
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
        width: '85%',
        padding: 25,
        borderRadius: 15,
        elevation: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 12,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 25,
        fontSize: 14,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 10,
    },
    createButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        marginRight: 5,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#888',
        paddingVertical: 12,
        borderRadius: 8,
        marginLeft: 5,
    },
    buttonText: {
        textAlign: 'center',
        fontWeight: '600',
    },
});

export default CreateCounterModal;
