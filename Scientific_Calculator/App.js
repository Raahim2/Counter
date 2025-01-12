import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TouchableOpacity } from 'react-native'; // Import ImageBackground
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for theme toggle icon
import Button from './component/Button'; // Import the Button component
import Screen from './component/screen'; // Import the Screen component
import SmallButton from './component/smallBtn'; // Import the SmallButton component
import ArrowGrid from './component/ArrowGrid'; // Import the ArrowGrid component

export default function App() {
  const [input, setInput] = useState(''); // To store the current input
  const [output, setOutput] = useState(''); // To store the result/output
  const [isDarkTheme, setIsDarkTheme] = useState(true); // Manage theme state

  // Function to handle button press
  const handlePress = (value) => {
    let updatedInput = input;
  
    if (value === '=') {
      try {
        // Replace '×' with '*' and '÷' with '/'
        updatedInput = updatedInput.replace(/×/g, '*').replace(/÷/g, '/');

  
        // Replace 'π' with Math.PI
        updatedInput = updatedInput.replace(/π/g, Math.PI);
  
        // Replace 'e' with Math.E
        updatedInput = updatedInput.replace(/e/g, Math.E);
  
        // Handle trigonometric functions (sin, cos, tan)
        updatedInput = updatedInput.replace(/sin\(([^)]+)\)/g, (match, p1) => {
          const angleInRadians = p1 * (Math.PI / 180);
          return `Math.sin(${angleInRadians})`;
        });
        updatedInput = updatedInput.replace(/cos\(([^)]+)\)/g, (match, p1) => {
          const angleInRadians = p1 * (Math.PI / 180);
          return `Math.cos(${angleInRadians})`;
        });
        updatedInput = updatedInput.replace(/tan\(([^)]+)\)/g, (match, p1) => {
          const angleInRadians = p1 * (Math.PI / 180);
          return `Math.tan(${angleInRadians})`;
        });
  
        // Handle inverse trigonometric functions (sin⁻¹, cos⁻¹, tan⁻¹)
        updatedInput = updatedInput.replace(/sin⁻¹\(([^)]+)\)/g, (match, p1) => `(Math.asin(${p1}) * (180 / Math.PI))`);
        updatedInput = updatedInput.replace(/cos⁻¹\(([^)]+)\)/g, (match, p1) => `(Math.acos(${p1}) * (180 / Math.PI))`);
        updatedInput = updatedInput.replace(/tan⁻¹\(([^)]+)\)/g, (match, p1) => `(Math.atan(${p1}) * (180 / Math.PI))`);
  
        // Replace 'log' with Math.log (natural logarithm)
        updatedInput = updatedInput.replace(/log\(([^)]+)\)/g, (match, p1) => `Math.log(${p1}) / Math.log(10)`);
  
        // Handle percentage (%)
        updatedInput = updatedInput.replace(/%/g, (match) => `/`);
  
        // Handle square root (√)
        updatedInput = updatedInput.replace(/√(\d+)/g, (match, p1) => `Math.pow(${p1}, 0.5)`);

  
        // Handle square (x²)
        updatedInput = updatedInput.replace(/(\d+)²/g, (match, p1) => `Math.pow(${p1}, 2)`);


        console.log(updatedInput)

  
        // Handle reciprocal (1/x)
        updatedInput = updatedInput.replace(/1\/x/g, (match) => `1/${input}`);
  
        // Factorial function (x!) - using a recursive approach
        updatedInput = updatedInput.replace(/(\d+)!/g, (match, p1) => {
          const num = parseInt(p1, 10);
          return factorial(num);
        });
  
        // Evaluate the input expression
        let result = eval(updatedInput);
  
        // Ensure result is rounded to 8 decimal places, without unnecessary trailing zeros
        if (result % 1 === 0) {
          setOutput(result.toString());
        } else {
          setOutput(result.toFixed(8)); // Round to 8 decimal places
        }
      } catch (error) {
        setOutput('Error');
      }
    } else if (value === 'C') {
      setInput(''); // Clear input
      setOutput(''); // Clear output
    } 
    else if (value === 'DEL') {
      // Handle backspace (DEL)
      const lastChar = input.slice(-1);
  
      // Check if last characters are part of a function name (e.g., sin, log, tan, sin⁻¹, etc.)
      if (/sin|cos|tan|log|sin⁻¹|cos⁻¹|tan⁻¹|√|x²|x!|1\/x/.test(input.slice(-4))) {
        // Delete the whole function name when a function name is partially typed
        setInput(input.slice(0, -4));
      } else if (/sin|cos|tan|log|sin⁻¹|cos⁻¹|tan⁻¹|√|x²|x!|1\/x/.test(input.slice(-6))) {
        // Handle the case for inverse functions (like sin⁻¹, cos⁻¹, etc.)
        setInput(input.slice(0, -6));
      } else if (/sin|cos|tan|log/.test(input.slice(-1))) {
        // Handle simple functions like sin, cos, tan
        setInput(input.slice(0, -3));
      } else {
        // Delete the last character if it's not a function name
        setInput(input.slice(0, -1));
      }
    }else if (value === 'AC') {
      setOutput('');
      setInput(''); // Clear the input
    } else if (value === 'π') {
      setInput(input + 'π');
    } else if (value === 'e') {
      setInput(input + 'e');
    } else if (value === 'x!') {
      setInput(input + '!');
    } else if (value === 'x⁻¹') {
      setInput(input + '⁻¹');
    } else if (value === 'x²') {
      setInput(input + '²');
    }else if (value === '1/x') {
      setInput(input + '1÷');
    }  
    else if (/[0-9]/.test(value)) {
      if (input === '' || /[+\-×÷*/)]/.test(input.slice(-1))) {
        setInput(input + value);
      } else {
        setInput(input + value);
      }
    } else if (value === 'ANS') {
      setInput(input+output); // Use the result as input
    } else {
      if (value === '*') {
        setInput(input + '×');
      } else if (value === 'sin' || value === 'cos' || value === 'tan' || value === 'log' || value === 'sin⁻¹' || value === 'cos⁻¹' || value === 'tan⁻¹') {
        setInput(input + value + '('); // Add opening bracket when these functions are pressed
      } else {
        setInput(input + value);
      }
    }
  };
  

    // Define the calculator buttons
    const buttons = [
      ['7', '8', '9', 'DEL', 'AC'],
      ['4', '5', '6', '×', '÷'],
      ['1', '2', '3', '+', '-'],
      ['0', '.', 'π', 'ANS', '='],
    ];
  
    // Define complex scientific symbols
    const scientificButtons = [
      ['%', '√', 'x²', '1/x', 'd/dx', '∫'],
      ['log', 'x!', 'x⁻¹', 'sin⁻¹', 'cos⁻¹', 'tan⁻¹'],
      ['e', '(', ')', 'sin', 'cos', 'tan'],
    ];
  
  
  // Factorial function (recursive)
  const factorial = (n) => {
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
  };


  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };



  // Arrow control functions
  const handleArrowPress = (direction) => {
    // Handle arrow keys here
    console.log('Arrow pressed: ', direction);
    // Implement functionality based on direction (left, right, up, down)
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkTheme ? '#333' : '#fff' }]}>
      {/* Theme Toggle Button */}
      <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
        <Ionicons name={isDarkTheme ? 'sunny' : 'moon'} size={30} color={isDarkTheme ? '' : 'black'} />
      </TouchableOpacity>

      {/* Screen Component for Display */}
      <Screen input={input} output={output} textColor={isDarkTheme ? 'white' : 'black'} bgColor={isDarkTheme ? '#333' : '#fff'} />

      {/* Arrow Grid */}
      <View>
        <ArrowGrid onArrowPress={handleArrowPress} textColor={isDarkTheme ? 'white' : 'black'} bgColor={isDarkTheme ? '#444' : '#ddd'} borderColor={isDarkTheme ? '#888' : '#ccc'} />
      </View>

      {/* Scientific Functions Grid */}
      <View>
        {scientificButtons.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((button, buttonIndex) => (
              <SmallButton
                key={buttonIndex}
                text={button}
                onPress={() => handlePress(button)}
                textColor={isDarkTheme ? 'white' : 'black'}
                bgColor={isDarkTheme ? '#444' : '#ddd'}
                borderColor={isDarkTheme ? '#888' : '#ccc'}
              />
            ))}
          </View>
        ))}
      </View>

      {/* Regular Button Grid */}
      <View>
        {buttons.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((button, buttonIndex) => (
              <Button
                key={buttonIndex}
                text={button}
                onPress={() => handlePress(button)}
                textColor={isDarkTheme ? 'white' : 'black'}
                bgColor={button === 'DEL' || button === 'AC' ? (isDarkTheme ? '#2196f3' : '#2196f3') : (isDarkTheme ? '#444' : '#ddd')}
                borderColor={isDarkTheme ? '#888' : '#ccc'}
              />
            ))}
          </View>
        ))}
      </View>

      <StatusBar style={isDarkTheme ? 'light' : 'dark'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  themeToggle: {
    position: 'absolute',
    top: 30,
    right: 10,
    padding: 10,
    borderRadius: 50,
    zIndex: 1,
  },
});
