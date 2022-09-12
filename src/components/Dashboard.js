import React, { useState, useEffect }  from 'react'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TemperatureSlider from './TemperatureSlider'
import MultipleSelectChip from './MultipleSelectChip'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import ConfigTimeslice from './ConfigTimeslice'
import EditIcon from '@mui/icons-material/Edit'
import BeachAccessIcon from '@mui/icons-material/BeachAccess'
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf'
import WeekendIcon from '@mui/icons-material/Weekend'
import ForestIcon from '@mui/icons-material/Forest'
import NaturePeopleIcon from '@mui/icons-material/NaturePeople'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import {saveConfig, postSetTemperature} from '../lib/helpers'
import { getMenuItemUnstyledUtilityClass } from '@mui/base'

let marks = []
let label = ''
for(let i = 5; i <= 35; i++) {
    label = i % 5 === 0 ? i+'°C' : ''
    marks.push({value: i, label: label})
}

let timeslice = []
let h = ''
for(let i = 0; i <= 23; i++) {
    h = i.toString().padStart(2, '0')
    timeslice.push(h + ':00')
    timeslice.push(h + ':30')
}

const setpointIcon = {
    0: <EnergySavingsLeafIcon />,
    1: <WeekendIcon />,
    2: <NaturePeopleIcon />
}

