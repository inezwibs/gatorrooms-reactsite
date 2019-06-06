import React, { Component } from 'react';
import styles from './styles/styles';

import {
    withStyles, Paper, 
    Grid, Divider, Tabs, Tab
} from '@material-ui/core'

import ProfileForm from './pages/profile-form';
import ProfileListings from './pages/profile-listings';
import AdminListings from './pages/admin-listings';
import Messages from '../contact/contact-page';
import NewListingForm from '../listing/new-listing';
import { Route, Switch, Redirect } from 'react-router-dom';
import { checkSession } from '../../api/user.actions';

class DashBoard extends Component {

	constructor(props) {
		super(props);
		this.state = {
			from: '',
			to: 'profile',
			authenticationRequired: false,
			admin: false
		}
		this.handleBarNavigation = this.handleBarNavigation.bind(this);
	}

	componentDidMount(){
		const session = sessionStorage.getItem('session')
		if(session && JSON.parse(session).token){
			// validate session
			const token = JSON.parse(session).token;
			checkSession(token, (_) => { this.setState({ admin: JSON.parse(session).admin }) }, () => this.setState({ authenticationRequired: true }));
		}else{
			this.setState({ authenticationRequired: true });
		}
		this.setState({ to: window.location.pathname.substr(1) });
	}

	handleBarNavigation = (event, to) => {
		let prev = this.state.to;
		if (prev !== to) {
			let prevLoc = window.location.pathname;
			prevLoc = prevLoc.substr(1, prevLoc.length);
			this.setState({
				from: prevLoc,
				to: to
			});
		}
	};

	render() {
		const { from, to, authenticationRequired, admin } = this.state;
		const { classes } = this.props;

		if(authenticationRequired){
			return <Redirect to={'/login?authentication=true'} />
		}

		return (
			<Paper>
				<Grid
					justify="space-evenly"
					container
					spacing={0}
				>
					<Tabs
						value={to}
						onChange={this.handleBarNavigation}
						indicatorColor="primary"
						textColor="primary"
						centered
					>
						<Tab label="Profile" value={'profile'} />
						<Tab label="My Listings" value={'profile/listings'} />
						<Tab label="Messages" value={'profile/messages'} />
						{ admin && <Tab label="Admin" value={'profile/admin'} />} 
					</Tabs>
				</Grid>
				<Divider light />
				<div className={classes.content} >
					<Switch>
						<Redirect exact from={`/${from}`} to={`/${to}`} />
						<Route path={'/profile/listings/new'} component={NewListingForm} />
						<Route path={'/profile/listings'} component={ProfileListings} />
						<Route path={'/profile/messages'} component={Messages} />
						{ admin && <Route path={'/profile/admin'} component={AdminListings} />}
						<Route path={'/profile'} component={ProfileForm} />
					</Switch>
				</div>
			</Paper>
		)
	}
}

export default withStyles(styles)(DashBoard);
