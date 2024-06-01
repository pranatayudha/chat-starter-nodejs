import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { ReactComponent as ChatIcon } from "./chat.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url(./sign-in-illust.png)", // replace with your image path
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  chatIcon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  formRoot: {
    width: "60%",
    marginTop: "15%",
  },
  form: {
    marginTop: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  formControl: {
    width: "100%",
  },
  registerButton: {
    margin: theme.spacing(3, 0, 2),
    height: 56,
    width: 160,
    fontSize: 16,
    fontWeight: 700,
  },
  forgotPassword: {
    fontWeight: 700,
    underline: "none",
  },
}));

const Signup = ({ user, register }) => {
  const classes = useStyles();
  const history = useHistory();
  const [formErrorMessage, setFormErrorMessage] = useState({});

  const handleRegister = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formElements = form.elements;
    const username = formElements.username.value;
    const email = formElements.email.value;
    const password = formElements.password.value;
    const confirmPassword = formElements.confirmPassword.value;

    if (password !== confirmPassword) {
      setFormErrorMessage({ confirmPassword: "Passwords must match" });
      return;
    }
    await register({ username, email, password });
  };

  useEffect(() => {
    if (user && user.id) history.push("/home");
  }, [user, history]);

  return (
    <Grid container component="main" className={classes.root}>
      <Grid item xs={false} sm={4} md={4} className={classes.image}>
        <Box className={classes.chatIcon}>
          <ChatIcon style={{ width: 100, height: 100 }} />
        </Box>
        <Typography
          variant="h4"
          align="center"
          style={{ color: "#fff", marginTop: 39 }}
        >
          Converse with anyone with any language
        </Typography>
      </Grid>
      <Grid item xs={12} sm={8} md={8} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Grid
            container
            justifyContent="flex-end"
            alignItems="center"
            spacing={3}
          >
            <Grid item>
              <Typography style={{ color: "#B0B0B0" }}>
                Already have an account?
              </Typography>
            </Grid>
            <Grid item>
              <Link href="/login" to="/login">
                <Button
                  type="button"
                  variant="contained"
                  style={{
                    backgroundColor: "white",
                    color: "blue",
                  }}
                >
                  Login
                </Button>
              </Link>
            </Grid>
          </Grid>
          <div className={classes.formRoot}>
            <div style={{ fontSize: 55, fontWeight: 600 }}>
              Create an account.
            </div>
            <form className={classes.form} onSubmit={handleRegister}>
              <FormControl className={classes.formControl}>
                <TextField
                  variant="standard"
                  margin="normal"
                  required
                  label="Username"
                  name="username"
                />
              </FormControl>
              <FormControl className={classes.formControl}>
                <TextField
                  variant="standard"
                  margin="normal"
                  required
                  label="Email Address"
                  name="email"
                  type="email"
                />
              </FormControl>
              <FormControl
                error={!!formErrorMessage.confirmPassword}
                className={classes.formControl}
              >
                <TextField
                  variant="standard"
                  margin="normal"
                  required
                  name="password"
                  label="Password"
                  type="password"
                  inputProps={{ minLength: 6 }}
                />
                <FormHelperText>
                  {formErrorMessage.confirmPassword}
                </FormHelperText>
              </FormControl>
              <FormControl
                error={!!formErrorMessage.confirmPassword}
                className={classes.formControl}
              >
                <TextField
                  variant="standard"
                  margin="normal"
                  required
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  inputProps={{ minLength: 6 }}
                />
                <FormHelperText>
                  {formErrorMessage.confirmPassword}
                </FormHelperText>
              </FormControl>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.registerButton}
              >
                Register
              </Button>
            </form>
          </div>
        </div>
      </Grid>
    </Grid>
  );
};

export default Signup;
