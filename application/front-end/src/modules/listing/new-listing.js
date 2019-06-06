import React, { Component } from 'react';

import {
  TextField, FormGroup, FormControl,
  Paper, withStyles,Typography, Grid,
  Divider, InputLabel, Select, OutlinedInput,
  Card, CardMedia, IconButton, GridListTileBar,
  GridList, GridListTile
} from '@material-ui/core';

import styles from './styles/new-listing';
import Button from '@material-ui/core/Button';
import { Redirect } from 'react-router-dom';

//use axios for posting 
import { createPosting } from '../../api/listings.actions';

//image preview stuff
import DeleteForeverSharpIcon from '@material-ui/icons/DeleteForeverSharp';

// https://stackoverflow.com/questions/36280818/how-to-convert-file-to-base64-in-javascript

class NewListing extends Component{
  
  constructor(props){
    super(props);
    this.state = {
      form: {
        images: [],        
        address: {}
      },
      imagesPreviews:[],
      submitSuccess: false
    }
    this.addFile = this.addFile.bind(this);
    this.onResetClick = this.onResetClick.bind(this);
    this.onSubmitClick = this.onSubmitClick.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.inputIsValid = this.inputIsValid.bind(this);
    this.removeImage = this.removeImage.bind(this);
  }

  addFile = event => {
    let { form } = this.state;
    let files = Array.from(event.target.files);

    for(let i = 0; i < files.length; i++){
         this.state.imagesPreviews.push(URL.createObjectURL(files[i]));
         this.getBase64(files[i])
          .then((data) => {
            let encoded = data.replace(/^data:(.*;base64,)?/, '');     
            form.images.push(encoded);
          });
    }
    this.setState({ form: form });
  }; 

  inputIsValid=(name,value)=>{
    console.log(this.state.form);
    if(['price','zipcode'].includes(name.toLowerCase())){
      if(/[a-zA-Z]/.test(value)){
        alert(`${name} only contains letters`);
        return false;
      }
    }
   return true;
  }

  handleFormChange = name => ({target: {value}}) => {   
    this.setState({ 
      form:{
        ...this.state.form,
        [name]: value 
      } 
    });

    if(!this.inputIsValid(name,value)){     
     this.setState({ 
      form:{
        ...this.state.form,
        [name]: value.slice(0, value.length-1)
      } 
    });
    }
  };

  handleAddressChange = name => ({target: {value}}) => {    
    const { form } = this.state
    form.address[name] = value;
    this.setState({ form: form });

    if(!this.inputIsValid(name,value)){ 
      form.address[name] = value.slice(0, value.length-1);
      this.setState({ form: form });
    }    
  };

  getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  onSubmitClick = () => {
      const { form } = this.state;

      if(Object.keys(form).length !== 8){
       alert('you must fill out all form fields');
      }else{
       createPosting(form, () => {
         //if response is good then redirect-render new page
         this.setState({ submitSuccess: true })
       })
      }
  };

  onResetClick = () => {
    this.setState({
      form: {
        address: {},
        images: []
      },
      imagesPreviews:[],
    })
  }

removeImage =(imageIndex) => {  
  this.state.imagesPreviews.splice(imageIndex,1);
  console.log(this.state.imagesPreviews)
  this.forceUpdate();
}

