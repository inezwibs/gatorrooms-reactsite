import React from 'react';
import { 
    TextField,
    withStyles,
    Button,
    FormGroup,
    Typography
} from '@material-ui/core';
import {getUserProfile,updateProfile} from '../../../api/user.actions';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: theme.spacing.unit * 5
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 300
    },
    dense: {
        marginTop: 19,
    },
    title: {
        marginLeft: theme.spacing.unit * 3,
        marginTop: theme.spacing.unit * 3,
    }
})

class ProfileForm extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            profile: {}
        }
    }

    componentDidMount(){
        getUserProfile((res) => this.setState({ profile: res.data }));
    }

    handleChange = name => event => {
        let { profile } = this.state;
        profile[name] = event.target.value
        this.setState({ profile });
    };

    handleSend = () =>{
       updateProfile( this.state.profile, ()=>{
         alert('profile has been updated!');
         getUserProfile((res) => this.setState({ profile: res.data }));
       });
    }

    render(){
        const { profile } = this.state;
        const { classes } = this.props;

        return (
            <div>
                <Typography className={classes.title} variant="h5" >Profile Info</Typography>
                <form className={classes.container} noValidate autoComplete={"off"} >
                    <FormGroup>

                        <TextField
                            id="standard-name"
                            label="AvatarUrl"
                            autoFocus
                            className={classes.textField}
                            value={profile.avatarUrl}
                            onChange={this.handleChange('avatarUrl')}
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                        <TextField
                            id="standard-name"
                            autoFocus
                            label="First Name"
                            className={classes.textField}
                            value={profile.firstName}
                            onChange={this.handleChange('firstName')}
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            id="standard-name"
                            label="Last Name"
                            autoFocus
                            className={classes.textField}
                            value={profile.lastName}
                            onChange={this.handleChange('lastName')}
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            id="standard-name"
                            label="Email"
                            autoFocus
                            className={classes.textField}
                            value={profile.email}
                            onChange={this.handleChange('email')}
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            id="standard-password"
                            label="Password"
                            className={classes.textField}
                            value={profile.password || '**********'}
                            onChange={this.handleChange('password')}
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <div>
                            <Button 
                              variant="contained" 
                              color="primary" 
                              onClick={this.handleSend}
                              className={classes.button}>
                                Update
					        </Button>
                        </div>
                    </FormGroup>
                </form>
            </div>
        )
    }
}

export default withStyles(styles)(ProfileForm);