import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TextInput, View, Button, FlatList, TouchableOpacity, Switch } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from '@expo/vector-icons'; // Import Material Icons

const Question = ({ onDelete, onUpdate }) => {
  const [questionType, setQuestionType] = useState("MCQ"); // State for question type
  const [question, setQuestion] = useState(""); // State for the question text
  const [options, setOptions] = useState([]); // State for the list of options
  const [isRequired, setIsRequired] = useState(false); // State for required toggle

  // Add a new empty option
  const addOption = () => {
    setOptions([...options, ""]); // Add an empty string as a new option
  };

  // Update the text of an option
  const updateOption = (text, index) => {
    const updatedOptions = [...options];
    updatedOptions[index] = text; // Update the specific option
    setOptions(updatedOptions);
  };

  // Delete an option
  const deleteOption = (index) => {
    const updatedOptions = options.filter((_, i) => i !== index); // Remove the selected option
    setOptions(updatedOptions);
  };

  // Call onUpdate with the question data whenever it changes
  useEffect(() => {
    onUpdate({
      questionType,
      question,
      options: (questionType === "MCQ" || questionType === "CheckBoxes") ? options : [],
      isRequired,
    });
  }, [questionType, question, options, isRequired]);

  return (
    <View style={styles.container}>
      {/* Dropdown for selecting question type */}
      <View style={styles.picker}>
        <Picker
          selectedValue={questionType}
          onValueChange={(value) => {
            setQuestionType(value);
            if (value !== "MCQ" && value !== "CheckBoxes") {
              setOptions([]); // Clear options if not MCQ or Checkboxes
            }
          }}
        >
          <Picker.Item label="MCQ" value="MCQ" />
          <Picker.Item label="Paragraph" value="Paragraph" />
          <Picker.Item label="File Upload" value="FileUpload" />
          <Picker.Item label="CheckBoxes" value="CheckBoxes" />
          <Picker.Item label="Rating" value="Rating" />
        </Picker>
      </View>

      {/* Editable Question Input */}
      <Text style={styles.label}>Write your question:</Text>
      <TextInput
        style={styles.input}
        value={question}
        onChangeText={(text) => setQuestion(text)}
        placeholder="Enter your question here"
        placeholderTextColor="#888"
      />

      {/* Render based on question type */}
      {(questionType === "MCQ" || questionType === "CheckBoxes") && (
        <>
          {/* Options Section */}
          <Text style={styles.label}>Options:</Text>
          {options.map((item, index) => (
            <View key={index} style={styles.optionRow}>
              <TextInput
                style={[styles.input, styles.optionInput]}
                value={item}
                onChangeText={(text) => updateOption(text, index)}
                placeholder={`Option ${index + 1}`}
                placeholderTextColor="#888"
              />
              {/* Delete Button for Option */}
              <TouchableOpacity onPress={() => deleteOption(index)} style={styles.deleteButton}>
                <MaterialIcons name="close" size={24} color="#5f6368" />
              </TouchableOpacity>
            </View>
          ))}
          {/* Add Option Button */}
          <Button title="Add Option" onPress={addOption} color="#6200ee" />
        </>
      )}

      {questionType === "Rating" && (
        <>
          {/* Rating Section */}
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <MaterialIcons key={star} name="star" size={60} color="#ffb400" /> // Static stars for demo purposes
            ))}
          </View>
        </>
      )}

      {questionType === "FileUpload" && (
        <>
          {/* File Upload Section */}
          <Text style={styles.label}>Upload File:</Text>
          {/* Placeholder for file upload functionality */}
          <Button title="Choose File" onPress={() => alert("User Will Be Able to Upload File Here")} color="#6200ee" />
        </>
      )}

      {questionType === "Paragraph" && (
        <>
          {/* Paragraph Input */}
          <TextInput
            style={[styles.input]}
            placeholder="Enter your paragraph answer here"
            placeholderTextColor="#888"
            multiline
            editable={false}
          />
        </>
      )}

      {/* Required Toggle and Delete Button */}
      <View style={styles.footerContainer}>
        <View style={styles.requiredContainer}>
          <Text style={styles.requiredLabel}>Required:</Text>
          <Switch
            value={isRequired}
            onValueChange={() => setIsRequired(!isRequired)}
            thumbColor={isRequired ? "#fff" : "#f4f3f4"}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
          />
        </View>
        {/* Delete Question Button */}
        <TouchableOpacity onPress={onDelete} style={styles.deleteQuestionButton}>
          <MaterialIcons name="delete" size={24} color="#5f6368" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
    position: 'relative',
  },
  picker: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
    height: 50,
    width: "100%",
    marginBottom: 10,
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    color: "#333",
    flexGrow: 1,
  },
  requiredContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  requiredLabel: {
    fontSize: 16,
    color: "#333",
    marginRight: 10,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  deleteButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
   },
   footerContainer:{
     flexDirection:'row',
     justifyContent:'space-between',
     alignItems:'center',
     marginTop :15
    
   },
   deleteQuestionButton:{
     paddingVertical :10,
     paddingHorizontal :15,
     borderRadius :5
    
   },
   ratingContainer:{
     flexDirection:'row', 
     justifyContent:'flex-start',
     alignItems:'center',
     marginTop :10 ,
   }
});

export default Question;
