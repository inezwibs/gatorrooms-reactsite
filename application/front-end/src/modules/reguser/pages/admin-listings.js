import React, { Component } from 'react';
import {
  withStyles, Grid, Paper, Button,
  CardActions, Typography, Drawer,
  CssBaseline, Checkbox,
  List, ListItem, ListSubheader, ListItemText
} from '@material-ui/core';
import ListingCard from '../../_global/component/listing-card';
import styles from '../styles/styles';
import _ from 'lodash';
import { getListings, approveListing } from '../../../api/listings.actions';

const FormRow = ({ listings, columnView = true, refresh = () => {} }) => {
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
                    color="primary"
                    onClick={() => approveListing(value.id, true, refresh)}
                  >
                    Approve
                  </Button>
                  <Button
                    size="small"
                    color="secondary"
                    onClick={() => approveListing(value.id, false, refresh)}
                  >
                    Reject
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

class AdminListings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      listings: [],
      sortMenuVisible: false,
      anchorEl: null,
      sortBy: null,
      approved: null
    };
    this.getListings = this.getListings.bind(this);
    this.handleSortTxt = this.handleSortTxt.bind(this);
    this._toggleSortMenu = this._toggleSortMenu.bind(this);
  }

  _toggleSortMenu = (event) => {
    const { sortMenuVisible } = this.state;
    let state = { sortMenuVisible: !sortMenuVisible };
    if(event){
      state['anchorEl'] = event.currentTarget;
    }
    this.setState(state)
  }

  componentDidMount() {
    this.getListings();
  }

  componentDidUpdate(prevProps, prevState){
    if(prevState.approved !== this.state.approved){
      if(this.state.approved !== null){
        this.getListings({
          approved: `${this.state.approved}`
        })
      }else{
        this.getListings();
      }
    }
  }

  getListings = (query = {}) => {
    let params = new URLSearchParams();
    if (query.types && !_.isEmpty(query.types)) {
      let selectedTypes = query.types;
      selectedTypes.forEach((value) => params.append("type", value));
    }
    if(query.beds && query.beds !== '0'){
      params.append("beds", query.beds);
    }
    if(query.sortBy){
      params.append("sortBy", query.sortBy);
    }
    if(query.text){
      params.append("text", encodeURI(query.text));
    }
    if(query.approved){
      params.append("approved", query.approved);
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

  isChecked = (text) => {
    return (text === 'All' && this.state.approved === null)
      || (text === 'Approved' && this.state.approved)
      || (text === 'Not Approved' && this.state.approved === false)
  }

  selectListings = text => event =>{
    if(text === 'All'){
      this.setState({ approved: null })
    }else if(text === 'Approved'){
      this.setState({ approved: true })
    }else{
      this.setState({ approved: false })
    }
  }

  render() {
    const classes = this.props.classes;
    const { listings, columnView } = this.state;

    return (
      <Paper className={classes.main} elevation={1}>
        <Grid container style={{ width: '100%' }} >
        <Grid item lg={2} md={3} sm={3} >
            <CssBaseline />
            <Drawer
                className={classes.drawer}
                variant='permanent'
                classes={{ paper: classes.drawerPaper }}
                anchor="left"
                open
              >
                <List subheader={<ListSubheader> Admin Types</ListSubheader>} className={classes.subList}>
                    {[ 'All', 'Approved', 'Not Approved' ].map((text, index) => (
                        <ListItem button key={`item-${index}`}>
                            <Checkbox
                                checked={this.isChecked(text)}
                                onChange={this.selectListings(text)}
                            />
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
              </Drawer>
          </Grid>
          <Grid item lg={10} md={9} sm={9} >
          <Typography className={classes.title} variant={'h5'} >Admin</Typography>
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
                    No Listings To Verify
                  </Typography>
                </Grid>
              </div>
            }
          </Grid>
        </Grid>
      </Paper>

    );
  }
}

export default withStyles(styles, { withTheme: true })(AdminListings);