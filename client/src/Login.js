import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  Link,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect } from "react";
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
  loginButton: {
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

const Login = ({ user, login }) => {
  const classes = useStyles();
  const history = useHistory();

  const handleLogin = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formElements = form.elements;
    const email = formElements.email.value;
    const password = formElements.password.value;

    await login({ email, password });
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
                Don't have an account?
              </Typography>
            </Grid>
            <Grid item>
              <Link href="/register" to="/register">
                <Button
                  type="button"
                  variant="contained"
                  style={{
                    backgroundColor: "white",
                    color: "blue",
                  }}
                >
                  Create Account
                </Button>
              </Link>
            </Grid>
          </Grid>
          <div className={classes.formRoot}>
            <div style={{ fontSize: 55, fontWeight: 600 }}>Welcome back!</div>
            <form className={classes.form} onSubmit={handleLogin}>
              <TextField
                variant="standard"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />

              <Grid container alignItems="flex-end" spacing={1}>
                <Grid item xs={11} sm={11} md={11} lg={11}>
                  <TextField
                    variant="standard"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                  />
                </Grid>

                <Grid
                  item
                  style={{ marginBottom: 12 }}
                  xs={1}
                  sm={1}
                  md={1}
                  lg={1}
                >
                  <Link
                    to="/login"
                    href="/login"
                    className={classes.forgotPassword}
                  >
                    Forgot?
                  </Link>
                </Grid>
              </Grid>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.loginButton}
              >
                Login
              </Button>
            </form>
          </div>
        </div>
      </Grid>
    </Grid>
  );
};

export default Login;
