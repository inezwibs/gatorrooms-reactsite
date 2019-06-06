import React from 'react';
import PropTypes from 'prop-types';
import {    
    Divider, Checkbox, withStyles,
    List, ListItem, ListItemText, ListSubheader, 
    Radio, RadioGroup, FormControlLabel
} from '@material-ui/core';
import { getHouseTypes } from '../../../api/listings.actions';
import styles from '../styles/home-page';
import _ from 'lodash';

class DrawerItems extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            types: ['All'], // All by default, other types will come from DB.
            paramaters: {
                types: [], // Empty means all
                beds: '0'
            }
          };
          this.isChecked = this.isChecked.bind(this);
          this.getHousingTypes = this.getHousingTypes.bind(this);
          this.selectHousingType = this.selectHousingType.bind(this);
    }

    componentWillMount() {
        this.getHousingTypes();
    }

    getHousingTypes = () => {
        let { types } = this.state;
        getHouseTypes((data) => {
            types = types.concat(
                data.map((value) => _.capitalize(value.type))
            );
            this.setState({ types: types })
        })
    }

    selectHousingType = type => event => {
        const { onDrawerSelectionChange } = this.props;
        let { paramaters } = this.state;
        if (type === 'All') {
          paramaters['types'] = [];  
          this.setState({ paramaters }, () => {
            onDrawerSelectionChange(paramaters);
          });
        } else {
          if (event.target.checked) paramaters.types.push(type);
          else _.remove(paramaters.types, (i) => i === type);
          this.setState({ paramaters }, () => {
            onDrawerSelectionChange(paramaters);
          });
        }
      };
    
      isChecked = (text) => {
        return (text === 'All' && _.isEmpty(this.state.paramaters.types))
          || this.state.paramaters.types.includes(text);
      }

      _handleBedsSelection = event => {
        let { paramaters } = this.state;
        const { onDrawerSelectionChange } = this.props;
        paramaters['beds'] = event.target.value
        this.setState({ paramaters }, () => {
            onDrawerSelectionChange(paramaters);
          });
      };

    render(){
        const { classes } = this.props;
        const { types, paramaters } = this.state;
        return (
            <React.Fragment>
                <List subheader={<ListSubheader> Housing Types</ListSubheader>} className={classes.subList}>
                    {types.map((text, index) => (
                        <ListItem button key={`item-${index}`}>
                            <Checkbox
                                checked={this.isChecked(text)}
                                onChange={this.selectHousingType(text)}
                            />
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List subheader={<ListSubheader>Beds</ListSubheader>} className={classes.subList}>
                    <RadioGroup
                        aria-label="Beds"
                        value={paramaters.beds}
                        onChange={this._handleBedsSelection}
                    >
                        <FormControlLabel value="0" control={<Radio />} label="0+" />
                        <FormControlLabel value="1" control={<Radio />} label="1+" />
                        <FormControlLabel value="2" control={<Radio />} label="2+" />
                    </RadioGroup>    
                </List>
                <Divider />
            </React.Fragment>
        )
    }
}

DrawerItems.propTypes = {
    onDrawerSelectionChange: PropTypes.func.isRequired
}

export default withStyles(styles, { withTheme: true })(DrawerItems);