import React, { Component } from 'react';
import {
    withStyles,
} from '@material-ui/core'

class AboutInez extends Component{
    render(){

        return (
            <ul>
            <li>
            Expected Graduation Date: December 2019
        </li>
        <li>
        Programming Languages: Java, Python, C
        </li>
        <li>
        Frameworks: React
        </li>
        </ul>
    )
    }
}

export default withStyles({})(AboutInez);