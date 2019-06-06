import React, { Component } from 'react';
import {
  Drawer, withStyles, CssBaseline,
  TextField, InputAdornment,
  Grid, Paper, Toolbar, Typography,
  Hidden, IconButton, Button
} from '@material-ui/core';
import {
  SearchOutlined as SearchIcon,
  ViewListOutlined as ViewListIcon,
  ViewColumnOutlined as ViewColumnIcon,
  Menu as MenuIcon,
  SortOutlined as SortIcon,
  Add as AddIcon
} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import ListingCard from '../_global/component/listing-card';
import MenuPopUp from '../_global/component/appbar-menu';
import ListingDetail from '../_global/component/listing-detail';
import qs from 'qs';
import styles from './styles/home-page';

import _ from 'lodash';
import { getListings } from '../../api/listings.actions';
import DrawerItems from './component/drawer-items';

const SORT_ACTIONS = [
  {
    id: 'newest',
    label: 'Newest'
  },
  {
    id: 'cheapest',
    label: 'Cheapest'
  },
  {
    id: 'bedrooms',
    label: 'Bedrooms'
  },
  {
    id: 'distance',
    label: 'SFSU Distance'
  }
];

const FormRow = ({ listings, columnView = true, onListingPress }) => {
  return (
    <React.Fragment>
      {
        listings.map((value, index) => (
          <Grid
            item
            lg={columnView ? 4 : 11}
            md={6}
            sm={12}
            style={{ width: '100%' }}
            key={`grid-index-${index}`}
          >
            <ListingCard
              listing={value}
              onListingPress={onListingPress}
            />
          </Grid>
        ))
      }
    </React.Fragment>
  );
}

class HomePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      listings: [],
      mobileOpen: false,
      columnView: true,
      sortMenuVisible: false,
      anchorEl: null,
      query: {},
      searchTxt: '',
      sortBy: null,
      detailId: -1
    };
    this.getListings = this.getListings.bind(this);
    this.onSearchClick = this.onSearchClick.bind(this);
    this.handleSortTxt = this.handleSortTxt.bind(this);
    this.handleSearchTxt = this.handleSearchTxt.bind(this);
    this._toggleSortMenu = this._toggleSortMenu.bind(this);
    this.onDrawerSelection = this.onDrawerSelection.bind(this);
  }

  _toggleSortMenu = (event) => {
    const { sortMenuVisible } = this.state;
    let state = { sortMenuVisible: !sortMenuVisible };
    if (event) {
      state['anchorEl'] = event.currentTarget;
    }
    this.setState(state)
  }

  componentWillMount() {
    this.getListings();
  }

  componentDidMount() {
    const params = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
    if (params.refresh) {
      // work-arround in order for a profile icon to show up after successfull
      // login
      window.history.pushState({}, document.title, "/");
      window.location.reload();
    } else if (params.logout) {
      sessionStorage.removeItem('session');
      window.history.pushState({}, document.title, "/");
      window.location.reload();
    }
  }

  onDrawerSelection = (query = {}) => {
    this.setState({ query }, () => this.getListings(query));
  }

  getListings = (query = {}) => {
    let params = new URLSearchParams();
    params.append('approved', true);
    if (query.types && !_.isEmpty(query.types)) {
      let selectedTypes = query.types;
      selectedTypes.forEach((value) => params.append("type", value));
    }
    if (query.beds && query.beds !== '0') {
      params.append("beds", query.beds);
    }
    if (query.sortBy) {
      params.append("sortBy", query.sortBy);
    }
    if (query.text) {
      params.append("text", encodeURI(query.text));
    }
    getListings(params, (data) => {
      this.setState({ listings: data || [] })
    })
  }

  displayListings = (listings, columnView) => {
    let rows = [];
    for (let i = 0; i < listings.length; i += 3) {
      rows.push(
        <Grid
          container
          key={`grid-container-${i + 1}`}
        >
          <FormRow
            listings={listings.slice(i, i + 3)}
            props={this.props}
            columnView={columnView}
            onListingPress={(id) => this.setState({ detailId: id })}
          />
        </Grid>
      );
    }
    return rows;
  }

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  onSearchClick = () => {
    const { searchTxt, query, sortBy } = this.state;
    this.getListings({
      ...query,
      text: searchTxt,
      sortBy: sortBy
    })
  }

  handleSearchTxt = event => {
    this.setState({ searchTxt: event.target.value });
  };

  handleSortTxt = key => {
    const { searchTxt, query } = this.state;
    this.setState({ sortBy: key, sortMenuVisible: false }, () => this.getListings({
      ...query,
      text: searchTxt,
      sortBy: key
    }));
  };

  render() {
    const classes = this.props.classes;
    const { listings, columnView, sortMenuVisible,
      anchorEl, searchTxt, detailId } = this.state;

    return (
      <Paper className={classes.main} elevation={1}>
        <Grid container style={{ width: '100%' }} >
          <Grid item lg={2} md={3} sm={3} >
            <CssBaseline />

            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>

            <Hidden smUp implementation="css">
              <Drawer
                variant="temporary"
                open={this.state.mobileOpen}
                onClose={this.handleDrawerToggle}
                classes={{
                  paper: classes.drawerMobilePaper,
                }}
              >
                <DrawerItems
                  onDrawerSelectionChange={(payload) => this.onDrawerSelection(payload)}
                />
              </Drawer>
            </Hidden>

            <Hidden xsDown implementation="css">
              <Drawer
                className={classes.drawer}
                variant='permanent'
                classes={{ paper: classes.drawerPaper }}
                anchor="left"
                open
              >
                <DrawerItems
                  onDrawerSelectionChange={(payload) => {
                    this.getListings(payload);
                  }}
                />
              </Drawer>
            </Hidden>
          </Grid>

          <Grid item lg={9} md={9} sm={9} >
            <Grid item lg={11}>
              <Typography
                className={classes.title}
                variant={'title'}
              >
                Welcome to GatorRooms. Where SFSU students find and list housing rentals.
              </Typography>
              <Hidden xsDown implementation="css">
                <Toolbar className={classes.searchSection}>
                  <TextField
                    label="Listing Search"
                    inputProps={{maxLength: 40}}
                    className={classes.searchTextField}
                    name="listingSearch"
                    value={searchTxt}
                    onChange={this.handleSearchTxt}
                    placeholder={'Enter city or state or zip code '}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                  <Button
                    color="primary"
                    size="small"
                    variant="contained"
                    className={classes.searchButton}
                    onClick={this.onSearchClick}
                  >
                    Search
                </Button>
                  <div>
                    <IconButton
                      aria-label="Sort"
                      label={'Sort'}
                      className={classes.iconButton}
                      onClick={this._toggleSortMenu}
                    >
                      <SortIcon fontSize={'large'} />
                    </IconButton>
                    <MenuPopUp
                      items={SORT_ACTIONS}
                      anchorEl={anchorEl}
                      open={sortMenuVisible}
                      onClose={this._toggleSortMenu}
                      onItemClick={(itemId) => this.handleSortTxt(itemId)}
                    />
                  </div>
                  {/* <IconButton
                    aria-label="Grid-View"
                    className={classes.iconButton}
                    onClick={() => this.setState({ columnView: !columnView })}
                  >
                    {columnView ?
                      <ViewColumnIcon fontSize="large" /> :
                      <ViewListIcon fontSize="large" />
                    }
                  </IconButton> */}
                  <Button 
                    variant="contained"
                    color="primary"
                    style={{ width: '250px' }}
                    className={classes.rightIcon}
                    component={Link}
                    to={'/profile/listings/new'}
                  >
                    New Listing
                    <AddIcon className={classes.rightIcon} />
                  </Button>
                </Toolbar>
              </Hidden>
            </Grid>
            {
              listings.length > 0 ?
                this.displayListings(listings, columnView) :
                <Grid
                  container
                  alignItems={'center'}
                  justify={'center'}
                >
                  <Typography variant={'display2'} >
                    No Listings Found
                  </Typography>
                </Grid>
            }
          </Grid>
        </Grid>
        <ListingDetail
          open={detailId !== -1}
          listingId={detailId}
          onClose={() => this.setState({ detailId: -1 })}
        />
      </Paper>

    );
  }
}

export default withStyles(styles, { withTheme: true })(HomePage);