const { json } = require("express");
const fetch = require(`node-fetch`)
const http = require(`http  `)
async function getXblToken(access_token) {
	var config = JSON.stringify({
		Properties: {
			AuthMethod: 'RPS',
			SiteName: 'user.auth.xboxlive.com',
			RpsTicket: 'd='.concat(access_token), // your access token from the previous step here
		},
		RelyingParty: 'http://auth.xboxlive.com',
		TokenType: 'JWT',
	});

    var options = {
        hostname:'user.auth.xboxlive.com',
        path:'/user/authenticate',
        method:'POST',
        header:{
            "Content-Type" :"application/json" , "Accept": "application/json"
    }
    }
    const req = http.request({hostname: 'user.auth.xboxlive.com', path:'/user/authenticate'}) 
	// const response = await fetch('https://user.auth.xboxlive.com/user/authenticate',{
    //     method: `POST`,
    //     body: JSON.stringify(config),
    //     headers:{ 'Content-Type': 'application/json', Accept: 'application/json' }
    // }).then((response)=>{
    //     response.json()
    // }).then((json)=>{
    //     console.log(json)
    // })
	// console.log(`[[${response}]]`)
	// const ParsedRes = JSON.parse(response);
	// const xblToken = ParsedRes.Token;

	// return xblToken;
}

getXblToken(`M.R3_BL2.2.352f6636-bfdf-9c9c-057a-424cdf08d791`)