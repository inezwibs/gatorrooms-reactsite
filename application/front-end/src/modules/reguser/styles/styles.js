const styles = theme => ({
  textField: {
    marginLeft: 30,
    marginRight: 100,
  },
  button: {
    marginTop: 20,
    marginRight: 30
  },
  imgCard: {
    width: 200,
    height: 200,
    marginLeft: 150
  },
  ml: {
    marginLeft: 20
  },
  justContent: {
    justifyContent: 'center'
  },
  profileListings: {
    margin: theme.spacing.unit * 5
  },
  margin: {
    margin: theme.spacing.unit * 3,
  },
  addBtnMargin: {
    margin: theme.spacing.unit * 1,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
  title: {
    padding: theme.spacing.unit * 3
  },
  drawer: {
    flexGrow: 1,
     [theme.breakpoints.up('sm')]: {      
      flexShrink: 0,
    },   
  },
  drawerPaper: {    
    position:'relative',
    height: '100%',
  },
  subList: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 280,
  },
});

export default styles;