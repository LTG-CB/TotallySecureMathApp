import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TRootStackParamList } from './App';
import { supabase } from './supabaseClient';
import EncryptedStorage from 'react-native-encrypted-storage';

export type IUser = {
    username: string;
    password: string;
};


interface IProps {
    onLogin: (token: string) => void;
}

type TProps = NativeStackScreenProps<TRootStackParamList, 'Login'> & IProps;

export default function Login(props: TProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function login() {
        try {
            // Authenticate user with Supabase and retrieve JWT token
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            
            if (error) {
                Alert.alert('Error', error.message);
                return;
            }

            // Store JWT token securely using Encrypted Storage
            await EncryptedStorage.setItem('userToken', data.session?.access_token || '');

            // Pass the token to App.tsx for authentication management
            props.onLogin(data.session?.access_token || '');
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred during login.');
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
            />
            {/* Ensure authentication request only occurs when user submits valid input */}
            <Button title="Login" onPress={login} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
    },
});
