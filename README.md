# Lab: Cross-Platform Security

Curtis Borson, Denis Pechenkin, Michelle Tran

Southern Alberta Institute of Technology

Software Security (ITSC-320-I)

Kokub Sultan

## I. Introduction

Mobile application security is crucial to protecting user data and preventing malicious cyber threats.  By implementing robust security measures, we can greatly reduce the potential of cyber threats in our application. This assessment evaluates the Totally Secure Math App for security vulnerabilities and recommends industry best practices to mitigate potential risks. The key vulnerabilities identified in this assessment include insecure data storage, improper authentication, code injection, insufficient input validation and insecure code practices. Each vulnerability was addressed by implementing the appropriate security measures.

## Identified vulnerabilities
<strong>1. Insecure Data Storage </strong> <br>
An insecure data storage vulnerability was identified in Login.tsx which resulted in users having to reauthenticate each time the application restarted. The absence of secure authentication persistence not only reduces usability but also increases the risk of session hijacking if authentication tokens are not properly managed. Without a secure storage mechanism, tokens may be exposed to unauthorized access, compromising user accounts. The insecure authentication persistence found in Login.tsx was coded as follows:
 ```js
 if (foundUser) { 
    props.onLogin(foundUser); 
} else { 
    Alert.alert('Error', 'Username or password is invalid.'); 
} 
 ``` 

<strong>2. Improper Authentication</strong> <br>
A weak authentication and authorization mechanism was identified in Login.tsx which is crucial for preventing unauthorized access to the user’s sensitive information. This vulnerability poses a high risk of identity theft and fraud, as there are no implemented mechanisms to verify the requestor’s identity or control the requestors access to resources. The insecure authentication mechanism found in Login.tsx was coded as follows:

```js
for (const user of users) { 
    if (username === user.username && password === user.password) { 
        foundUser = user; 
        break; 
    } 

} 
```

<strong>3. Code Injection</strong> <br>
The Notes.tsx component doesn’t perform input validation for equations. User input is inserted directly into a new note, without confirming the validity of the equation or the safety of the input. Behind the scenes, equation evaluation is done with the built-in “eval()” function, which executes strings passed as an argument. It is crucial to make sure code can’t be passed in the equation input because “eval()” can execute any Javascript code it receives.

<strong>Mitigation:</strong> In the given case, we can limit the characters of the equation to only numbers, operators, and parentheses. While this is sufficient for the scope of this assignment and prevents malicious code from getting executed, a more complex parser could be implemented to account for more complicated mathematical operations (trigonometry, integrals, etc.). This check should be made after note submission and during evaluation to account for storage interventions.

```js
export function validateEquation(equation: string) {
    const regexp = /^[\d\s+*\/\-\(\)]+$/

    if (regexp.test(equation) === false) {
        throw new Error("Equation is not valid")
    }
}
```

<strong>4. Insufficient Input Validation</strong> <br>
A lack of input validation was identified in Login.tsx, posing a significant risk of attacks such as SQL injection and cross-site scripting (XSS). Without proper input validation, malicious actors can inject harmful code, potentially compromising the application's security and exposing sensitive user data. Implementing input validation ensures that the application processes data that is properly formatted, reducing the risk of exploitation. The missing input validation in Login.tsx was coded as follows:

```js
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
```

<strong>5. Insecure Coding Practices</strong> <br>
Hardcoded credentials were identified in Login.tsx, which is an insecure coding practice because anyone with access to the codebase can retrieve the user’s private information. Login credentials should be restricted specific user of an account. This vulnerability could lead to a high risk of data theft if a malicious hacker gains access to the codebase and exploits the hardcoded credentials to access the accounts. The hardcoded credentials found in Login.tsx was coded as follows:

```js
const users; IUser[] = [ 
    { username: ‘joe’, password: ‘secret’ }, 
    { username: ‘bob’, password: ‘password’ }, 
]; 
```

