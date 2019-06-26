import React from 'react';
import './App.css';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { Grid } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

const styles = theme => ( {
  root: {
    flexGrow: 1,
  },
  button: {
    margin: theme.spacing(1),
  },
  card: {
    minWidth: 800,
  },
  list: {
    flexGrow: 1,
  }
});
class App extends React.Component {
  constructor(props){
    super(props);
    this.handleLoad = this.handleLoad.bind(this);
    this.state = {
      orders:[],
      order_no:0,
      open: false,
      client_name:"",
      driver_name:"",
      driver_status: "Booking Recieved",
      update: false,
      current_id: ""
    }
    this.handleClickOpen=this.handleClickOpen.bind(this);
    this.handleClose=this.handleClose.bind(this);
    this.handleChange=this.handleChange.bind(this);
    this.handleBook = this.handleBook.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }
  componentDidMount() {
    window.addEventListener('load', this.handleLoad);
  }

 handleLoad() {
  axios.get("http://localhost:3000/events/").then((response)=>{
    this.setState({
      orders: response.data.orders,
      order_no: response.data.count,
    });
  });
 }

 handleChange(event, newValue) {          
  this.setState({
    [event.target.name]: newValue
  });
}

handleClickOpen() {
  this.setState({
    open: true
  });
}

handleClose() {
  this.setState({
    open: false
  });
}

handleBook(){
  const data = {
    "client":this.state.client_name,
    "driver": this.state.driver_name,
    "driver_status": this.state.driver_status
  }
  axios.post("http://localhost:3000/events/", data).then((response)=>{
    alert("Added new order");  
    this.handleLoad();
  });
  this.setState({
    open: false,
    client_name: "",
    driver: "",
    driver_status: "Booking Recieved"
  });
}

handleDelete(id){
  axios.delete("http://localhost:3000/events/"+id).then((res)=>{
    alert("Deleted the order");
    this.handleLoad();
  });
}

handleStatusUpdate(status,id){
  const body=[{
    "propName": "driver_status", value: status
  }]
  axios.patch("http://localhost:3000/events/"+id, body).then(()=>{
    this.setState({
      update:false
    });
    this.handleLoad();
  })
}

  render() {
    const { classes } = this.props;
    return (
      <div className="App">
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="h6" color="inherit">
              LT Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
        <Button variant="contained" color="primary" className={classes.button}  onClick={this.handleClickOpen}>
          NEW
        </Button>
        <div>
        
        <List className={classes.list}>
          {this.state.orders.map(value => (
            <ListItem key={value._id}>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                >
              <Card className={classes.card}>
                <CardContent>
              <Typography className={classes.title} color="textPrimary">
                   Client Name: {value.client}
                </Typography>
                <Typography className={classes.title} color="textPrimary">
                   Driver Name: {value.driver}
                </Typography>
                <Typography className={classes.title} color="textPrimary">
                   Status: {value.driver_status}
                </Typography>
                </CardContent>
                <CardActions>
                <Grid
                  container
                  direction="row"
                  justify="flex-end"
                  alignItems="center">
                  <Button variant="contained" className={classes.button} onClick={()=>{
                    this.setState({
                      update: true,
                      current_id: value._id
                    });
                  }}>
                   Update Status
                  </Button>
                  <IconButton aria-label="Delete" className={classes.margin} onClick={() => this.handleDelete(value._id)}>
                  <DeleteIcon fontSize="small" />
                  </IconButton>
                  </Grid>
                </CardActions>
              </Card>
              </Grid>
            </ListItem>
          ))}
        </List>

        <Dialog open={this.state.open} onClose={this.handleClose}  aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Enter Order Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the details below
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="client_name"
            label="Client Name"
            type="text"
            fullWidth
            value={this.state.client_name}
            onChange={e => this.setState({ client_name: e.target.value })}
          />
          <TextField
            autoFocus
            margin="dense"
            id="driver_name"
            label="Driver Name"
            type="text"
            fullWidth
            value={this.state.driver_name}
            onChange={e => this.setState({ driver_name: e.target.value })}
          />
          <TextField
            autoFocus
            margin="dense"
            id="driver_status"
            label="Status"
            type="text"
            fullWidth
            value={this.state.driver_status}
            onChange={e => this.setState({ driver_status: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleBook} color="primary">
            Book Order
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={this.state.update} >
      <DialogTitle id="form-dialog-title">Update The Status</DialogTitle>
          <Button onClick={()=> this.handleStatusUpdate("Booking Recieved", this.state.current_id)} color="primary">
            BOOKING RECIEVED
          </Button>
          <Button onClick={()=> this.handleStatusUpdate("Looking for Drivers", this.state.current_id)} color="primary">
            LOOKING FOR DRIVERS
          </Button>
          <Button onClick={()=> this.handleStatusUpdate("Confirmed from Drivers", this.state.current_id)} color="primary">
            CONFIRMED FROM DRIVER 
          </Button>
          <Button onClick={()=> this.handleStatusUpdate("Booked", this.state.current_id)} color="primary">
            BOOKED
          </Button>
      </Dialog>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
