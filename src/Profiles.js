import React, {useState, useEffect} from 'react';
import { 
    Grid, 
    Typography, 
    Card,
    CardContent, 
    Paper,
    Stack,
    Chip,
    Avatar,
    List, 
    ListItem,
    ListItemText,
    ListItemAvatar,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField  } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import axios from "axios";

import './style.css';
import { NearMeDisabledOutlined } from '@mui/icons-material';


const Profiles = props => {
    const [stateObj, setStateObj] = useState({ data: null, name: '', tag: '' });
    const [filterList, setFilterList] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const [tag, setTag] = useState({key: null, val: null, id: null});
    const [label, setLabel] = useState([]);

    const url = 'https://api.hatchways.io/assessment/students';

    async function fetchData() { 
       let res = await axios.get(url);
       let { data } = res;
       setStateObj({ ...stateObj, data: data });
    };

    useEffect(() => {
       fetchData();
    }, []);


    const name = (first, last) => 
        <Typography
            component="p"
            variant="h5"
            style={{fontWeight: 'bold'}}
            color="text.primary"
        >
            {first+' '+last}
        </Typography>;

    const averageScore = scores => {
        let average;
        let sum = 0;
        for(const i in scores) 
            sum = sum + parseInt(scores[i]);
        average = sum/scores.length;
        return average;
    };

    const filterName = e => {
       
       let keyword = e.target.value;
       if(keyword !== '') {
          const filterStudents = stateObj.data.students.filter( item => {
            return(item.firstName.toLowerCase().startsWith(keyword.toLowerCase()) || item.lastName.toLowerCase().startsWith(keyword.toLowerCase()));
          });
        setFilterList(filterStudents);
       }else  setFilterList(null);
    };

    const matchId = (id, temp) => {
      temp.map(i=> {
        if(id==i.id)
         return true;
      });
      return false;
    }

    const filterTag = e => {

      let keyword = e.target.value;
      if(keyword !== '') {
        if(filterList!=null) {
          let temp = [];
          for(const i in label) {
            if(label.length>0) {
              if(label[i].val.startsWith(keyword)){
                temp.push({id: label[i].id, val: label[i].val});
              }
            }
          }

          const filterStudents = filterList.filter( item => {
            return matchId(item.id, temp);
          });
          setFilterList(filterStudents);
        }else {
          let temp = [];
          for(const i in label) {
            if(label.length>0) {
              if(label[i].val.startsWith(keyword)){
                temp.push({id: label[i].id, val: label[i].val});
              }
            }
          }

          const filterStudents = stateObj.data.students.filter( item => matchId(item.id, temp));
          setFilterList(filterStudents);
        }
      }else setFilterList(null);
    };

    const info = (email, company, skill, grades) =>
      <React.Fragment>
        <Typography
            component="p"
            variant="body2"
            color="text.primary"
            sx={{fontFamily: "'Raleway', sans-serif", fontWeight: 'bold'}}
        >
            Email: {email}
        </Typography>
        <Typography
            component="p"
            variant="body2"
            color="text.primary"
            sx={{fontFamily: "'Raleway', sans-serif", fontWeight: 'bold'}}
        >
            Company: {company}
        </Typography>
        <Typography
            component="p"
            variant="body2"
            color="text.primary"
            sx={{fontFamily: "'Raleway', sans-serif", fontWeight: 'bold'}}
        >
            Skill: {skill}
        </Typography>
        <Typography
            component="p"
            variant="body2"
            color="text.primary"
            sx={{fontFamily: "'Raleway', sans-serif", fontWeight: 'bold'}}
        >
            Average: {averageScore(grades)}%
        </Typography>
      </React.Fragment>;

    const scores = grades => 

      <div style={{ width: '50%', paddingLeft: 75, paddingTop: 0, display: 'flex', flexDirection: 'column', justifyContent: 'start'}}>
        {grades.map((val, index) => 
            <Typography
                component="p"
                variant="body2"
                color="text.primary"  
            >
              Test{index+1}:  {parseInt(val)}%
            </Typography>
        )}
      </div>;
    
    const handleExpand = panel => (e, isExpanded) => {
      console.log({ e, isExpanded });
      setExpanded(isExpanded? panel:false);
    };

    const handleChange = (index,id,e) => {
      let value = e.target.value;
      setTag({...tag, key: index, val: value, id: id});
    };

    const handleBlur = () => {
      let temp = label; 
      (tag.key!=null) && temp.push({key: tag.key, val: tag.val, id: tag.id});
      setLabel(temp);
      setTag({key: null, val: null, id: null});
    };

    const handleKeyPress = e => {
      if(e.key === 'Enter') {
        let temp = label; 
        (tag.key!=null) && temp.push({key: tag.key, val: tag.val, id: tag.id});
        setLabel(temp);
        setTag({key: null, val: null, id: null});
      };
    };
  

    return (
      <div className="wrapper">
        <Grid className="grid" container space={2} direction="row" justifyContent="center">
          <Paper className="paper">
          <Card className="cardWrapper">
            <CardContent>
              <TextField 
                id="name" 
                placeholder="Search by name" 
                variant="standard" 
                sx={{width: '100%', marginBottom: 2}}
                onChange={filterName}
              />
              <TextField 
                id="tag" 
                placeholder="Search by tag" 
                variant="standard" 
                sx={{width: '100%'}} 
                onChange={filterTag} 
              />
              { stateObj.data!=null? (filterList&&filterList.length > 0? 
                filterList.map((item,index) =>  <React.Fragment>
                 <Accordion elevation={0} expanded={expanded === `panel${index+1}`} onChange={handleExpand(`panel${index+1}`)}>
                  <AccordionSummary
                    expandIcon={expanded === `panel${index+1}`? <RemoveIcon />:<AddIcon />}
                    aria-controls="panel1a-content"
                  >
                  <List sx={{ width: '100%' }}>
                   <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                     <Avatar
                        alt={item.firstName+' '+item.lastName}
                        src={item.pic}
                        sx={{ width: 83, 
                              height: 75, 
                              border: 1,
                              borderColor: '#d9d9d9' }}
                     />  
                    </ListItemAvatar>
                    <ListItemText 
                        sx={{ marginLeft: 8 }}
                        primary={name(item.firstName.toUpperCase(),item.lastName.toUpperCase())}
                        secondary={info(item.email, item.company, item.skill, item.grades)}
                    />
                    
                    </ListItem>           
                  </List>
                  </AccordionSummary>
                  <AccordionDetails sx={{ display: 'flex', flexDireaction: 'column', justifyContent: 'center'}}>
                    {scores(item.grades)}
                  </AccordionDetails>
                  
                 </Accordion>
                 <div style={{marginLeft: 182, marginBottom: 18}}>
                 <Stack direction="row" spacing={1}>
                  {label.length>0?  
                      (label.map(el => {
                        if(el.key==index)
                         return <Chip label={el.val} sx={{borderRadius: 1, backgroundColor: '#d6d6d6'}} />;
                      }))
                      :null}
                 </Stack>
                 <TextField 
                    className="add tag" 
                    placeholder="Add tag" 
                    variant="standard" 
                    sx={{width: 70}}
                    value={tag.key!=null? (tag.key==index? tag.val:null):''}
                    onChange={(e)=>handleChange(index,item.id,e)}
                    onBlur={handleBlur}
                    onKeyPress={handleKeyPress} 
                 /> 
                 </div>
                 </React.Fragment>
                ) :  stateObj.data.students.map((item,index) => <React.Fragment>
                 <Accordion elevation={0} expanded={expanded === `panel${index+1}`} onChange={handleExpand(`panel${index+1}`)}>
                  <AccordionSummary
                    expandIcon={expanded === `panel${index+1}`? <RemoveIcon />:<AddIcon />}
                    aria-controls="panel1a-content"
                  >
                  <List sx={{ width: '100%' }}>
                   <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                     <Avatar
                        alt={item.firstName+' '+item.lastName}
                        src={item.pic}
                        sx={{ width: 83, 
                              height: 75, 
                              border: 1,
                              borderColor: '#d9d9d9' }}
                     />  
                    </ListItemAvatar>
                    <ListItemText 
                        sx={{ marginLeft: 8}}
                        primary={name(item.firstName.toUpperCase(),item.lastName.toUpperCase())}
                        secondary={info(item.email, item.company, item.skill, item.grades)}
                    />
                   </ListItem>           
                  </List>
                  </AccordionSummary>
                  <AccordionDetails sx={{ display: 'flex', flexDireaction: 'column', justifyContent: 'center'}}>
                    {scores(item.grades)}
                  </AccordionDetails>
                 </Accordion>
                 <div style={{marginLeft: 182, marginBottom: 18}}>
                 <Stack direction="row" spacing={1}>
                    {label.length>0?  
                      (label.map(el => {
                        if(el.key==index)
                         return <Chip label={el.val} sx={{borderRadius: 1, backgroundColor: '#d6d6d6'}}/>;
                      }))
                      :null}
                 </Stack>
                 <TextField 
                    className="add tag" 
                    placeholder="Add tag" 
                    variant="standard" 
                    sx={{width: 70}} 
                    value={tag.key!=null? (tag.key==index? tag.val:null):''}
                    onChange={(e)=>handleChange(index,item.id,e)}
                    onBlur={handleBlur}
                    onKeyPress={handleKeyPress} 
                 /> 
                 </div>
                 </React.Fragment>              
                )
              
                ):null}
            </CardContent>  
          </Card>
         </Paper>
        </Grid>
      </div>
    );
}

export default Profiles;