import React, { Component } from 'react';
import {
    withStyles,
} from '@material-ui/core'

class AboutMarcus extends Component{
    render(){

        return (
            <ul>
                <li>
                    Expected Graduation Date: May 2019
                </li>
                <li>
                    Programming Languages: Java, Ruby, C++
                </li>
                <li>
                    Frameworks: Rails
                </li>
            </ul>
        )
    }
}

export default withStyles({})(AboutMarcus);