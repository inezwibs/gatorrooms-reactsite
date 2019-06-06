import React from 'react';
import {
    Menu, MenuItem
} from '@material-ui/core';
import { Link } from 'react-router-dom';

/**
 * App Bar Menu just shows the items, no clicked supported.
 */
const AppBarMenu = ({ 
    items,
    open,
    onClose,
    onClick,
    anchorEl,
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
                        component={Link}
                        key={`menu-item-${index+1}`}
                        to={value.id}
                        onClick={() => {
                            if(onClick) onClick(value.id);
                        }}
                    >
                        {value.label}
                    </MenuItem>
                ))
            }
        </Menu>
    )
}

export default AppBarMenu;