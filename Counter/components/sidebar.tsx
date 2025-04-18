import React from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SidebarProps {
    showSidebar: boolean;
    setShowSidebar: (show: boolean) => void;
    counters: { id: string; counterName: string; count: number; lapLimit: number }[];
    setShowCreateModal: (show: boolean) => void;
    handleSelectCounter: (counter: { id: string; counterName: string; count: number; lapLimit: number }) => void;
    bgColor: string;
    textColor: string;
}

const Sidebar: React.FC<SidebarProps> = ({
    showSidebar,
    setShowSidebar,
    counters,
    setShowCreateModal,
    handleSelectCounter,
    bgColor,
    textColor,
}) => {
    return (
        <Modal visible={showSidebar} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={[
                    styles.sidebar,
                    { 
                        backgroundColor: bgColor,
                        borderColor: textColor,  // Add border color
                        borderWidth: 1           // Make border visible
                    }
                ]}>
                    <View style={styles.header}>
                        <Text style={[styles.sidebarTitle, { color: textColor }]}>Your Counters</Text>
                        <TouchableOpacity
                            onPress={() => setShowSidebar(false)}
                            style={[
                                styles.closeButton,
                                { backgroundColor: bgColor, borderColor: textColor, borderWidth: 1 }
                            ]}
                        >
                            <Ionicons name="close" size={28} color={textColor} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.createButton, { backgroundColor: textColor }]}
                        onPress={() => {
                            setShowSidebar(false);
                            setShowCreateModal(true);
                        }}
                    >
                        <Text style={[styles.createButtonText, { color: bgColor }]}>+ Create Counter</Text>
                    </TouchableOpacity>

                    <FlatList
                        data={counters}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.counterItem,
                                    { backgroundColor: bgColor, borderColor: textColor, borderWidth: 1 }
                                ]}
                                onPress={() => {
                                    handleSelectCounter(item);
                                    setShowSidebar(false);
                                }}
                            >
                                <View style={styles.counterItemRow}>
                                    <Text style={[styles.counterItemText, { color: textColor }]}>{item.counterName}</Text>
                                    <Text style={[styles.counterItemCount, { color: textColor }]}>{item.count}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'flex-end',
    },
    sidebar: {
        height: '85%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingTop: 20,
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: -3 },
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    sidebarTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    closeButton: {
        borderRadius: 20,
        padding: 6,
    },
    createButton: {
        paddingVertical: 12,
        borderRadius: 10,
        marginBottom: 25,
    },
    createButtonText: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '600',
    },
    counterItem: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginBottom: 12,
    },
    counterItemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    counterItemText: {
        fontSize: 16,
        fontWeight: '500',
    },
    counterItemCount: {
        fontSize: 16,
        fontWeight: '600',
    },
});

export default Sidebar;
