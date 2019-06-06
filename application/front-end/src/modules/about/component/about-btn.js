import React from 'react';
import {
    Typography,
    Grid, Button, Avatar
} from '@material-ui/core'
import { Link } from 'react-router-dom';

export const AboutBtn = ({ classes, avatarUrl, to, name, role, selected }) => {

    return (
        <Button
            component={Link}
            to={to}
            style={{
                backgroundColor: selected ? 'rgba(51,51,51, 0.1)' : null
            }}
        >
            <Grid
                container 
                direction={'row'}
                justify={'flex-start'}
                alignItems={'center'}
            >
                <Avatar
                    className={classes.bigAvatar}
                    src={avatarUrl}
                />
                <div>
                    <Typography variant={'subtitle2'} >{name}</Typography>
                    <Typography variant={'caption'} >{role}</Typography>
                </div>
            </Grid>
        </Button>
    )
}

export default AboutBtn;