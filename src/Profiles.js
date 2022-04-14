import React, {useState, useEffect} from 'react';
import { 
    Grid, 
    Typography, 
    Card,
    CardContent, 
    Paper,
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


const Profiles = props => {
    const [stateObj, setStateObj] = useState({ data: null, name: '', tag: [] });
    const [filterList, setFilterList] = useState(null);
    const [expanded, setExpanded] = useState(false);

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
            variant="h4"
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

    const filterTag = e => {
       setStateObj({...stateObj})
    };

    const info = (email, company, skill, grades) =>
      <React.Fragment>
        <Typography
            component="p"
            variant="body2"
            color="text.primary"
        >
            Email: {email}
        </Typography>
        <Typography
            component="p"
            variant="body2"
            color="text.primary"
        >
            Company: {company}
        </Typography>
        <Typography
            component="p"
            variant="body2"
            color="text.primary"
        >
            Skill: {skill}
        </Typography>
        <Typography
            component="p"
            variant="body2"
            color="text.primary"
        >
            Average: {averageScore(grades)}%
        </Typography>
      </React.Fragment>;

    const scores = grades => 

      <div style={{ width: '50%', paddingLeft: 35,display: 'flex', flexDirection: 'column', justifyContent: 'start'}}>
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
                filterList.map((item,index) => 
                 <Accordion expanded={expanded === `panel${index+1}`} onChange={handleExpand(`panel${index+1}`)}>
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
                ) :  stateObj.data.students.map((item,index) => 
                 <Accordion expanded={expanded === `panel${index+1}`} onChange={handleExpand(`panel${index+1}`)}>
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