import React, { useState } from "react";
import styles from "./Auth.module.css";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../features/userSlice";
import { auth, provider, storage } from "../firebase";
//Firebase ver9 compliant
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
//Firebase ver9 compliant
import {
  signInWithPopup,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Paper,
  Grid,
  Typography,
  makeStyles,
  Modal,
  IconButton,
  Box,
} from "@mui/material";

import { styled } from "@mui/material";

import SendIcon from "@mui/material/Icon";
import CameraIcon from "@mui/material/Icon";
import EmailIcon from "@mui/material/Icon";
import LockOutlinedIcon from "@mui/material/Icon";
import AccountCircleIcon from "@mui/material/Icon";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const SubmitButton = styled(Button) (({theme}) => ({
  margin: theme.spacing(3, 0, 2)
}));

const CustomAvatar = styled(Avatar) (({theme}) => ({
  margin: theme.spacing(1),
  backgroundColor: theme.palette.secondary.main,
}));

const GridImage = styled(Grid)(({ theme }) => ({
  backgroundImage:
      "url(https://images.unsplash.com/photo-1589793907316-f94025b46850?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=932&q=80)",
    backgroundRepeat: "no-repeat",
    backgroundColor: theme.palette.grey[50],
    /*
    backgroundColor: 
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    */
    backgroundSize: "cover",
    backgroundPosition: "center",
}));

/*
const Modal = styled(div) (({ theme }) => ({
  outline: "none",
    position: "absolute",
    width: 400,
    borderRadius: 10,
    backgroundColor: "white",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(10),
}));
*/

/*
const useStyles = makeStyles((theme) => ({
  image: {
    backgroundImage:
      "url(https://images.unsplash.com/photo-1589793907316-f94025b46850?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=932&q=80)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  modal: {
    outline: "none",
    position: "absolute",
    width: 400,
    borderRadius: 10,
    backgroundColor: "white",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(10),
  },
}));

*/

const Auth: React.FC = () => {
  //const classes = useStyles();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [openModal, setOpenModal] = React.useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const sendResetEmail = async (e: React.MouseEvent<HTMLElement>) => {
    //Firebase ver9 compliant
    await sendPasswordResetEmail(auth, resetEmail)
      .then(() => {
        setOpenModal(false);
        setResetEmail("");
      })
      .catch((err) => {
        alert(err.message);
        setResetEmail("");
      });
  };

  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setAvatarImage(e.target.files![0]);
      e.target.value = "";
    }
  };
  const signInEmail = async () => {
    //Firebase ver9 compliant
    await signInWithEmailAndPassword(auth, email, password);
  };
  const signUpEmail = async () => {
    //Firebase ver9 compliant
    const authUser = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    let url = "";
    if (avatarImage) {
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomChar + "_" + avatarImage.name;
      //Firebase ver9 compliant
      await uploadBytes(ref(storage, `avatars/${fileName}`), avatarImage);
      url = await getDownloadURL(ref(storage, `avatars/${fileName}`));
    }
    //Firebase ver9 compliant
    if (authUser.user) {
      await updateProfile(authUser.user, {
        displayName: username,
        photoURL: url,
      });
    }

    dispatch(
      updateUserProfile({
        displayName: username,
        photoUrl: url,
      })
    );
  };

  const signInGoogle = async () => {
    //Firebase ver9 compliant
    await signInWithPopup(auth, provider).catch((err) => alert(err.message));
  };
  return (
    <Grid container component="main" sx={{height: "100vh"}}>
      <CssBaseline />
      <GridImage item xs={false} sm={4} md={7} /*className={classes.image}*/ />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div /*className={classes.paper} */ >
          <CustomAvatar /* className={classes.avatar} */>
            <LockOutlinedIcon />
          </CustomAvatar>
          <Typography component="h1" variant="h5">
            {isLogin ? "Login" : "Register"}
          </Typography>
          <form /* className={classes.form} */ noValidate>
            {!isLogin && (
              <>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setUsername(e.target.value);
                  }}
                />
                <Box textAlign="center">
                  <IconButton>
                    <label>
                      <AccountCircleIcon
                        fontSize="large"
                        className={
                          avatarImage
                            ? styles.login_addIconLoaded
                            : styles.login_addIcon
                        }
                      />
                      <input
                        className={styles.login_hiddenIcon}
                        type="file"
                        onChange={onChangeImageHandler}
                      />
                    </label>
                  </IconButton>
                </Box>
              </>
            )}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value);
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value);
              }}
            />

            <SubmitButton
              disabled={
                isLogin
                  ? !email || password.length < 6
                  : !username || !email || password.length < 6 || !avatarImage
              }
              fullWidth
              variant="contained"
              color="primary"
              /* className={classes.submit} */
              startIcon={<EmailIcon />}
              onClick={
                isLogin
                  ? async () => {
                      try {
                        await signInEmail();
                      } catch (err: any) {
                        alert(err.message);
                      }
                    }
                  : async () => {
                      try {
                        await signUpEmail();
                      } catch (err: any) {
                        alert(err.message);
                      }
                    }
              }
            >
              {isLogin ? "Login" : "Register"}
            </SubmitButton>
            <Grid container>
              <Grid item xs>
                <span
                  className={styles.login_reset}
                  onClick={() => setOpenModal(true)}
                >
                  Forgot password?
                </span>
              </Grid>
              <Grid item>
                <span
                  className={styles.login_toggleMode}
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Create new account ?" : "Back to login"}
                </span>
              </Grid>
            </Grid>
            <SubmitButton
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<CameraIcon />}
              /* className={classes.submit} */
              onClick={signInGoogle}
            >
              SignIn with Google
            </SubmitButton>
          </form>
          <Modal open={openModal} onClose={() => setOpenModal(false)}>
            <div style={getModalStyle()} /* className={classes.modal} */ >
              <div className={styles.login_modal}>
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  type="email"
                  name="email"
                  label="Reset E-mail"
                  value={resetEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setResetEmail(e.target.value);
                  }}
                />
                <IconButton onClick={sendResetEmail}>
                  <SendIcon />
                </IconButton>
              </div>
            </div>
          </Modal>
        </div>
      </Grid>
    </Grid>
  );
};
export default Auth;
