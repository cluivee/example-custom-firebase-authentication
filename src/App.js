// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
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
import { useState } from "react";

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

const displayName = ""
const email = ""
const photoURL = ""
const emailVerified = ""

if (user !== null) {
  console.log("user is not null")
  // The user object has basic properties such as display name, email, etc.
  console.log(user.displayName);
  console.log( user.email);
  console.log("photourl: "+ user.photoURL);
  console.log(user.emailVerified);

  // The user's ID, unique to the Firebase project. Do NOT use
  // this value to authenticate with your backend server, if
  // you have one. Use User.getToken() instead.

  // uid = user.uid;
}


onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    console.log("Auth state changed, user is: " + uid);
    // ...
  } else {
    console.log("Auth state changed, Logged Out");
    // User is signed out
    // ...
  }
});



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

function SignUp() {
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
      type: typeof data.get("email"),
    });

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
      createUserWithEmailAndPassword(
        auth,
        data.get("email"),
        data.get("password")
      )
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
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
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
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

function SignIn() {
  
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
          // ...
        })
        .catch((error) => {
          console.log("no user with these credentials exists")
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

function App() {
  
  

  
  return (
    <div className="App">
      <header className="App-header">This is first page</header>
      <div> {displayName} {email} {photoURL} {emailVerified} </div>
      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2, width: "50%" }}
        onClick={() => {
          signOut(auth)
            .then(() => {
              // Sign-out successful.
              console.log('Sign out successful')
            })
            .catch((error) => {
              // An error happened.
            });
        }}
      >
        Log Out
      </Button>
      <SignUp />
      <SignIn />
    </div>
  );
}

export default App;
