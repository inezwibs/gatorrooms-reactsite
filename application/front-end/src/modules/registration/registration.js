import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  withStyles, FormControlLabel, Button,
  Checkbox, Grid
} from '@material-ui/core';
import Formsy from 'formsy-react';
import ValidateTextField from './field-with-validation';
import LoginRegisterError from "./registration-error";
import { Redirect } from 'react-router-dom';
import { userRegister } from '../../api/user.actions';

const styles = theme => ({
  root: {
    marginLeft: theme.spacing.unit * 10,
    marginRight: theme.spacing.unit * 10,
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  field: {
    marginTop: theme.spacing.unit,
    width: theme.spacing.unit * 50
  }
});


class Register extends Component {
  static propTypes = {
    onRegister: PropTypes.func,
    registerFailed: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      canSubmit: false,
      admin: false,
      successfulRegistration: false
    }
    this._handleCheck = this._handleCheck.bind(this);
    this.registerSubmit = this.registerSubmit.bind(this);
  }

  registerSubmit = (regForm) => {
    regForm.isAdmin = this.state.admin;
    userRegister(regForm, (_) => {
      this.setState({ successfulRegistration: true })
    });
  }

  _handleCheck = () => {
    const { admin } = this.state;
    this.setState({ admin: !admin })
  }

  render() {

    const { classes, registerFailed } = this.props;
    const { canSubmit, admin, successfulRegistration } = this.state;

    if(successfulRegistration){
      return <Redirect to={'/login?registration=true'} />
    }

    return (
      <div className={classes.root}>
        <Grid
          container
          justify='center'
        >
          <Formsy className={classes.form}
            onValid={this.enableSubmit} onInvalid={this.disableSubmit}
            onValidSubmit={this.registerSubmit}>

            <ValidateTextField
              name="firstName"
              autoComplete="firstName"
              validations="minLength:3"
              validationErrors={{
                minLength: "Too short"
              }}
              required
              className={classes.field}
              label="First Name"
            />

            <ValidateTextField
              name="lastName"
              autoComplete="lastName"
              validations="minLength:3"
              validationErrors={{
                minLength: "Too short"
              }}
              required
              className={classes.field}
              label="Last Name"
            />

            <ValidateTextField
              name="email"
              autoComplete="email"
              validations="minLength:3"
              validationErrors={{
                minLength: "Too short"
              }}
              required
              className={classes.field}
              label="Email"
            />

            <ValidateTextField
              type="password"
              name="password"
              autoComplete="new-password"
              validations="minLength:2"
              validationErrors={{
                minLength: "Too short"
              }}
              required
              className={classes.field}
              label="Create a password"
            />

            <ValidateTextField
              type="password"
              name="repeatPassword"
              autoComplete="new-password"
              validations="equalsField:password"
              validationErrors={{
                equalsField: "passwords must match"
              }}
              required
              className={classes.field}
              label="Enter password again"
            />
            <ValidateTextField
              type="password"
              name="captcha"
              autoComplete="captcha"
              validations="minLength:5"
              validationErrors={{
                minLength: "Too short"
              }}
              required
              className={classes.field}
              label="Enter Image Code"
            />
            <div>
              <img style={{
                width: '150px',
                height: '50px',
                marginTop: 10
              }} src={require('../../resources/captcha.jpeg')} />
            </div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={admin}
                  onChange={this._handleCheck}
                  name="isAdmin"
                  value="admin"
                  color="primary"
                />
              }
              name="isAdmin"
              label="Admin"
            />
            {
              registerFailed && <LoginRegisterError message={registerFailed} />
            }

            <Button type="submit"
              variant="contained"
              color="primary"
              disabled={!canSubmit}
            >
              Register
            </Button>

          </Formsy>
        </Grid>
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

export default withStyles(styles)(Register);