import React from 'react';
import {
    Menu, MenuItem
} from '@material-ui/core';

/**
 * A PopUp menu with click which is used to display the actions.
 * Like for Sorting ( by distance, newest ... )
 * Also this allows handle the click
 */
const AppBarMenu = ({ 
    items,
    open,
    onClose,
    anchorEl,
    onItemClick
}) => {
    return (
        <Menu
            id="menu-appbar"
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
        >
            {
                items.map((value, index) => (
                    <MenuItem 
                        key={`menu-item-${index+1}`}
                        onClick={() => onItemClick(value.id)}
                        to={value.id}
                    >
                        {value.label}
                    </MenuItem>
                ))
            }
        </Menu>
    )
}

export default AppBarMenu;