import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Button, Text, TextInput, Alert } from 'react-native';
import Question from '../components/Question';

const CustomFormBuilder = ({ route }) => {
    const [formName, setFormName] = useState("Untitled Form"); // Default title
    const [formDescription, setFormDescription] = useState(""); // State for form description
    const [questions, setQuestions] = useState([]); // Initialize with no questions
    const formId = route.params.formId; // Get form ID from route params

    // Function to add a new Question
    const addQuestion = () => {
        setQuestions([...questions, { id: questions.length, data: {} }]); // Add a new question based on the current length
    };

    function sendData(document) {
        const url = 'https://projects-api-three.vercel.app/DBMS/data'; // Endpoint URL

        const data = {
            db_name: "Forms",
            collection_name: "FormData",
            document: document
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => console.log('Success:', data))
        .catch(error => console.error('Error:', error));
    }

    // Function to delete a specific question
    const deleteQuestion = (index) => {
        const updatedQuestions = questions.filter((_, i) => i !== index); // Remove the selected question
        setQuestions(updatedQuestions);
    };

    // Function to save form data
    const saveForm = () => {
        // Check if formName is empty and set default title
        const finalFormName = formName.trim() === "" ? "Untitled Form" : formName;

        const formData = {
            id: formId,
            formName: finalFormName,
            formDescription,
            questions: questions.map((question) => ({
                ...question.data // Assuming data is stored in each question object
            })),
        };

        console.log(formData);

        Alert.alert("Form Data", JSON.stringify(formData, null, 2), [
            { text: "OK", onPress: () => sendData(formData) } // Send data after alert is acknowledged
        ]);
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={questions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.questionContainer}>
                        <Question 
                            onDelete={() => deleteQuestion(index)} 
                            onUpdate={(data) => {
                                const updatedQuestions = [...questions];
                                updatedQuestions[index] = { ...updatedQuestions[index], data }; // Store question data
                                setQuestions(updatedQuestions);
                            }}
                        />
                    </View>
                )}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <TextInput
                            style={styles.titleInput}
                            value={formName}
                            onChangeText={setFormName}
                            placeholder="Untitled Form"
                            placeholderTextColor="#888"
                        />
                        <TextInput
                            style={styles.descriptionInput}
                            value={formDescription}
                            onChangeText={setFormDescription}
                            placeholder="Form description"
                            placeholderTextColor="#888"
                            multiline
                        />
                    </View>
                }
                ListFooterComponent={
                    <View style={styles.footer}>
                        <Button title="Add Question" onPress={addQuestion} color="#6200ee" />
                        <View style={styles.buttonSpacer} />
                        <Button title="Save Form" onPress={saveForm} color="#6200ee" />
                    </View>
                }
                contentContainerStyle={styles.container}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 5,
        backgroundColor: '#f5f5f5',
    },
    
    header: {
        padding: 20,
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        position: 'relative', 
        marginBottom: 20,
    },

    titleInput: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 5,
    },
    
    buttonSpacer: {
        height: 15, 
    },
    
    descriptionInput: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 5,
    },
    
    questionContainer: {
        marginBottom: 20,
    },
    
    footer: {
        marginTop: 20,
    },
});

export default CustomFormBuilder;
