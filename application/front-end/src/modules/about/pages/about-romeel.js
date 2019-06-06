import React, { Component } from 'react';
import {
    withStyles,
} from '@material-ui/core'

class AboutRomeel extends Component{
    render(){

        return (
            <ul>
                <li>
                    Expected Graduation Date: Fall 2019
                </li>
                <li>
                    Programming Languages: Java, C, C++ , RDBMS
                </li>
                <li>
                    Frameworks: Angular
                </li>
            </ul>
        )
    }
}

export default withStyles({})(AboutRomeel);