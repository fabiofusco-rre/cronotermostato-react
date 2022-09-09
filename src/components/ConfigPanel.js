import React, { useState, useEffect }  from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Switch from '@mui/material/Switch';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import TemperatureSlider from './TemperatureSlider'

let marks = []
let label = ''
for(let i = 5; i <= 35; i++) {
    label = i % 5 === 0 ? i+'°C' : ''
    marks.push({value: i, label: label})
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// const ConfigPanel = ({appConfig, open, toggleOpen, zones, setZones}) => {    
const ConfigPanel = ({appConfig, setAppConfig, open, toggleOpen}) => {    
    const [status, setStatus] = useState(appConfig.status);  
    const [vacationMode, setVacationMode] = useState(appConfig.vacationMode);
    const [zones, setZones] = useState(appConfig.zones)
    const [zone, setZone] = useState('')    

    useEffect( () => {
        setZones(appConfig.zones)


        // console.log('zones:', zones)
    })
        
    const handleDelete = (zoneToDelete) => () => {
        // console.log(zoneToDelete)
        let zonesTmp = zones.filter((zone) => zone.key !== zoneToDelete.key)
        // console.log(zonesTmp)
        setZones(zonesTmp)
        // setZones((zones) => zones.filter((zone) => zone.key !== zoneToDelete.key));
        let conf = appConfig
        conf.zones = zonesTmp
        // console.log('conf', conf)
        setAppConfig(conf)
    };

    /**
     * 
     * NOTA la doppia arrow function, equivalente a function handleStatus(value) { return function() {...}},
     * la prima invocata per il rendering
     * 
     * @param {*} value 
     * @returns 
     */
    const handleStatus = (value) => () => {
        //console.log(value)
        setStatus(value)
        let conf = appConfig
        conf.status = value
        setAppConfig(conf)
    }

    const handleVacationMode = (value) => () => {
        //console.log(value)
        setVacationMode(value)
        let conf = appConfig
        conf.vacationMode = value
        setAppConfig(conf)
    }

    const handleAddZoneChange = (event) => {
        //console.log('io')
        setZone(event.target.value)
    }

    const handleAddZoneClick = () => {
        //Prende la max key
        let max = 0
        for(const x of zones) {
            let intKey = parseInt(x.key)
            if(intKey > max) {
                max = intKey
            }
        }
        let setpointDefault = [
            {label: 'Eco', value: 16 + Math.floor(Math.random() * 10)}, 
            {label: 'Confort', value: 18 + Math.floor(Math.random() * 10)}, 
            {label: 'Non in casa', value: 12},
        ]
        zones.push({key: (max + 1).toString(), label: zone, setpointDefault: setpointDefault, setpointTimeslice: {
            '00:00' : 0,
            '00:30' : 0,                    
            '01:00' : 0,
            '01:30' : 0,
            '02:00' : 0,
            '02:30' : 0,
            '03:00' : 0,
            '03:30' : 0,
            '04:00' : 0,
            '04:30' : 0,
            '05:00' : 0,
            '05:30' : 0,
            '06:00' : 0,
            '06:30' : 0,
            '07:00' : 0,
            '07:30' : 0,
            '08:00' : 0,
            '08:30' : 0,
            '09:00' : 0,
            '09:30' : 0,
            '10:00' : 0,
            '10:30' : 0,
            '11:00' : 0,
            '11:30' : 0,
            '12:00' : 0,
            '12:30' : 0,
            '13:00' : 0,
            '13:30' : 0,
            '14:00' : 0,
            '14:30' : 0,
            '15:00' : 0,
            '15:30' : 0,
            '16:00' : 0,
            '16:30' : 0,
            '17:00' : 0,
            '17:30' : 0,
            '18:00' : 0,
            '18:30' : 0,
            '19:00' : 0,
            '19:30' : 0,
            '20:00' : 0,
            '20:30' : 0,
            '21:00' : 0,
            '21:30' : 0,
            '22:00' : 0,
            '22:30' : 0,
            '23:00' : 0,
            '23:30' : 0,
        }})
        //console.log(zones)
        setZones(zones)
        setZone('')

        let conf = appConfig
        conf.zones = zones
        //console.log('conf', conf)
        setAppConfig(conf)
    }

    const handleVacationTemperatureChange = (event, newValue) => {    
        // console.log(newValue)            
        let conf = {...appConfig}
        conf.vacationTemperature = newValue
        setAppConfig(conf)
    };
    
    const saveConfig = () => {
        let conf = {...appConfig}
        console.log('save:', conf)
        localStorage.setItem("appConfig", JSON.stringify(conf));
        
        const urlGetConfig = localStorage.getItem("urlGetConfig") || "http://localhost:9081/config";
        (async () => {
            const rawResponse = await fetch(urlGetConfig, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(conf)
            });
            const content = await rawResponse.json();
          
            console.log(content);
          })();
       
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
                        Configurazione
                        </Typography>
                        <Button autoFocus color="inherit" onClick={saveConfig}>
                        Salva
                        </Button>
                    </Toolbar>
                </AppBar>
                <List>
                    <ListItem alignItems="flex-start">
                        <ListItemText primary="Cronotermostato:" />
                        <Switch
                        edge="end"                       
                        onChange={handleStatus(!status)}
                        checked={status}
                        inputProps={{
                            'aria-labelledby': 'switch-list-label-onoff',
                        }}
                        />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText
                        primary="Zone:"                            
                        />
                        <Stack direction="row" spacing={1} >
                        {zones.map((data) => {                                

                            return (
                            <Box key={data.key}>
                                <Chip                                    
                                label={data.label}
                                onDelete={handleDelete(data)}
                                disabled={!status}
                                />
                            </Box>
                            );
                        })}
                        </Stack>
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText
                        primary="Aggiungi nuova zona:"                            
                        />
                        <TextField disabled={!status} id="standard-basic" variant="standard" value={zone} onChange={handleAddZoneChange} />
                        <Button disabled={zone == '' || !status} variant="outlined" onClick={() => handleAddZoneClick()}>Aggiungi</Button>
                    </ListItem>
                    <Divider />                    
                    <ListItem>
                        <ListItemText primary="Modalità vacanza:" />
                        <Switch
                        edge="end"
                        disabled={status === false}                        
                        onChange={handleVacationMode(!vacationMode)}
                        checked={vacationMode}
                        inputProps={{
                            'aria-labelledby': 'switch-list-label-vacation',
                        }}
                        />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText primary="Temperatura vacanza:" />                        
                        <TemperatureSlider min={4} max={35} value={appConfig.vacationTemperature} disabled={!status || !vacationMode} onValueChange={handleVacationTemperatureChange} appConfig={appConfig} setAppConfig={setAppConfig} />
                    </ListItem>                    
                </List>
            </Dialog>
    )    
}

export default ConfigPanel;