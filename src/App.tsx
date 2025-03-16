import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EncryptedStorage from 'react-native-encrypted-storage';
import { supabase } from './supabaseClient';
import Login from './Login';
import Notes from './Notes';
import 'react-native-url-polyfill/auto';


export type TRootStackParamList = {
    Login: undefined;
    Notes: undefined;
};

const Stack = createNativeStackNavigator<TRootStackParamList>();

function App() {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Try/Catch block for error handling
    useEffect(() => {
        async function loadToken() {
            try {
                // Retrieve the stored JWT token securely 
                const storedToken = await EncryptedStorage.getItem('userToken');
                if (storedToken) {
                    // Validate the token with Supabase to ensure user session is active 
                    const { data } = await supabase.auth.getUser();
                    if (data.user) {
                        setToken(storedToken);
                    } else {
                        // Remove invalid token to prevent unauthorized access
                        await EncryptedStorage.removeItem('userToken');
                    }
                }
            } catch (error) {
                console.error('Error validating token:', error);
            }
            setLoading(false);
        }
        loadToken();
    }, []);

    async function handleLogin(token: string) {
        // Setting a token after successful authentication 
        setToken(token);
    }

    async function handleLogout() {
        // Removing the stored token and logging out from Supabase to clear the session 
        await EncryptedStorage.removeItem('userToken');
        await supabase.auth.signOut();
        setToken(null);
    }

    if (loading) return null;

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {token ? (
                    // Shows the Notes screen if the user is authenticated
                    <Stack.Screen name="Notes">
                        {(props) => <Notes {...props} onLogout={handleLogout} />}
                    </Stack.Screen>
                ) : (
                    // Shows the Login screen if the user is not authenticated
                    <Stack.Screen name="Login">
                        {(props) => <Login {...props} onLogin={handleLogin} />}
                    </Stack.Screen>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