<strong>6. Authentication State Management</strong> <br>
In App.tsx the signedInAs state is used to store authentication data, but is not securely persisted. storing the authentication state in a react component this way means that if the app crashes or is restarted, the session will be lost. This could also lead to session hijacking when combined with weak authentication methods.

```js
const [signedInAs, setSignedInAs] = React.useState<IUser | false>(false); 
```

<strong>7. No Logout Function</strong> <br>
After the user logs in, there is no mechanism to log out of the application or clear authentication data in the app. As long as the app is open the user session will remain active. This could have potential security risks if the device is shared among multiple users.

```js
<Stack.Navigator> 
    { !signedInAs ? 
        <Stack.Screen name="Login"> 
            {(props) => 
                <Login 
                {...props} 
                onLogin={(user) => setSignedInAs(user)} 
                />
            } 
        </Stack.Screen> 
        : 
        <Stack.Screen 
            name="Notes" 
            component={Notes} 
            initialParams={{ user: signedInAs }} 
        />
    } 
</Stack.Navigator> 
```

<strong>8. Potential Navigation Manipulation</strong> <br>
The navigation system doesn't validate navigation parameters. The Notes screen receives a user object through initialParams, but the object isn't validated before use. This could be used by malicious actors to manipulate navigation or inject an invalid or malicious user object. If user data is used for authentication, an attacker could bypass the login screen by navigating directly to Notes with arbitrary user data.

```js
<Stack.Screen 
    name="Notes" 
    component={Notes} 
    initialParams={{ user: signedInAs }} 
/> 
```

<strong>9. Insufficient Error Handling</strong> <br>
Even though we have covered input validation for equations, the equation evaluation process is still not secure. Currently, evaluation exceptions are not handled, which means that if equation format is invalid, the app will crash.

<strong>Mitigation:</strong> Wrap the evaluation in a try-catch block and display a message to users in case if something went wrong.

```js
function evaluateEquation() {
    try {
        validateEquation(props.text)

        const result = eval(props.text);

        Alert.alert('Result', 'Result: ' + result);
    } catch {
        Alert.alert('Equation could not be evaluated');
    }
}
```

This fix makes sure the app can’t be crashed by simply passing an invalid equation and putting the app into an unexpected state.

## Importance of Security Measures

#### Secure Storage of Sensitive Data
Sensitive data such as access tokens and API keys should be stored securely to prevent unauthorized access and spoofing. If this data is stored in plain text with no encryption, attackers can easily access the data and gain access to the environment or personal user data.

#### Secure Authentication Practices
Implementing secure authentication practices makes sure only legitimate users can access user-specific data and or access critical features. Secure authentication significantly improves data protection and reduces the risk of unauthorized access and data leakage.

#### Input Validation and Sanitization
These practices mitigate injection attacks including XSS and SQL injection. With the help of proper input validation, you prevent attackers from running malicious code in your app, which introduces risks of data leakage and unauthorized access to sensitive infrastructure running in the backend.

#### Secure Coding Practices
Secure coding practices such as decoupling credentials from source code, proper access control, and good error handling prevents attackers from getting access to credentials and sensitive functionality, protecting the app from spoofing-related attacks. Additionally, secure coding practices hide the internal details of the app by hiding stack traces and other technical data from users, which stops attackers from getting insights into the application’s internal structure.

## Lessons Learned and Best Practices
Various lessons were identified during the evaluation of the Totally Secure Math App which include implementing secure authentication mechanisms, validating and sanitizing all user inputs, storing sensitive data securely and ensuring applications follow best industry practices such as the ones listed in the OWASP Mobile Security Guidelines [1]. These guidelines help to enhance the security of mobile applications to reduce the risk of malicious actors exploiting sensitive user data. By implementing rigorous security measures, users will have more trust and confidence to use the app.

## References
[1] OWASP Foundation. “OWASP Mobile Security Testing Guide.” Accessed; March 14, 2025. [Online]. Available: https://mas.owasp.org/MASTG/ 