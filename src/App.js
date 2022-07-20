// Import the functions you need from the SDKs you need
import './App.css'
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
  sendPasswordResetEmail,
  deleteUser,
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
import Switch from '@mui/material/Switch';
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import validator, { isEmail, isStrongPassword } from "validator";
import { createContext, useEffect, useRef, useState } from "react";

// npm package "React Social Login Buttons" widgets
import {
  FacebookLoginButton,
  GoogleLoginButton,
} from "react-social-login-buttons";
import { FormGroup } from "@mui/material";




// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Keeping this here because I might use this for Github pages anyway
// const firebaseConfig = {
//   apiKey: 'AIzaSyApO_RmF_i4oZglgdAaiZwHNO4mWDCsbO8',
//   authDomain: 'auth-firebaseauthentication.firebaseapp.com',
//   projectId: 'auth-firebaseauthentication',
//   storageBucket: 'auth-firebaseauthentication.appspot.com',
//   messagingSenderId: '83111206827',
//   appId: '1:83111206827:web:f7bc2274def0a45bf9fcee',
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service

const auth = getAuth();

// the current logged in user
let currentUser = auth.currentUser;

function GoogleHandleClick(event) {
  console.log("Google Sign in clicked: ");

  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // ...
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

// simple default Home component

function Home() {
  const [homeText, sethomeText] = useState("You are not logged in");
  return (
    <div>
      <h1>Home Page</h1>
      {currentUser !== null ? <h2>You are logged in so this is visible</h2> : null }
      {currentUser !== null ? <h2>{`Welcome back, ${currentUser.email}`}</h2>: null }
    </div>
  );
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
  const [signUpErrorText, setsignUpErrorText] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (!isEmail(data.get("email"))) {
      setsignUpErrorText("Not a valid email, please enter a valid email");
    } else if (!isStrongPassword(data.get("password"), { minUppercase: 0 })) {
      setsignUpErrorText(
        "Password is not strong enough, min characters: 8, min numerical: 1, min symbols: 1,  please choose another password"
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
          setsignUpErrorText("Account Successfully Created!");
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);

          if (errorCode === "auth/email-already-in-use") {
            setsignUpErrorText("Account with this email already exists");
          } else {
            setsignUpErrorText("Something went wrong with sign in");
          }

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
          <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h2" align="center">
            Create A New Account
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
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
                <Typography
                  component="h1"
                  variant="caption"
                  sx={{ color: "red" }}
                >
                  {signUpErrorText}
                </Typography>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up With Email
            </Button>
            <GoogleLoginButton
              onClick={GoogleHandleClick}
              // style={{ margin: "5px auto 0", display: "block" }}
            />
            <FacebookLoginButton onClick={FacebookHandleClick} />
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  href="#"
                  variant="body2"
                  onClick={() => props.setshowComponent("SignIn")}
                >
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
  const [signInErrorText, setsignInErrorText] = useState("");

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
      setsignInErrorText("Not a valid email, please enter a valid email");
    } else if (data.get("password").length < 6) {
      setsignInErrorText("Password invalid");
    } else if (isEmail(data.get("email")) && data.get("password").length >= 6) {
      signInWithEmailAndPassword(auth, data.get("email"), data.get("password"))
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          setsignInErrorText("");

          // ...
        })
        .catch((error) => {
          console.log("no user with these credentials exists");
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          if (errorCode === "auth/user-not-found") {
            setsignInErrorText("No user with these credentials exists");
          } else {
            setsignInErrorText("Something went wrong with sign in");
          }
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
          <Avatar sx={{ m: 1, bgcolor: "success.light" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h2">
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
            <Typography component="h1" variant="caption" sx={{ color: "red" }}>
              {signInErrorText}
            </Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <GoogleLoginButton
              onClick={GoogleHandleClick}
              // style={{ margin: "5px auto 0", display: "block" }}
            />
            <FacebookLoginButton onClick={FacebookHandleClick} />
            <Grid container>
              <Grid item xs>
                <Link
                  href="#"
                  variant="body2"
                  onClick={() => props.setshowComponent("ForgotPassword")}
                >
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link
                  href="#"
                  variant="body2"
                  onClick={() => props.setshowComponent("SignUp")}
                >
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
  const [emailLinkErrorText, setemailLinkErrorText] = useState("");

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
    if (!isEmail(data.get("email"))) {
      setemailLinkErrorText("Not a valid email, please enter a valid email");
    } else {
      sendSignInLinkToEmail(auth, data.get("email"), actionCodeSettings)
        .then(() => {
          // The link was successfully sent. Inform the user.
          // Save the email locally so you don't need to ask the user for it again
          // if they open the link on the same device.
          window.localStorage.setItem("emailForSignIn", data.get("email"));
          let emaillog = window.localStorage.getItem("emailForSignIn");
          console.log("Stored email: " + emaillog);
          setemailLinkErrorText("Email Link Sent!");
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          // ...
        });
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
            <Typography component="h1" variant="caption" sx={{ color: "red" }}>
              {emailLinkErrorText}
            </Typography>
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

// Forgot Password form (created by copying Sign In component)
function ForgotPassword(props) {
  const [forgotErrorText, setforgotErrorText] = useState("");

  const handleForgotSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
    });

    if (!isEmail(data.get("email"))) {
      setforgotErrorText("Not a valid email, please enter a valid email");
    } else {
      sendPasswordResetEmail(auth, data.get("email"))
        .then(() => {
          // Password reset email sent!
          console.log("Password reset email sent! to: " + data.get("email"));
          setforgotErrorText("Password reset email sent!");
          // ..
        })
        .catch((error) => {
          console.log("no user with this email exists");
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          if (errorCode === "auth/user-not-found") {
            setforgotErrorText("No user with this email exists");
          } else {
            setforgotErrorText("Something went wrong with sign in");
          }
          // ..
        });
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
          <Typography component="h1" variant="h5">
            Forgot Password
          </Typography>
          <Box
            component="form"
            onSubmit={handleForgotSubmit}
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
              Send Password Reset Email
            </Button>
            <Typography component="h1" variant="caption" sx={{ color: "red" }}>
              {forgotErrorText}
            </Typography>
            <Grid container>
              <Grid item>
                <Link
                  href="#"
                  variant="body2"
                  onClick={() => props.setshowComponent("SignIn")}
                >
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

// Delete user component

function DeleteUser() {
  const [deleteUserErrorText, setdeleteUserErrorText] = useState("");

  const handleDeleteAccountSubmit = (event) => {
    event.preventDefault();
    console.log(currentUser);

    if (currentUser === null) {
      setdeleteUserErrorText("You are not logged in");
    } else if (window.confirm("Do you really want to delete your account?")) {
      deleteUser(currentUser)
        .then(() => {
          console.log("user deleted: ");
          setdeleteUserErrorText("Account deleted successfully");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          // An error ocurred
          if (errorCode === "auth/requires-recent-login") {
            setdeleteUserErrorText(
              "For sensitive operations such as account deletion the user must have logged in recently. Please log out and log in and try again"
            );
          } else {
            setdeleteUserErrorText("Something went wrong with Delete");
            console.log("Something went wrong with Delete");
          }
          // ..
        });
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
          <Typography component="h1" variant="h5" align="center">
            Delete Account
          </Typography>
          <Typography component="h1" variant="body1" align="center">
            Warning! This will delete your account and data forever. Click the
            button below if you want to proceed.
          </Typography>
          <Box
            component="form"
            onSubmit={handleDeleteAccountSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Delete My Account
            </Button>
            <Typography
              component="h1"
              variant="caption"
              align="center"
              sx={{ color: "red" }}
            >
              {deleteUserErrorText}
            </Typography>
          </Box>
          <Typography
              component="h1"
              variant="h5"
              align="center"
            >
              Dark Theme
            </Typography>
            <SwitchLabels />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

function SwitchLabels() {
  const [labelText, setlabelText] = useState('Dark Theme Off')

  const onSwitchChange = () => {
    if (labelText === 'Dark Theme Off'){
      setlabelText('Dark Theme On')

      document.documentElement.style.setProperty('--background-App', '#7F8487')

    } else {
      setlabelText('Dark Theme Off')
      document.documentElement.style.setProperty('--background-App', 'transparent')
    }
  }

  return (
    <FormGroup>
      <FormControlLabel control={<Switch onChange={onSwitchChange}/>} label={labelText} />
    </FormGroup>
  );
}

function App() {
  console.log("App rerendered");
  const [signedInUsername, setsignedInUsername] = useState("Logged Out");

  const [showComponent, setshowComponent] = useState("SignUp");

  /* putting onAuthStateChanged in useEffect sets the onauthstate listener only once when App is first rendered, preventing
  another listener being added when App is rerendered, thereby preventing infinite loops when we change the state in onauthstatechanged.
  This solution took about 2 hours to find: https://stackoverflow.com/questions/61155701/how-to-prevent-infinite-loop-caused-by-onauthstatechanged-firebase-auth.
  Edit: Could have used useAuthState hook from react-firebase-hooks also, which also gives you access to a 'user' variable telling you if
  they are logged in or not. That might have been easier.
  */
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        currentUser = user;
        console.log(
          "Auth state changed, user is: " + uid + " username: " + user.email
        );
        setsignedInUsername("Signed In: " + user.email);
        // ...
      } else {
        console.log("Auth state changed, Logged Out");
        setsignedInUsername("Logged out");
        currentUser = user;
        // User is signed out
        // ...
      }
    });
  }, []);

  // this may get moved to a global scope again in the future, as I prefer all the firebase methods being global, and I don't like this function
  // getting rerun again when the App component rerenders

  const Switcher = () => {
    switch (showComponent) {
      case "Home":
        return <Home setshowComponent={setshowComponent} />;
      case "SignUp":
        return <SignUp setshowComponent={setshowComponent} />;
      case "SignIn":
        return <SignIn setshowComponent={setshowComponent} />;
      case "DeleteUser":
        return <DeleteUser setshowComponent={setshowComponent} />;
      case "ForgotPassword":
        return <ForgotPassword setshowComponent={setshowComponent} />;
      default:
        return <SignUp setshowComponent={setshowComponent} />;
    }
  };

  return (
    <div className="App">
      <header
        className="App-header"
        style={{
          backgroundColor: "lightBlue",
          height: "3rem",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Button color="primary" onClick={() => setshowComponent("Home")}>
          Home
        </Button>
        <Button color="primary" onClick={() => setshowComponent("SignUp")}>
          Sign Up
        </Button>
        <Button color="primary" onClick={() => setshowComponent("SignIn")}>
          Log In
        </Button>
        <Button color="primary" onClick={() => setshowComponent("DeleteUser")}>
          Profile
        </Button>
        <Button
          color="primary"
          onClick={() => setshowComponent("ForgotPassword")}
          style={{marginRight: 'auto'}}
        >
          Forgot Password
        </Button>
        <div style={{marginRight: '8px', fontWeight:'700'}}>{signedInUsername}</div>

        <Button
          fullWidth
          variant="contained"
          sx={{
            width: "10%",
            justifyContent: "center",
            float: "right",

            marginRight: "8px",
          }}
          onClick={() => {
            signOut(auth)
              .then(() => {
                // Sign-out successful.
                console.log("Sign out successful");
              })
              .catch((error) => {
                // An error happened.
              });
          }}
        >
          Log Out
        </Button>
      </header>
      
      <Box textAlign="center"></Box>

      <Switcher />

      {/* <SignUp />
      <SignIn />
      <EmailLink />
      <ForgotPassword />
      <DeleteUser currentUser={currentUser} />
      */}
    </div>
  );
}

export default App;
