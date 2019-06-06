import React, { Component } from 'react';
import {
    withStyles,
} from '@material-ui/core'

class AboutHang extends Component{
    render(){

        return (
            <ul>
                <li>
                    Expected Graduation Date: May 2019
                </li>
                <li>
                    Programming Languages: Java, JavaScript
                </li>
                <li>
                    Frameworks: React
                </li>
            </ul>
        )
    }
}

export default withStyles({})(AboutHang);
