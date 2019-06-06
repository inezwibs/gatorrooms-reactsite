const basePath = () => {
  let path = window.location.pathname;
  let index = path.substring(1, path.length).indexOf('/');
  let suffix = "";
  if (index > 1){
    suffix = path.substring(0, index+1);
  }
  return suffix;
}

const config = () => {
  let environment;
  if (`${process.env.REACT_APP_PRODUCTION}` === 'true'){
    let suffix = basePath();
    environment = window.location.host + suffix;
  }else{
    environment = "localhost:5000";
  }
  return environment;
};

export default {
  environment: config(),
  suffix: basePath()
}