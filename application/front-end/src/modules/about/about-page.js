import React, { Component } from 'react';
import {
    withStyles,
    Paper, Typography,
    Grid
} from '@material-ui/core'
import AboutBtn from './component/about-btn';
import styles from './styles/about-page';
import { Switch, Route, withRouter } from 'react-router-dom';

import AboutAliaksei from './pages/about-aliaksei';
import AboutMarcus from './pages/about-marcus';
import AboutRomeel from './pages/about-romeel';
import AboutJiaNan from './pages/about-jianan';
import AboutInez from './pages/about-inez';
import AboutHang from './pages/about-hang';
import AboutIsmael from './pages/about-ismael';


class AboutPage extends Component{

    constructor(props){
        super(props);
        this.state = {
            currentLocation: ''
        };
    }

    componentDidUpdate(prevProps){
        if (this.props.location !== prevProps.location) {
            this.onRouteChanged();
        }
    }

    onRouteChanged() {
        if(this.props.location){
            let loc = this.props.location.pathname.replace('/', '').trim();
            console.log('Loc:', loc);
            this.setState({ currentLocation: loc});
        }
    }

    render(){

        const { currentLocation } = this.state;
        const { classes } = this.props;

        return (
            <Paper className={classes.root} >
                <div className={classes.titleContainer}>
                    <Typography className={classes.grow} variant={'title'} >
                        Software Enginering class SFSU
                    </Typography>
                    <p>Spring 2019</p>
                    <p>Section 02</p>
                    <p>Team 9</p>
                </div>
                <Grid
                    container
                    className={classes.content}
                    direction={'row'}
                    spacing={16}
                >
                    <Grid xs={4} item>
                        <Grid
                            container
                            direction={'column'}
                            justify={'center'}
                        >
                            <AboutBtn
                                classes={classes}                             
                                avatarUrl={'https://cdn3.iconfinder.com/data/icons/avatar-set/512/Avatar01-512.png'}
                                name={'Inez Wibowo'}
                                role={'Team Lead'}
                                to={'/about'}
                                selected={currentLocation === 'about'}
                            />
                            <AboutBtn
                                classes={classes}
                                avatarUrl={'https://www.clipartmax.com/png/middle/319-3191274_male-avatar-admin-profile.png'}
                                name={'Aliaksei Siarheyeu'}
                                role={'Lead'}
                                to={'/about/alex'}
                                selected={currentLocation === 'about/alex'}
                            />
                            <AboutBtn
                                classes={classes}
                                avatarUrl={'https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/spider_insect_bug_avatar-512.png'}
                                role={'Lead'}
                                name={'Marcus Wong'}
                                to={'/about/marcus'}
                                selected={currentLocation === 'about/marcus'}
                            />
                            <AboutBtn
                                classes={classes}
                                avatarUrl={'https://cdn0.iconfinder.com/data/icons/avatar-vol-4/512/2-512.png'}
                                name={'Romeel Chaudhari'}
                                role={'Engineer'}
                                to={'/about/romeel'}
                                selected={currentLocation === 'about/romeel'}
                            />
                            <AboutBtn
                                classes={classes}
                                avatarUrl={'https://cdn0.iconfinder.com/data/icons/handsome-man-avatars/283/stock_man_avatar-17-512.png'}
                                name={'Jia Nan Mai'}
                                role={'Engineer'}
                                to={'/about/jianan'}
                                selected={currentLocation === 'about/jianan'}
                            />
                            <AboutBtn
                                classes={classes}
                                avatarUrl={'https://cdn4.iconfinder.com/data/icons/user-avatar-flat-icons/512/User_Avatar-04-512.png'}
                                name={'Hang Li'}
                                role={'Engineer'}
                                to={'/about/hang'}
                                selected={currentLocation === 'about/hang'}
                            />
                            <AboutBtn
                                classes={classes}
                                avatarUrl={'https://cdn1.iconfinder.com/data/icons/user-avatars-2/300/10-512.png'}
                                name={'Ismael San Juan'}
                                role={'Engineer'}
                                to={'/about/ismael'}
                                selected={currentLocation === 'about/ismael'}
                            />
                        </Grid>    
                    </Grid>
                    <Grid xs={8} item>
                        <Grid
                            container
                            justify={'center'}
                            alignItems={'center'}
                            className={classes.pageContent}
                        >
                            <Switch>
                                <Route path={'/about/jianan'} component={AboutJiaNan} />
                                <Route path={'/about/romeel'} component={AboutRomeel} />
                                <Route path={'/about/marcus'} component={AboutMarcus} />
                                <Route path={'/about/hang'} component={AboutHang} />
                                <Route path={'/about/ismael'} component={AboutIsmael} />
                                <Route path={'/about/alex'} component={AboutAliaksei} /> 
                                <Route path={'/about'} component={AboutInez} /> {/* <- This should stay the last in the list */}
                            </Switch>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        )
    }
}

export default withRouter(withStyles(styles, { withTheme: true })(AboutPage));
