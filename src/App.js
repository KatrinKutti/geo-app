import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from "@material-ui/core/Typography";
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

const axios = require('axios');

const useStyles = makeStyles((theme) => ({
    input:
        {
            width: "100%",
        },
    spacer: {
        marginTop: "20px",
    }
}));

const App = () => {
    const classes = useStyles();
    const [lat, setLat] = useState(null);
    const [lon, setLon] = useState(null);
    const [status, setStatus] = useState(null);
    const [rawResult, setRawResult] = useState("");
    const [object, setObject] = useState("");

    // getLocation function retrieves the users actual current location (longitude and latitude)
    // using navigator.geolocation which is a browser feature
    // and presets the longitude and latitude values to input fields
    // also possible to insert location manually
    const getLocation = async () => {
        if (!navigator.geolocation) {
            setStatus('Geolocation is not supported by your browser');
        } else {
            setStatus('Locating...');
            navigator.geolocation.getCurrentPosition((position) => {
                setStatus(null);
                setLat(position.coords.latitude);
                setLon(position.coords.longitude);
            }, () => {
                setStatus('Unable to retrieve your location');
            });
        }
    }
    console.log(lat);
    console.log(lon)

    //on all Open Street Map API descriptions Nominatim API has been referred for longitude and latitude reverse data grabbing
    //therefore this API has been used and not the map api
    //advantages with this approach: geojson is sent back directly (no need for conversion) and jsonv2 is possible: both examples implemented
    async function getGeoJson(lat, lon) {
        const url = "https://nominatim.openstreetmap.org/reverse?format=geojson&lat=" + lat + "&lon=" + lon
        const result = await axios.get(url);
        setRawResult(JSON.stringify(result.data));

        const url2 = "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=" + lat + "&lon=" + lon
        const object = await axios.get(url2);
        setObject(object.data.address)
    }

    //MaterialUI is used to design React components
    return (
        <div className="App">
            <h1>Please insert your coordinates</h1>

            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <TextField
                        className={classes.input}
                        required
                        id="lon"
                        label="Longitude"
                        variant="outlined"
                        value={lon}
                        onChange={(e) => setLon(e.target.value)}
                    />
                </Grid>

                <Grid item xs={4}>
                    <TextField
                        className={classes.input}
                        required
                        id="lan"
                        label="Latitude"
                        variant="outlined"
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                    />
                </Grid>
                <Grid item xs={4}>
                    <Button onClick={getLocation} variant="outlined" color="primary"> Get Current Location</Button>
                </Grid>
            </Grid>

            <p>{status}</p>
            {lat && <p>Latitude: {lat}</p>}
            {lon && <p>Longitude: {lon}</p>}
            {(lat && lon) &&
            <Button onClick={() => getGeoJson(lat, lon)} variant="outlined" color="primary"> Get Location
                Dataset</Button>
            }

            <Divider variant="middle"/>

            <Typography variant="h5">Found Dataset</Typography>
            <Typography>
                {rawResult &&
                <code> {rawResult} </code>
                }
            </Typography>

            <Divider variant="middle"/>

            <div className={classes.spacer}/>
            <Typography variant="h5">Address</Typography>
            <Typography>
                {object &&
                <Typography> {object.building} {object.road} {object.house_number}, {object.postcode} {object.city} {object.village}, {object.country} </Typography>
                }
            </Typography>
        </div>
    );
}

export default App;