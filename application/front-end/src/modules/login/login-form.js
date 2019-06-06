import React, { Component } from 'react';
import { 
  withStyles, FormControlLabel,
  Button, Checkbox, Grid
} from '@material-ui/core';
import Formsy from 'formsy-react';
import ValidateTextField from '../registration/field-with-validation';
import { Redirect } from 'react-router-dom';
import {userLogin} from '../../api/user.actions';
import qs from 'qs';
import { Link } from 'react-router-dom';
import SnackBar from '../_global/component/snack-bar';

const styles = theme => ({
  root: {
    marginLeft: theme.spacing.unit*10,
    marginRight: theme.spacing.unit*10,
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  field: {
    marginTop: theme.spacing.unit,
    width: theme.spacing.unit*50
  },
});

const snackBarConfig = {
  REGISTRATION_SUCCESS: {
    message: 'Account successfully created. Please login.',
    type: 'success'
  },
  LOGIN_FAILED: {
    message: 'Username or password is invalid',
    type: 'error'
  },
  AUTHENTICATION_REQUIRED: {
    message: 'Authentication required.',
    type: 'error'
  },
}

class LoginForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      canSubmit: false,
      remember: false,
      loginSuccess: false,
      message: {
        open: false,
        type: null // Success or Failure
      },
      loginCredentials:{
        email:'',
        password:'',
      },
      redirectTo: null
    }
    this._handleCheck = this._handleCheck.bind(this);
  }

  componentDidMount(){
    const params = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
    if(params.registration){
      // Trigger to display a snack bar
      this.setState({ message: { open: true, type: 'REGISTRATION_SUCCESS' } })
    }else if (params.authentication){
      const state = { message: { open: true, type: 'AUTHENTICATION_REQUIRED' } };
      this.setState(state);
    }
  }

  _handleCheck = () => {
    const { remember } = this.state;
    this.setState({ remember: !remember })
  }


  submitLogin = (regForm) =>{
    userLogin(regForm, (data) => {
       sessionStorage.setItem('session', JSON.stringify(data))
       this.setState({ loginSuccess: true })
    }, () => this.setState({ message: { open: true, type: 'LOGIN_FAILED' } })); 
  }

  render() {

    const { classes } = this.props;
    const { canSubmit, remember, loginSuccess, message } = this.state;

    if(loginSuccess){
      return <Redirect to={'/?refresh=true'} />
    }

    return (
      <div className={classes.root}>
        <Grid
          container
          justify={'center'}
        >
          <Formsy
            className={classes.form}
            onValid={this.enableSubmit}
            onInvalid={this.disableSubmit}
            onValidSubmit={this.submitLogin}
          >
            <ValidateTextField
              name="email"
              autoComplete="email"
              validations="minLength:3"
              validationErrors={{
                minLength: "Invalid Email"
              }}
              required
              className={classes.field}
              label="Email"
            />
            <ValidateTextField
              name="password"
              type={'password'}
              autoComplete="password"
              required
              className={classes.field}
              label="Password"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={remember}
                  onChange={this._handleCheck}
                  color="primary"
                />
              }
              label="Remember Me"
            />
            <Button 
              disableFocusRipple
              disableRipple
              style={{ textTransform: "none" }}
              variant="text"
              color="primary"
            >
              Forgot password ?
            </Button>
            <Button 
              disableFocusRipple
              disableRipple
              style={{ textTransform: "none" }}
              variant="text"
              color="primary"
              component={Link}
              to={'/register'}
            >
              Don't have an account?
            </Button>
            <div className={classes.actions}>
              <Button
                type="submit"
                fullWidth
                variant="contained" color="primary"
                disabled={!canSubmit}>Log In</Button>
            </div>
          </Formsy>
        </Grid>
        { message.open && <SnackBar
          open={message.open}
          type={snackBarConfig[message.type].type}
          message={snackBarConfig[message.type].message}
          onClose={() => this.setState({ message: { open: false, type: null } })}
        /> }
      </div>
    );
  }

  disableSubmit = () => {
    this.setState({ canSubmit: false })
  };

  enableSubmit = () => {
    this.setState({ canSubmit: true })
  };

}

export default withStyles(styles)(LoginForm);