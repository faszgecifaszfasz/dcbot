require('dotenv').config()
const Discord = require('discord.js')
const bot = new Discord.Client()
const prefix = "s_"
const express = require('express')
const app = express()
const port = process.env.PORT || 80

app.get("/", (req, res) => {
    res.send("Hello")
})

app.listen(port)

bot.login(process.env.DCTOKEN)

bot.on("ready", () => {
    console.log("Bejelentkezve: " + bot.user.tag)
    bot.user.setActivity("Roblox", { type: "PLAYING" })
})

bot.on("message", message => {
    if (!message.content.startsWith(prefix) || message.author.bot) { return }

    let args = message.content.substring(prefix.length).split(" ")

    switch (args[0]) {
        case "help":
            message.channel.send("Itt lennének a parancsok, ha nem lennék lusta beírni őket!")
            break
        case "kick":
            if (!message.mentions.members.first()) { message.channel.send("Nem említettél meg senkit!"); return }
            if (!message.member.hasPermission("KICK_MEMBERS")) { message.channel.send("Nincs ehhez jogod!"); return }
            if (!message.mentions.members.first().kickable) { message.channel.send("Őt nem tudom kickelni!"); return }
            message.mentions.members.first().kick()
            message.channel.send("Kickelve!")
            break
        case "ban":
            if (!message.mentions.members.first()) { message.channel.send("Nem említettél meg senkit!"); return }
            if (!message.member.hasPermission("BAN_MEMBERS")) { message.channel.send("Nincs ehhez jogod!"); return }
            if (!message.mentions.members.first().bannable) { message.channel.send("Őt nem tudom kickelni!"); return }
            message.mentions.members.first().ban()
            message.channel.send("Bannolva!")
            break
        case "nuke":
            if (!args[1] || isNaN(args[1])) { db = 1 } else { db = Number(args[1]) }
            if (!message.member.hasPermission("ADMINISTRATOR")) { message.channel.send("Ehhez nincs jogod!"); return }
            message.channel.bulkDelete(db + 1)
            message.channel.send(db + " üzenet törölve!")
            break
        case "whois":
            if (message.mentions.members.first()) { member = message.mentions.members.first() } else { member = message.member }
            msg = new Discord.MessageEmbed()
                .setTitle(member.roles.highest.name + " | " + member.displayName)
                .setColor(member.displayHexColor)
                .setThumbnail(member.user.displayAvatarURL())
                .addField("Rangok", member.roles.cache.array().join(", "))
                .addField("Csatlakozás", member.joinedAt)
                .addField("Fiók létrehozása", member.user.createdAt)
                .setFooter("s_whois")
            message.channel.send(msg)
            break
        case "role":
            allowed = "Rangadó"
            if (!message.guild.me.hasPermission("MANAGE_ROLES")) { message.channel.send("Ezen a szerveren nem tudok rangokat kezelni!"); return }
            if (!message.member.roles.cache.find(r => r.name === allowed)) { message.channel.send("Ehhez nincs jogod!"); return }
            if (!message.mentions.members.first()) { message.channel.send("Nem említettél meg senkit!"); return }
            member = message.mentions.members.first()
            if (!args[2]) { message.channel.send("Nem adtál meg rangot!"); return }
            role = message.guild.roles.cache.find(r => r.name === args[2])
            if (!role) { message.channel.send("Nem találtam ilyen rangot!"); return }
            if (message.guild.me.roles.highest.position <= role.position) { message.channel.send("Ezt a rangot nem tudom odaadni!"); return }
            member.roles.add(role)
            message.channel.send("Siker!")
            break
        case "test":
            message.channel.send("Felhasználóneved: " + message.author.tag + "\nÚj sor")
            break
        default:
            message.channel.send("Nem ismerek ilyen parancsot!")
            break
    }
})