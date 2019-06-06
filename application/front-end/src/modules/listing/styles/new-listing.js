const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: 50,
    width: '60%',
   	marginLeft: '15%',
    paddingBottom: 100,
  },

  card: {
    maxWidth: 400,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
    zIndex:-1,
  },
  gridList: {
    width: '100%',
    backgroundColor:'grey',

  },
  inputs:{
    display:'flex',
    alignItems: 'flex-start',
    paddingTop: 80,
  },
   actions: {
    display: 'flex',
    zIndex:1000,
  },
   icon: {
    margin: theme.spacing.unit,
    fontSize: 32,
    color:'white',
  },

  userNote:{
    alignItems: 'center',
  },
  fileInput:{
    padding: 10,
    border: 10,
    backgroundColor: 'lightgrey',
    margin:20,
  },
  hide:{
   display: 'none'
  },
  margin:{
    margin:0,
  }
});

export default styles;