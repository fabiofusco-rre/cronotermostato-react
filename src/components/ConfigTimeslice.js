import React, { useState, useEffect }  from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ConfigTimeslice = ({open, toggleOpen, title, appConfig, setAppConfig}) => {    
    const [value, setValue] = React.useState(0);

    useEffect( () => {        
        setValue(appConfig.zones[appConfig.currentTab].setpointTimeslice[title])
    })   
    
    const handleChange = (event) => {
        let newValue = event.target.value
        console.log(newValue)
        setValue(newValue);
        console.log(appConfig)
        let conf = {...appConfig}
        conf.zones[appConfig.currentTab].setpointTimeslice[title] = newValue

        setAppConfig(conf)
    }

    const saveConfig = () => {
        let conf = {...appConfig}
        localStorage.setItem("appConfig", JSON.stringify(conf));
        toggleOpen()
    }

    return (
        <Dialog
                fullScreen
                open={open}
                onClose={toggleOpen}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                        edge="start"
                        color="inherit"
                        onClick={toggleOpen}
                        aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Configurazione set point
                        </Typography>
                        <Button autoFocus color="inherit" onClick={saveConfig}>
                        Salva
                        </Button>
                    </Toolbar>
                </AppBar>
                <h2>Configura set point {title}</h2>
                <FormControl>
                    <FormLabel id="demo-radio-buttons-group-label">Set Point</FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="0"
                        name="radio-buttons-group"
                        value={value}
                        onChange={handleChange}
                    >
                        <FormControlLabel value="0" control={<Radio />} label="Eco" />
                        <FormControlLabel value="1" control={<Radio />} label="Confort" />
                        <FormControlLabel value="2" control={<Radio />} label="Non in casa" />
                    </RadioGroup>
                </FormControl>
            </Dialog>
    )    
}

export default ConfigTimeslice;