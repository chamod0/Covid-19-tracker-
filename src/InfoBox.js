import { Card, CardContent,Typography } from '@material-ui/core'
import React from 'react'
import './InfoBox.css'

function InfoBox({title,cases,isRed,isOrange,active,total,...props}) {
    return (
        <Card onClick={props.onClick} className ={ `infoBox ${active && 'infoBox--selected'} ${isRed && "infoBox--red"} ${isOrange && "infoBox--Orange"}`}>
            <CardContent>
            <Typography className="infoBox__title" color="textSecondary">
            <h4>{title}</h4>
            </Typography>
            <h2 className={`infoBox__cases ${!isRed && !isOrange && "infoBox__cases--green"} ${isOrange && "infoBox__cases--orange"}`}>{cases}</h2>

           <Typography className= "infobox__total" color="textSecondary">
           <a>Total {total}  </a>

           </Typography>


            </CardContent>
        </Card>
    )
}

export default InfoBox
