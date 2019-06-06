import React, { Component } from 'react';
import {
  withStyles, Grid, Paper,
  CardActions, Button, Typography,
  Fab
} from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import ListingCard from '../../_global/component/listing-card';
import styles from '../styles/styles';
import _ from 'lodash';
import { getListings, deleteListing } from '../../../api/listings.actions';
import { Link } from 'react-router-dom';

const FormRow = ({ listings, columnView = true, refresh }) => {
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
              displayBadge={true}
              actions={(
                <CardActions>
                  <Button
                    size="small"
                    color="secondary"
                    onClick={() => deleteListing(value.id, refresh)}
                  >
                    Delete
                  </Button>
                </CardActions>
              )}
            />
          </Grid>
        ))
      }
    </React.Fragment>
  );
}

class ProfileListings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      listings: [],
      sortMenuVisible: false,
      anchorEl: null,
      sortBy: null
    };
    this.getListings = this.getListings.bind(this);
    this.handleSortTxt = this.handleSortTxt.bind(this);
    this._toggleSortMenu = this._toggleSortMenu.bind(this);
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


  getListings = (query = {}) => {
    let params = new URLSearchParams();
    params.append('profile', 'true');
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
    }, {
        'Session': JSON.parse(sessionStorage.getItem('session')).token
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
            refresh={() => this.getListings()}
          />
        </Grid>
      );
    }
    return rows;
  }

  handleSortTxt = key => {
    const { searchTxt, query } = this.state;
    this.setState({ sortBy: key }, () => this.getListings({
      ...query,
      text: searchTxt,
      sortBy: key
    }));
  };

  render() {
    const classes = this.props.classes;
    const { listings, columnView } = this.state;

    return (
      <Paper className={classes.main} elevation={1}>
        <Grid
          container
          direction={'row'}
          justify={'flex-end'}
        >
          <Fab
            variant="extended"
            color="primary"
            aria-label="Add"
            className={classes.addBtnMargin}
            component={Link}
            to={'/profile/listings/new'}
            style={{
              display: listings.length === 0 ? 'none' : 'flex',
              width: '200px'
            }}
          >
            <AddIcon className={classes.extendedIcon} />
            Add Listing
        </Fab>
        </Grid>
        <Grid container style={{ width: '100%' }} >
          <Typography className={classes.title} variant={'h5'} >Your Listings</Typography>
          <Grid item lg={12} md={12} sm={12} >
            {listings.length > 0 ?
              this.displayListings(listings, columnView) :
              <div className={classes.profileListings} >
                <Grid
                  container
                  alignItems={'center'}
                  justify={'center'}
                  direction={'column'}
                >
                  <Typography variant={'display1'} >
                    You don't have any listings posted
                </Typography>
                  <Fab
                    variant="extended"
                    color="primary"
                    aria-label="Add"
                    className={classes.margin}
                    component={Link}
                    to={'/profile/listings/new'}
                  >
                    <AddIcon className={classes.extendedIcon} />
                    Add Listing
                  </Fab>
                </Grid>
              </div>
            }
          </Grid>
        </Grid>
      </Paper>

    );
  }
}

export default withStyles(styles, { withTheme: true })(ProfileListings);