  render(){

  const { form, submitSuccess } = this.state;
  const { classes } = this.props;
  
  let previews = this.state.imagesPreviews.map((image,imageIndex) => {
    let index=parseInt(imageIndex);
     return (
        <GridListTile 
           key={"preview image " + index} 
           cols={1} 
           style={{ height: 'auto' }}
        >
           <Card className={classes.card}>         
             <CardMedia
               className={classes.media}
               image= {image}
               alt= {"previewImage" + index}  
               title={"Uploaded Image " + index} 
             />              
           </Card>

           <GridListTileBar
              actionIcon={
                 <IconButton className={classes.deletePreview} onClick={() => this.removeImage(imageIndex)}>
                    <DeleteForeverSharpIcon className={classes.icon} />
                 </IconButton>
              }
           />
        </GridListTile>

     );
   }); 

   if(submitSuccess){
     return <Redirect to={'/profile/listings'} />
   }
   
   return(
    <div>
    <Paper className={classes.root}>
      <Typography 
       variant="h5" 
       component="h3"
      >
          Create New Listing
      </Typography>
     
       <FormGroup className={classes.formGroup} >
          <FormControl>
           <TextField
             label="Title"
             value={form.title}
             onChange={this.handleFormChange('title')}             
             margin="normal"
           />

         </FormControl>

         <FormControl>
           <TextField
             label="Price"
             value={form.price}
             onChange={this.handleFormChange('price')}
             margin="normal"
           />
         </FormControl>

         <FormControl>
           <TextField
             label="Address"
             value={form.address.line1}
             onChange={this.handleAddressChange('line1')}
             margin="normal"
           />
         </FormControl>


         <FormControl>
           <TextField
             label="City"
             value={form.address.city}
             onChange={this.handleAddressChange('city')}
             margin="normal"
           />
         </FormControl>


         <FormControl>
           <TextField
             label="State"
             value={form.address.state}
             onChange={this.handleAddressChange('state')}
             margin="normal"
           />
         </FormControl>

         <FormControl>
           <TextField
             label="Zip"
             value={form.address.zipCode}
             onChange={this.handleAddressChange('zipCode')}
             margin="normal"
           />
         </FormControl>

         <FormControl>
           <TextField
             multiline
             rows="6"
             label="Description"
             value={form.description}
             onChange={this.handleFormChange('description')}
             margin="normal"
           />
         </FormControl>

          <br /> 
          <FormControl variant="outlined">
             <InputLabel
               ref={ref => {
                 this.InputLabelRef = ref;
               }}
             >
               Housing Type
             </InputLabel>
             <Select
               native
               value={form.housingType}
               onChange={this.handleFormChange('housingType')}
               input={
                 <OutlinedInput
                   name="Housing Type"              
                   id="outlined-age-native-simple"
                   labelWidth={'Housing Type'.length}
                 />
               }
             >
               <option value="" />
               <option value={"Apartment"}>Apartment</option>
               <option value={"House"}>House</option>
               <option value={"Room"}>Room</option>
               <option value={"Studio"}>Studio</option>
               <option value={"Townhome"}>Townhome</option>

             </Select>  
          </FormControl>


          <br />
          <FormControl variant="outlined">
             <InputLabel
               ref={ref => {
                 this.InputLabelRef = ref;
               }}
               htmlFor="outlined-age-native-simple"
             >
              Bed rooms
             </InputLabel>
             <Select
               native
               value={form.bedrooms}
               onChange={this.handleFormChange('bedrooms')}
               input={
                 <OutlinedInput
                   name="bedrooms"              
                   id="outlined-age-native-simple"
                   labelWidth={'bedrooms'.length}
                 />
               }
             >
               <option value="" />
               <option value={1}>1</option>
               <option value={2}>2</option>
               <option value={3}>3</option>
             </Select>  
          </FormControl>

          <br />
          <FormControl variant="outlined">
             <InputLabel
               ref={ref => {
                 this.InputLabelRef = ref;
               }}
               htmlFor="outlined-age-native-simple"
             >
               Bathrooms
             </InputLabel>
             <Select
               native
               value={form.bathrooms}
               onChange={this.handleFormChange('bathrooms')}
               input={
                 <OutlinedInput
                   name="bathrooms"              
                   id="outlined-age-native-simple"
                   labelWidth={'bathrooms'.length}
                 />
               }
             >
               <option value="" />
               <option value={1}>1</option>
               <option value={2}>2</option>
               <option value={3}>3</option>
             </Select>  
          </FormControl>


  

        
         <FormControl>             
          <Grid container justify = "center">
              <input                 
                id="fileInput"    
                multiple 
                type="file" 
                onChange={this.addFile}
                accept="image/png, image/jpeg"    
                className={classes.hide}                  
              /> 
              <label htmlFor="fileInput"> 
                <Button raised 
                  component="span" 
                 className={classes.fileInput}
                 > 
                  + Upload Images
                </Button> 
              </label> 
            </Grid>
          </FormControl>


         <GridList cellHeight={160} className={classes.gridList} cols={3}>
          {previews}
          </GridList>

           <Divider light />
          <Grid 
           className={classes.inputs}
           container
           justify = "center"
           >
    

           <Grid item  md={12} lg={12} xs={12}>
           <Button
              variant="contained"
        
              color="primary"
              onClick={this.onSubmitClick}
              fullWidth
            >
             SUBMIT
            </Button> 
            </Grid>
            </Grid> 
       </FormGroup>              
     </Paper>           
      
        <Paper classes={classes.userNote}>
        <Typography        
         variant="display2"
         align="center"          
         >
          Listings may take up to 24 hours to process  
        </Typography>
      
        </Paper>      
        </div>
   );
  }
}

export default withStyles(styles, { withTheme: true })(NewListing);
