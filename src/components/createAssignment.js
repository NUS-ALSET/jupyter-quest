import React, {Component} from 'react'
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import { FormControl, FormHelperText,FormControlLabel, FormLabel } from 'material-ui/Form';
import Radio, { RadioGroup } from 'material-ui/Radio';
import PropTypes from 'prop-types'
import TextField from 'material-ui/TextField';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import Input, { InputLabel } from 'material-ui/Input';
import readJson from '../helpers/readJson.js';

import PathProblem from './assignments/problems'

const styles = theme => ({
    container: {
      display: 'inline-block',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 400,
    },
    menu: {
      width: 200,
    },
    input: {
      display: 'none',
    },
    block:{
      display: 'inline-block',
    },
    formControl: {
      margin: theme.spacing.unit,
      minWidth: 0,
      width:'100%',
    },
    selectEmpty: {
      marginTop: theme.spacing.unit * 2,
    },
  });
let isActive
class CreateAssignment extends Component {
    constructor(props) {
        super(props)
        this.state={
            name:'',
            desc:'',
            value: '',
            path: '',
            text:'',
            answerType:1,                                                                         type:'shortAnswer',
            uploadedProblem:null,
            type : "ShortAnswer",
            problem:''
            }
        this.handleInput=this.handleInput.bind(this)
        }
    
        handleInput(e){
          this.setState({[e.target.name]:e.target.value});
          if(e.target.name==='path'){
            this.setState({problem:''});
          }
        }

        handleChange = (event, value) => {
          this.setState({ value });
          if(value==='Notebook'){
            this.setState({answerType:2, type:'Notebook'});
          } else{
            this.setState({answerType:1, type:'ShortAnswer'});
          }
        };
        
        fileHandle = (e) => {
          readJson(e.target.files[0], (data) => {
            this.setState({"uploadedProblem":data});
          })
        }

        // fileLoader=()=>{
        //   let file = document.getElementById('raised-button-file').value
        //  let fileExt= file.split('.').pop()
        //  if(fileExt=='json')
        //   console.log(fileExt," fileExt matched.........")
        //   else
        //   console.log("fileExt no match")
        // }

    render() {
        const {classes, handleClose, handleSubmit,nameRequired,descRequired,textRequired,pathRequired,problemRequired}  = this.props;
        const { name, desc, path, problem,text, answerType, type } = this.state;
        if(answerType===1)
        isActive=true
        else
        isActive=false
        let {assignmentPath}=this.props;
        assignmentPath=assignmentPath.filter(path=>path.value.problems);
        return (
            <div className={classes.container} >
            <h2>CREATE ASSIGNMENT</h2>
            <br />
            <div className={classes.root}>
        <FormControl component="fieldset" required error>
          <FormLabel component="legend">Type of Question</FormLabel>
          <RadioGroup
            aria-label="question"
            name="question1"
            value={this.state.value}
            onChange={this.handleChange}
            className={classes.block}
          >
            <FormControlLabel value="Short Answer" control={<Radio checked={answerType === 1} />} label="Short Answer"  />
            <FormControlLabel value="Notebook" control={<Radio checked={answerType === 2} />} label="Notebook" />
          </RadioGroup>
        </FormControl>
      </div>
            <br />
             Name
            <div>
              <TextField 
                  className={classes.textField}
               name="name" value={this.state.name}
                onChange={this.handleInput}/><br />
         { nameRequired && <FormHelperText className="error-text">Name Required</FormHelperText>}
            </div>
              Details/Links
            <div>
              <TextField
                  className={classes.textField}
               name="desc" value={this.state.desc}
              onChange={this.handleInput}/>
         { descRequired && <FormHelperText className="error-text">Description Required</FormHelperText>}
            </div>
           {isActive && <div>
              Text
            <div>
              <TextField
                  className={classes.textField}
               name="text" value={this.state.text}
              onChange={this.handleInput}/>
         { textRequired && <FormHelperText className="error-text">Text Required</FormHelperText>}
            </div>
            </div>}
         { !isActive && <div> 
         <FormControl className={classes.formControl}>
            <InputLabel htmlFor="age-simple">Choose Path</InputLabel>
            <Select
            value={this.state.path}
            onChange={this.handleInput}
            input={<Input name="path" id="path" />}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {assignmentPath && assignmentPath.map((path,index)=>
            <MenuItem key={index} value={path.key} >{path.value.title}</MenuItem>
            )}
          </Select>
        { pathRequired && <FormHelperText className="error-text">Path Required</FormHelperText>}
           </FormControl> 
          {path && <PathProblem pathId={path} problem={problem} handleInput={(e)=>this.handleInput(e)} problemRequired={problemRequired} />}
         </div>
          }
            <div>
            <br/>
              <Button raised color="primary" type="submit" onClick={() =>{handleSubmit({ name, desc, path, problem ,text, type })}} >Submit</Button>
              <Button className="cancelBtn" 
              raised color="default" onClick={()=>handleClose()}>Cancel</Button>
            </div>
        </div>
        )
    }
}

CreateAssignment.propTypes = {
    classes: PropTypes.object.isRequired,
    isCourseActive: PropTypes.string,
    handleClose: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired 
  }
  
  export default withStyles(styles)(CreateAssignment)