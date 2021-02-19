import { Client, Message } from "discord.js";

export const name = 'invite';
export function execute(bot: Client, message: Message, command: undefined, db: undefined, lang: Record<string, string | any>) {
	message.channel.send(`${lang.inviteUsToYourServer} 😁\nhttps://discordapp.com/oauth2/authorize?&client_id=${bot.user.id}&scope=bot&permissions=272100438`).catch(err => { console.error(err); });
};