const setpointLegend = {
    0: "Eco",
    1: "Confort",
    2: "Non in casa"
}

  
const Dashboard = ({name, climateSensors, temperatureSensors, appConfig, setAppConfig}) => {    
    const [isLoaded, setIsLoaded] = useState(false)    
    const [temperatureSensor, setTemperatureSensor] = useState('')    
    const [tabValue, setTabValue] = useState('00:00')
    const [settingsOpen, setSettingsOpen] = useState(false);

    useEffect(() => {
        // const saved = localStorage.getItem("appConfigig");
        // const initialValue = JSON.parse(saved);
        
        setTemperatureSensor(appConfig.zones[appConfig.currentTab].temperatureSensor)
        //setClimateSensors(appConfig.zones[appConfig.currentTab].climateSensors)
        // setTemperatureSensor(
        setIsLoaded(true)
    }, [isLoaded])

    const handleSettingsOpen = () => {        
        setSettingsOpen(!settingsOpen);
     };   

    const temperatureSensorChange = (event) => {
        const prev = temperatureSensor
        const curr = event.target.value

        setTemperatureSensor(curr);

        let conf = {...appConfig}
        conf.zones[appConfig.currentTab].temperatureSensor = event.target.value        

        //Rimuove elemento dalla lista perché impegnato
        const index = conf.temperatureSensors.indexOf(curr);
        if (index > -1) {
            conf.temperatureSensors.splice(index, 1);            
        }
        
        if(prev.length > 0) {
            conf.temperatureSensors.push(prev)
        }        
        
        //Elimina i duplicati
        const set = new Set(conf.temperatureSensors);        
        conf.temperatureSensors = [...set]

        temperatureSensors = conf.temperatureSensors

        localStorage.setItem("appConfig", JSON.stringify(conf));

        setAppConfig(conf)
        console.log(conf)
    };

    const climateSensorsChange = (state) => {        
        let conf = {...appConfig}
        conf.zones[appConfig.currentTab].climateSensors = state
        setAppConfig(conf)
        saveConfig(conf)
    };

    const tabChange = (event, newValue) => {        
        setTabValue(newValue);
    };
    
    const handleTemperatureChange = (event, newValue) => {            
        const name = event.target.name
        //console.log(newValue, name, appConfig)          
        let conf = {...appConfig}
        conf.zones[appConfig.currentTab].setpointDefault[name].value = newValue        
        localStorage.setItem("appConfig", JSON.stringify(conf));
        setAppConfig(conf)
        saveConfig(conf)
    };

    const handleTest = (event) => {
        console.log(event)
        let conf = {...appConfig}
        
        const d = new Date();
        let hour = d.getHours()
        if(hour < 10) {
            hour = '0' + hour
        }
        let min = d.getMinutes()
        if(min < 30) {
            min = '00'
        } else {
            min = '30'
        }
        const setpointKey = hour+':'+min
        console.log(setpointKey)
        console.log(conf)        
        
        let temperature = conf.zones[appConfig.currentTab].setpointDefault[conf.zones[appConfig.currentTab].setpointTimeslice[setpointKey]].value

        console.log(temperature)

        alert('Invio la temperatura '+temperature+' ai sensori...')

        postSetTemperature(conf.zones[appConfig.currentTab].climateSensors, conf.vacationTemperature)
    };

    // console.log('appConfigig:', appConfig)
    return (isLoaded && appConfig.status &&
        <div>
            <h1>{name}</h1>
            <h2>Set point per ciascuna mezz'ora:</h2>
            <Box sx={{ bgcolor: 'background.paper' }}>
            <Tabs      
                value={tabValue}          
                onChange={tabChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"                
            >
                {timeslice.map((h) => {
                    const setpoint = setpointLegend[appConfig.zones[appConfig.currentTab].setpointTimeslice[h]]    
                    const setpointDegree = appConfig.zones[appConfig.currentTab].setpointDefault.filter(obj => {return obj.label === setpoint})[0].value+'°'
                    const icon = setpointIcon[appConfig.zones[appConfig.currentTab].setpointTimeslice[h]]                    
                    return <Tab disabled={appConfig.vacationMode} icon={<span>{icon}<span><br></br>{setpoint}<br></br>{setpointDegree}</span></span>} iconPosition="bottom" label={h} wrapped key={h} value={h} onClick={handleSettingsOpen} />
                })}                
            </Tabs>
            </Box>
          
            <h2>Sensori ambiente:</h2>
            <Grid container rowSpacing={6} spacing={2} >
                <Grid item xs={2}>
                    Testine termostatiche:
                </Grid>
                <Grid item xs={10}>
                    {!appConfig.vacationMode && (
                    <MultipleSelectChip items={climateSensors} onChangePost={climateSensorsChange} value={appConfig.zones[appConfig.currentTab].climateSensors} />
                    )}
                    
                    {localStorage.getItem('debugMode') === 'true' && (
                        <Tooltip title="Invia segnale alle testine, usando la temperatura del setpoint più vicino">
                            <Button variant="contained" size="large" onClick={handleTest}>TEST</Button>
                        </Tooltip>
                    
                    )}
                </Grid>
                {false && (
                <Grid item xs={2}>
                    Sensore temperatura:
                </Grid>)}
                {false && (<Grid item xs={10}>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={temperatureSensor}                    
                    onChange={temperatureSensorChange}
                    disabled={appConfig.vacationMode}
                    >                   
                    {temperatureSensors.map((name) => (
                        <MenuItem
                        key={name}
                        value={name}                        
                        >
                        {name}
                        </MenuItem>
                    ))}
                    </Select>
                </Grid>)}
            </Grid>
            <h2>Set point ambiente:</h2>
            <Grid container rowSpacing={6} spacing={2}>
                <Grid item xs={2}>
                    <span><EnergySavingsLeafIcon /></span>
                    <br></br>
                    Eco:
                </Grid>
                <Grid item xs={10}>                
                    <TemperatureSlider 
                        name={"0"} 
                        min={4} 
                        max={35} 
                        value={appConfig.zones[appConfig.currentTab].setpointDefault[0].value} 
                        onValueChange={handleTemperatureChange} 
                        disabled={appConfig.vacationMode} />
                </Grid>

                <Grid item xs={2}>
                    <span><WeekendIcon /></span>
                    <br></br>
                    Confort:
                </Grid>
                <Grid item xs={10}>
                    <TemperatureSlider 
                        name={"1"} 
                        min={4} 
                        max={35}
                        value={appConfig.zones[appConfig.currentTab].setpointDefault[1].value} 
                        onValueChange={handleTemperatureChange} 
                        disabled={appConfig.vacationMode} />
                </Grid>

                <Grid item xs={2}>
                    <span><NaturePeopleIcon /></span>
                    <br></br>
                    Non in casa:
                </Grid>
                <Grid item xs={10}>
                    <TemperatureSlider 
                        name={"2"} 
                        min={4} 
                        max={35} 
                        value={appConfig.zones[appConfig.currentTab].setpointDefault[2].value} 
                        onValueChange={handleTemperatureChange} 
                        disabled={appConfig.vacationMode} />
                </Grid>
            </Grid>

            <ConfigTimeslice open={settingsOpen} toggleOpen={handleSettingsOpen} title={tabValue} appConfig={appConfig} setAppConfig={setAppConfig} />             
        </div>
    )
    
}

export default Dashboard;