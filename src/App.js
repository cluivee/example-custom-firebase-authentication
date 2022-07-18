// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";
// import SignIn from "./SignIn";
// import SignUp from "./SignUp";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import validator, { isEmail, isStrongPassword } from "validator";
import { useEffect, useState } from "react";

// npm package "React Social Login Buttons" widgets
import {
  FacebookLoginButton,
  GoogleLoginButton,
} from "react-social-login-buttons";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApO_RmF_i4oZglgdAaiZwHNO4mWDCsbO8",
  authDomain: "auth-firebaseauthentication.firebaseapp.com",
  projectId: "auth-firebaseauthentication",
  storageBucket: "auth-firebaseauthentication.appspot.com",
  messagingSenderId: "83111206827",
  appId: "1:83111206827:web:f7bc2274def0a45bf9fcee",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service

const auth = getAuth();

// the current logged in user
const user = auth.currentUser;

const provider = new GoogleAuthProvider();

// const displayName = "";
// const email = "";
// const photoURL = "";
// const emailVerified = "";

// // example of how to get a users profile information
// if (user !== null) {
//   console.log("user is not null");
//   // The user object has basic properties such as display name, email, etc.
//   console.log(user.displayName);
//   console.log(user.email);
//   console.log("photourl: " + user.photoURL);
//   console.log(user.emailVerified);

//   // The user's ID, unique to the Firebase project. Do NOT use
//   // this value to authenticate with your backend server, if
//   // you have one. Use User.getToken() instead.

//   // uid = user.uid;
// }


// 18.07.2022 this is slightly buggy, as it won't say "sign in successful" on successful login here, but I'm keeping this method outside
// the App component because it causes problems with asking for the email 4 times if I put it in the app component.

if (isSignInWithEmailLink(auth, window.location.href)) {
  // Additional state parameters can also be passed via URL.
  // This can be used to continue the user's intended action before triggering
  // the sign-in operation.
  // Get the email if available. This should be available if the user completes
  // the flow on the same device where they started it.
  let email = window.localStorage.getItem("emailForSignIn");
  if (!email) {
    // User opened the link on a different device. To prevent session fixation
    // attacks, ask the user to provide the associated email again. For example:
    email = window.prompt("Please provide your email for confirmation");
  }
  // The client SDK will parse the code from the link for you.
  signInWithEmailLink(auth, email, window.location.href)
    .then((result) => {
      // Clear email from storage.
      window.localStorage.removeItem("emailForSignIn");
      // You can access the new user via result.user
      // Additional user info profile not available via:
      // result.additionalUserInfo.profile == null
      // You can check if the user is new or existing:
      // result.additionalUserInfo.isNewUser
    })
    .catch((error) => {
      // Some error occurred, you can inspect the code: error.code
      // Common errors could be invalid email and invalid or expired OTPs.
    });
}

// Create New Account Component MUI
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

function SignUp(props) {
  const [signUpErrorText, setsignUpErrorText] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
      type: typeof data.get("email"),
    });

    if (!isEmail(data.get("email"))) {
      console.log("Email invalid, please enter a valid email");
      setsignUpErrorText("Not a valid email, please enter a valid email");
      
    } else if (!isStrongPassword(data.get("password"), { minUppercase: 0 })) {
      console.log(
        "Password is not strong enough, min characters: 8, min numerical: 1, min symbols: 1,  please choose another password"
      );
      setsignUpErrorText("Password is not strong enough, min characters: 8, min numerical: 1, min symbols: 1,  please choose another password")
    } else if (
      isEmail(data.get("email")) &&
      isStrongPassword(data.get("password"), { minUppercase: 0 })
    ) {
      createUserWithEmailAndPassword(
        auth,
        data.get("email"),
        data.get("password")
      )
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          props.setSignInSuccessfulText("Sign in successful!");
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });

      console.log("Creating account, user: " + data.get("email"));
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ fontSize: "48px" }}>
            Create a New Account
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <div style={{fontSize:'0.75rem', color: 'red'}}>{signUpErrorText}</div>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}

