import {
	executeCommand,
	registerCommand,
	registerOverride
} from "ez:command";

//edit the percentage of tax here
let taxPercentage = 0
//edit the least amount of money a player can send
let leastAmount = 100
//edit the scoreboard object of money
const score = "money"

registerCommand("pay", "Transfer balance to other players.", 0);
registerOverride("pay", [{type: "players", name: "player", optional: false}, {type: "int", name: "amount", optional: false}], function (targets, count) {
	if (targets.length != 1) throw "You can only pay money to 1 player at a time.";
	let sender = this.player
	let target = targets[0];
	let senderName = sender.name
	let targetName = target.name
	let finalAmount = Math.round((100 - taxPercentage) * count / 100)
	if (this.player) {
		if (count < leastAmount) {
			throw "최소 $" + leastAmount + " 원 이상의 금액만 보낼 수 있습니다";
		}else {
			executeCommand("execute \"" + senderName + "\" ~ ~ ~ scoreboard players remove @s[scores={" + score + "=" + count + "..}] " + score + " " + count + "");
			executeCommand("execute \"" + senderName + "\" ~ ~ ~ execute @s[scores={" + score + "=" + count + "..}] ~ ~ ~ scoreboard players add \"" + targetName + "\" " + score + " " + count + "");
			executeCommand("execute \"" + senderName + "\" ~ ~ ~ execute @s[scores={" + score + "=" + count + "..}] ~ ~ ~ tellraw @s {\"rawtext\":[{\"text\":\"§l§6You send §b" + targetName + " §e" + count + " \n§atax : " + taxPercentage + "% §6They get §e" + finalAmount + "\"}]}");
			executeCommand("execute \"" + senderName + "\" ~ ~ ~ execute @s[scores={" + score + "=" + count + "..}] ~ ~ ~ tellraw \"" + targetName + "\" {\"rawtext\":[{\"text\":\"§l§b" + senderName + " §6send you §e" + count + "\n§atax : " + taxPercentage + "% §6you got §e" + finalAmount + "\"}]}");
		}
	}
});
registerOverride("pay", [], function () {
	if (this.player) {
		let playerName = getPlayerList().getName;
		send(this.player, {
			type: "custom_form",
			title: "PAY UI",
			content: [
				{
					"type": "input",
					"text": "target Player",
					"placeholder": ""
					
				},
				{
					"type": "input",
					"text": "Amount",
					"placeholder": "Only number"
				}
			]
		}, data => {
			if (data == null) return;
			let playerName = this.player.name
			let [name, amount] = data;
			
			executeCommand("execute \"" + playerName + "\" ~ ~ ~ pay "+ name +" "+ amount +"");

		}
	);
    return null
  }
  throw ["error, this command can only be used in game!", "/pay"]
});
console.log("2913scorepay(en).js loaded");
