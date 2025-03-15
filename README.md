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

4. Hardcoded Credentials

Login credentials are hardcoded which is an insecure coding practice because anyone with access to the codebase can retrieve the user's private information. This vulnerability could lead to a high risk of data theft if a malicious hacker gains access to the codebase and exploits the hardcoded credentials to access the accounts.

const users: IUser[] = [
		{ username: 'joe', password: 'secret' },
		{ username: 'bob', password: 'password' },
	];

5. Missing Input Validation

A lack of input validation was identified in Login.tsx, posing a significant risk of attacks such as SQL injection and cross-site scripting (XSS). Without proper input validation, malicious actors can inject harmful code, potentially compromising the application's security and exposing sensitive user data. Implementing input validation ensures that the application processes data that is properly formatted, reducing the risk of exploitation. 

<TextInput
				style={styles.username}
				value={username}
				onChangeText={setUsername}
				placeholder="Username"
			/>
			<TextInput
				style={styles.password}
				value={password}
				onChangeText={setPassword}
				placeholder="Password"
			/>

6. Insecure Data Storage

Users would have to reauthenticate each time the application restarted because of the absence of secure authentication persistence. This increases the risk of session hijacking if authentication tokens are not properly managed. 

if (foundUser) {
			props.onLogin(foundUser);
		} else {
			Alert.alert('Error', 'Username or password is invalid.');
		}

7. Insecure Authentication Mechanism

The authentication mechanism identified in Login.tsx was found to be weak which poses a high risk of identity theft and fraud because there is no implemented mechanism to verify the requestor's identity or control the requestors access to resources.

for (const user of users) {
			if (username === user.username && password === user.password) {
				foundUser = user;

		

