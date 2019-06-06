const styles = theme => ({
 
  main:{
      ...theme.mixins.gutters(),   
    flexGrow: 1,
    margin: 20,
  },
  searchTextField:{
    width: '100%',    
    backgroundColor:'white',
  },
   menuButton: {
    marginRight: 20,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
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

  drawerMobilePaper:{
    position:'relative',
    width: '40%',
  },
  subList: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 280,
  },
  iconButton: {
    margin: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  searchButton: {
    margin: theme.spacing.unit*2,
  },
  radioGroup: {
    margin: `${theme.spacing.unit/2}px 0`,
  },
  title: {
    paddingTop: theme.spacing.unit*2,
    paddingLeft: theme.spacing.unit*2
  },
});

export default styles;