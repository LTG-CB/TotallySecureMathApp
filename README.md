# ITSC-320-I-TotallySecureMathApp
 
# Security Vulnerabilities

1. Authentication State Management

In App.tsx the signedInAs state is used to store authentication data, but is not securely persisted. storing the authentication state in a react component this way means that if the app crashes or is restarted, the session will be lost. This could also lead to session hijacking when combined with weak authentication methods.

const [signedInAs, setSignedInAs] = React.useState<IUser | false>(false);


2. No Logout Function

After the user logs in, there is no mechanism to log out of the application or clear authentication data in the app. As long as the app is open the user session will remain active. This could have potential security risks if the device is shared among multiple users.

<Stack.Navigator>
    {
        !signedInAs ?
            <Stack.Screen name="Login">
                {(props) => <Login {...props} onLogin={(user) => setSignedInAs(user)} />}
            </Stack.Screen> :
            <Stack.Screen name="Notes" component={Notes} initialParams={{ user: signedInAs }} />
    }
</Stack.Navigator>

3. Potential Navigation Manipulation

The navigation system doesn't validate navigation parameters. The Notes screen receives a user object through initialParams, but the object isn't validated before use. This could be used by malicious actors to manipulate navigation or inject an invalid or malicious user object. If user data is used for authentication, an attacker could bypass the login screen by navigating directly to Notes with arbitrary user data.

<Stack.Screen name="Notes" component={Notes} initialParams={{ user: signedInAs }} />

