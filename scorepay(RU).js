import {
    executeCommand,
    registerCommand,
    registerOverride
} from "ez:command";

import {
    send
} from "ez:formui";

// налог
let taxPercentage = 0
    //Минимальная сумма денег, которую вы можете отправить
let leastAmount = 100
    //Табло для распознавания денег
const score = "money"

registerCommand("pay", "Отправляйте монеты другим игрокам", 0);
registerOverride("pay", [{ type: "players", name: "player", optional: false }, { type: "int", name: "amount", optional: false }], function(targets, count) {
    if (targets.length != 1) throw "Вы можете отправлять монеты только 1 игроку за раз.";
    let sender = this.player
    let target = targets[0];
    let senderName = sender.name
    let targetName = target.name
    let finalAmount = Math.round((100 - taxPercentage) * count / 100)
    if (this.player) {
        if (count < leastAmount) {
            throw "Минимумальная отправка составляет " + leastAmount + " монет";
        } else {
            executeCommand("execute \"" + senderName + "\" ~ ~ ~ scoreboard players remove @s[scores={" + score + "=" + count + "..}] " + score + " " + count + "");
            executeCommand("execute \"" + senderName + "\" ~ ~ ~ execute @s[scores={" + score + "=" + count + "..}] ~ ~ ~ scoreboard players add \"" + targetName + "\" " + score + " " + count + "");
            executeCommand("execute \"" + senderName + "\" ~ ~ ~ execute @s[scores={" + score + "=" + count + "..}] ~ ~ ~ tellraw @s {\"rawtext\":[{\"text\":\"§l§b" + targetName + "§f отправлено §e" + count + "§f монет. \n§aНалог : " + taxPercentage + "%. §6Окончательная сумма - §e" + finalAmount + "\"}]}");
            executeCommand("execute \"" + senderName + "\" ~ ~ ~ execute @s[scores={" + score + "=" + count + "..}] ~ ~ ~ tellraw \"" + targetName + "\" {\"rawtext\":[{\"text\":\"§l§b" + senderName + " §fотправил Вам §e" + count + "§f монет.\n§aНалог: " + taxPercentage + "%. §6Окончательная сумма - §e" + finalAmount + "\"}]}");
        }
    }
});
registerOverride("pay", [], function() {
    if (this.player) {
        send(this.player, {
            type: "custom_form",
            title: "PAY UI",
            content: [{
                    "type": "input",
                    "text": "Игрок",
                    "placeholder": ""

                },
                {
                    "type": "input",
                    "text": "Монеты",
                    "placeholder": "Просто введите число"
                }
            ]
        }, data => {
            if (data == null) return;
            let playerName = this.player.name
            let [name, amount] = data;

            executeCommand("execute \"" + playerName + "\" ~ ~ ~ pay " + name + " " + amount + "");

        });
        return null
    }
});
console.log("2913scorepay(RU).js loaded");
