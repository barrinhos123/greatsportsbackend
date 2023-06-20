import axios from "axios";

var apiUrl = 'https://api.moloni.pt';
  //Moloni Auth
var moloniAuthPath = '/v1/authorize/';
var moloniGrant = '/v1/grant/';

function addHours(date, hours) {
    date.setTime(date.getTime() + hours * 60 * 60 * 1000);
  
    return date;
  }

export async function getAuthorizationCodeFullValue(clientId, clientSecret, username, password) {
    try {
        var queryParamenters = {};
        queryParamenters.grant_type = "password"
        queryParamenters.client_id = clientId
        queryParamenters.client_secret = clientSecret
        queryParamenters.username = username
        queryParamenters.password = password

        var dateExpirtes = addHours( new Date(), 1 )
        var refereshExpirtes = addHours( new Date(), 24 * 14 )

        var res = await axios.get(apiUrl + moloniGrant, { 
            params: queryParamenters, 
            headers: {
                "Access-Control-Allow-Origin": "*",
            }})
        console.log(res)
        console.log(dateExpirtes)
        console.log(refereshExpirtes);


    } catch (error) {
        console.log(error)
        return null
    }
}