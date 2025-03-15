/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */



import React from 'react';
import type { PropsWithChildren } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

/*
Import react-native-encrypted-storage to store user credentials
*/
import EncryptedStorage from 'react-native-encrypted-storage';

import Notes from './Notes';
import Login, { IUser } from './Login';

export type TRootStackParamList = {
    Login: undefined;
    Notes: {
        user: IUser;
    };
};

function App() {

    /*
    const [signedInAs, setSignedInAs] = React.useState<IUser | false>(false);
    
    set signedInAs to Null until credentials are loaded
    don't render the login screen until credentials are checked
    */
    const [signedInAs, setSignedInAs] = React.useState<IUser | null>(null);
    const [loading, setLoading] = React.useState(true);


    const Stack = createNativeStackNavigator<TRootStackParamList>();

    /*
    If stored credentials exist, log the user in automatically
    If no credentials exist, show the login screen
    */
    React.useEffect(() => {
        async function loadUser() {
            try {
                const storedUser = await EncryptedStorage.getItem('user');
                if (storedUser) {
                    setSignedInAs(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('Failed to load user from storage:', error);
            }
            setLoading(false);
        }
        loadUser();
    }, []);

    /*
    Stores user credentials in Encrypted Storage
    Ensures persistence between app restarts
    */
    async function handleLogin(user: IUser) {
        try {
            await EncryptedStorage.setItem('user', JSON.stringify(user)); // ✅ Securely save credentials
            setSignedInAs(user);
        } catch (error) {
            console.error('Failed to store user credentials:', error);
        }
    }

    /**
    Deletes stored credentials from Encrypted Storage
    Ensures user is completely logged out
    */
    async function handleLogout() {
        try {
            await EncryptedStorage.removeItem('user'); // ✅ Securely remove credentials
            setSignedInAs(null);
        } catch (error) {
            console.error('Failed to remove user credentials:', error);
        }
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {
                    !signedInAs ?
                        /*
                        Render the Login screen if no user is signed in.
                        Pass handleLogin to store credentials securely in Encrypted Storage.
                        */
                        <Stack.Screen name="Login">
                        {(props) => <Login {...props} onLogin={handleLogin} />}
                        </Stack.Screen> :
                        <Stack.Screen name="Notes" component={Notes} initialParams={{ user: signedInAs }} />
                }
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
});

export default App;
