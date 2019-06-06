import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  colors, withStyles, SnackbarContent,
  Snackbar, IconButton,
} from '@material-ui/core';
import {
  Error as ErrorIcon, Warning as WarningIcon,
  Close as CloseIcon, Info as InfoIcon,
  CheckCircle as CheckCircleIcon
} from '@material-ui/icons'

/*
 * Snack Bar is a component that is used to display an error message when the log in is invalid.
 * And when enrollment was successfull.  
 */
const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const styles1 = theme => ({
  success: {
    backgroundColor: colors.green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: colors.amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
});

function CustomSnackbarContent(props) {
  const { classes, className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
}

CustomSnackbarContent.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  message: PropTypes.node,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
};

const MySnackbarContentWrapper = withStyles(styles1)(CustomSnackbarContent);

const styles2 = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
});

class CustomSnackBar extends React.Component {

  render() {
    const { open, onClose, type, message } = this.props;
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={open}
          autoHideDuration={6000}
          onClose={onClose}
        >
          <MySnackbarContentWrapper
            onClose={onClose}
            variant={type}
            message={message}
          />
        </Snackbar>
      </div>
    );
  }
}

CustomSnackBar.propTypes = {
  classes: PropTypes.object.isRequired,
  type: PropTypes.oneOf([ 'success', 'error' ]).isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default withStyles(styles2)(CustomSnackBar);