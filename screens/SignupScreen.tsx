import React, {useState} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import axios from 'axios';

const SignupScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      const response = await axios.post('https://yourserver.com/api/signup', {
        email,
        password,
      });
      // Handle signup success
    } catch (error) {
      console.error('Signup failed', error);
    }
  };

  return (
    <View>
      <Text>Signup</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Signup" onPress={handleSignup} />
    </View>
  );
};

export default SignupScreen;
