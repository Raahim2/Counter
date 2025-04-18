import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const Login = ({ navigation }) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [isLoginMode, setIsLoginMode] = React.useState(true); // State to toggle between login and signup

    const checkEmailExists = (email) => {
        const url = 'https://projects-api-three.vercel.app/DBMS/fetch'; // Endpoint URL
    
        const params = new URLSearchParams({
            db_name: "Forms",
            collection_name: "Users",
            filter_condition: JSON.stringify({ email: email }) // Filter by email
        });
    
        return fetch(`${url}?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
    };

    function sendData(document) {
        const url = 'https://projects-api-three.vercel.app/DBMS/data'; // Endpoint URL

        const data = {
            db_name: "Forms",
            collection_name: "Users",
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

    const handleSignup = () => {
        checkEmailExists(email)
            .then(data => {
                if (data.length > 0) {
                    // Email already exists
                    Alert.alert("Error", "This email is already registered. Please use a different email.");
                } else {
                    // Create a new user document
                    const userDocument = {
                        email: email,
                        password: password,
                        createdAt: new Date().toISOString()
                    };
                    sendData(userDocument);
                    Alert.alert("Signup", "Signed up successfully!");
                }
            })
            .catch(() => {
                Alert.alert("Error", "Something went wrong. Please try again.");
            });
    };

    const handleLogin = () => {
        const url = 'https://projects-api-three.vercel.app/DBMS/fetch'; // Endpoint URL
    
        const params = new URLSearchParams({
            db_name: "Forms",
            collection_name: "Users",
            filter_condition: JSON.stringify({ email: email }) // Filter by email
        });
    
        fetch(`${url}?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    Alert.alert("Error", "User not found. Please check your email.");
                } else {
                    Alert.alert("Error", "Something went wrong. Please try again.");
                }
                return; // Exit the function early
            }
            return response.json();
        })
        .then(data => {
            if (data.length > 0 && data[0].password === password) {
                Alert.alert("Login", "Logged in successfully!");
                navigation.navigate("Home");
            } else {
                Alert.alert("Error", "Invalid email or password. Please try again.");
            }
        })
        .catch(() => {
            Alert.alert("Error", "Something went wrong. Please try again.");
        });
    };

    const toggleMode = () => {
        setIsLoginMode(prevMode => !prevMode);
        setEmail(''); // Clear email input
        setPassword(''); // Clear password input
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isLoginMode ? 'Login to your account' : 'Create an account'}</Text>
            <TextInput
                style={styles.input}
                placeholder="Your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                required
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                required
            />
            
            {isLoginMode && (
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            )}
            {!isLoginMode && (
                <TouchableOpacity style={styles.button} onPress={handleSignup}>
                    <Text style={styles.buttonText}>Sign up</Text>
                </TouchableOpacity>
            )}

            <Text style={styles.footerText}>
                {isLoginMode ? "Don’t have an account yet?" : "Already have an account?"} 
                <Text 
                    style={styles.link} 
                    onPress={toggleMode} // Toggle mode and clear inputs
                >
                    {isLoginMode ? ' Sign up' : ' Login'}
                </Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F9FAFB', // Light gray background
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#D1D5DB', // Gray border color
        borderRadius: 5,
        backgroundColor: '#FFFFFF', // White background for input
    },
    
    button: {
        backgroundColor: '#6200ee', // Purple color for button
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF', // White text color for button
        fontSize: 16,
    },
    footerText: {
        marginTop: 20,
        fontSize: 14,
    },
    link: {
        color: '#6200ee', // Blue color for link text
    },
});

export default Login;
