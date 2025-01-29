import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import SpeedDialMenu from '../components/SpeedDial'; // Adjust the path if necessary
import AddBtn from '../components/AddBtn';
import CardComponent from '../components/Card'; // Adjust the path if necessary
import Navbar from '../components/NavBar';

export default function Home({ navigation }) {
  const [forms, setForms] = useState([]); // State to hold forms
  const [loading, setLoading] = useState(true); // State to handle loading state

  useEffect(() => {
    const fetchForms = async () => {
      const url = 'https://projects-api-three.vercel.app/DBMS/fetch'; // Endpoint URL
      
      const params = new URLSearchParams({
        db_name: "Forms",
        collection_name: "FormData",
      });

      try {
        const response = await fetch(`${url}?${params.toString()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setForms(data); // Set the fetched forms to state
      } catch (error) {
        console.error('Error fetching forms:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchForms(); // Call the fetch function
  }, []); // Dependency array with email

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView>
        {loading ? (
          <ActivityIndicator size="large" color="#6200ee" style={styles.loader} />
        ) : (
          <View style={styles.grid}>
            {forms.map((form) => (
              <CardComponent key={form.id} navigation={navigation} formId={form.id} />
            ))}
          </View>
        )}
      </ScrollView>
      {/* <SpeedDialMenu /> */}
      <AddBtn />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Light gray background
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Space between cards
    padding: 8, // Optional padding for the grid
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%', // Ensure loader takes full height when loading
  },
});