// SignIn MUI Template Component

function SignIn(props) {
  const handleSignInSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(
      "Sign in clicked: " +
        {
          email: data.get("email"),
          password: data.get("password"),
        }
    );

    if (!isEmail(data.get("email"))) {
      console.log("email invalid, please enter a valid email");
    } else if (!isStrongPassword(data.get("password"), { minUppercase: 0 })) {
      console.log(
        "password is not strong enough, please choose another password"
      );
    } else if (
      isEmail(data.get("email")) &&
      isStrongPassword(data.get("password"), { minUppercase: 0 })
    ) {
      signInWithEmailAndPassword(auth, data.get("email"), data.get("password"))
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          props.setSignInSuccessfulText("Sign in successful!");

          // ...
        })
        .catch((error) => {
          console.log("no user with these credentials exists");
          const errorCode = error.code;
          const errorMessage = error.message;
        });

      console.log("Signing in, user: " + data.get("email"));
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSignInSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

// Email Link Verification Component

function EmailLink() {
  const handleEmailLinkSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
    });

    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      url: "http://localhost:3000",
      // This must be true.
      handleCodeInApp: true,
      // iOS: {
      //   bundleId: "com.example.ios",
      // },
      // android: {
      //   packageName: "com.example.android",
      //   installApp: true,
      //   minimumVersion: "12",
      // },
      // dynamicLinkDomain: "example.page.link",
    };

    sendSignInLinkToEmail(auth, data.get("email"), actionCodeSettings)
      .then(() => {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem("emailForSignIn", data.get("email"));
        let emaillog = window.localStorage.getItem("emailForSignIn");
        console.log("Stored email: " + emaillog);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Email Link Verification
          </Typography>
          <Box
            component="form"
            onSubmit={handleEmailLinkSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Send Email Link
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

function App() {
  const [signedInUsername, setsignedInUsername] = useState("Logged Out");
  const [signInSuccessfulText, setSignInSuccessfulText] = useState("");

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      console.log(
        "Auth state changed, user is: " + uid + " username: " + user.email
      );
      setsignedInUsername("Signed in user: " + user.email);
      // ...
    } else {
      console.log("Auth state changed, Logged Out");
      // User is signed out
      // ...
    }
  });


  
  function GoogleHandleClick(event) {
    console.log("Google Sign in clicked: ");

    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // ...

        setSignInSuccessfulText("Sign in successful!");
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }
  function FacebookHandleClick() {
    console.log("Facebook Sign in clicked: ");
    const provider = new FacebookAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;

        setSignInSuccessfulText("Sign in successful!");

        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = FacebookAuthProvider.credentialFromError(error);

        // ...
      });
  }

  return (
    <div className="App">
      <header className="App-header">This is the first page</header>
      <div>{signedInUsername}</div>
      <div>{signInSuccessfulText}</div>
      <div></div>
      <Box textAlign="center">
        <Button
          fullWidth
          variant="contained"
          sx={{ width: "30%", justifyContent: "center" }}
          onClick={() => {
            signOut(auth)
              .then(() => {
                // Sign-out successful.
                console.log("Sign out successful");
                setsignedInUsername("Logged out");
                setSignInSuccessfulText("Log Out successful");
              })
              .catch((error) => {
                // An error happened.
              });
          }}
        >
          Log Out
        </Button>
      </Box>
      <SignUp setSignInSuccessfulText={setSignInSuccessfulText}/>
      <SignIn setSignInSuccessfulText={setSignInSuccessfulText}/>
      <EmailLink />
      <GoogleLoginButton
        onClick={GoogleHandleClick}
        style={{ width: "30%", margin: "5px auto 0", display: "block" }}
      />
      <FacebookLoginButton
        onClick={FacebookHandleClick}
        style={{ width: "30%", margin: "5px auto 0", display: "block" }}
      />
    </div>
  );
}

export default App;
