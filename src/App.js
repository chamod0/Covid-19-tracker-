import { Card, CardContent, FormControl, MenuItem,Select}

from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from "./Table";
import './App.css';
import './Table.css'
import { sortData, prettyPrintStat } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";


function App() {
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);

    useEffect(() =>{
      fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {

          setCountryInfo(data);
      });

 },[]);



  useEffect(() => {
    const getCountriesData =async() =>{

      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
          name: country.country,
          value: country.countryInfo.iso2,
        }));

        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);

          setCountries(countries);
      });
    };
      getCountriesData();
  },[]);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;


    const url =
    countryCode === "worldwide"
      ? "https://disease.sh/v3/covid-19/all"
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
  await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      setInputCountry(countryCode);
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    });
};
    console.log("COUNTRY INFO >>>",countryInfo)
  return (
    <div className="app">
      <div className="app__left">
      <div className = "app__header">
        <h1>Covid 19 Tracker</h1>
        <FormControl className="app__dropdown">
          <Select className="select" variant = "outlined" onChange={onCountryChange} value={country} >

            <MenuItem value="worldwide">WorldWide</MenuItem>
              {countries.map((country) => (

            <MenuItem value={country.value}>{country.name}</MenuItem>

              ))
            }
          </Select>
        </FormControl>
      </div>

      <div className = "app__status">
          <InfoBox 
          isRed
            active = {casesType === "cases"}
           onClick = {(e) => setCasesType("cases")}
           title =" Cases"
           cases={prettyPrintStat(countryInfo.todayCases)} 
           total={prettyPrintStat(countryInfo.cases)}/>

          <InfoBox 
          active = {casesType === "recovered"}
          
          onClick = {(e) => setCasesType("recovered")}
          title="Recovered"
          cases={prettyPrintStat(countryInfo.todayRecovered )}  
          total={prettyPrintStat(countryInfo.recovered)}/>

          <InfoBox 
          
          isOrange
          active = {casesType === "deaths"}
          onClick = {(e) => setCasesType("deaths")}
          title="Deaths" 
          cases={prettyPrintStat(countryInfo.todayDeaths)} 
          total={prettyPrintStat(countryInfo.deaths)}/>
      </div>

      <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
  

      </div>
      <Card className="app__right">

            <CardContent className ="app_right__card">

            <h3>Covid 19 Live Cases</h3>

            <Table countries = {tableData} />
            <h3 className="app__grpTitle">Worldwide new {casesType}</h3>
            <LineGraph className="app__graph" casesType={casesType} />
            </CardContent>
      </Card>
      
    </div>
  );
}

export default App;
