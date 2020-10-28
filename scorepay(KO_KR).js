import {
	executeCommand,
	registerCommand,
	registerOverride
} from "ez:command";

import {
	send
} from "ez:formui";

//세금
let taxPercentage = 0
//돈 보낼 수 있는 최소 금액
let leastAmount = 100
//돈으로 인식할 스코어보드
const score = "money"

registerCommand("pay", "다른 플레이어에게 돈을 보냅니다", 0);
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
			executeCommand("execute \"" + senderName + "\" ~ ~ ~ execute @s[scores={" + score + "=" + count + "..}] ~ ~ ~ tellraw @s {\"rawtext\":[{\"text\":\"§l§b" + targetName + "§f 님께 §e" + count + "§f 원을 보냈습니다 \n§a세금 : " + taxPercentage + "% §6보내진 최종 금액 §e" + finalAmount + "\"}]}");
			executeCommand("execute \"" + senderName + "\" ~ ~ ~ execute @s[scores={" + score + "=" + count + "..}] ~ ~ ~ tellraw \"" + targetName + "\" {\"rawtext\":[{\"text\":\"§l§b" + senderName + " §f님이 §e" + count + "§f 원을 보내주셨습니다\n§a세금 : " + taxPercentage + "% §6최종 금액 §e" + finalAmount + "\"}]}");
		}
	}
});
registerOverride("pay", [], function () {
	if (this.player) {
		send(this.player, {
			type: "custom_form",
			title: "PAY UI",
			content: [
				{
					"type": "input",
					"text": "대상 플레이어",
					"placeholder": "player"
					
				},
				{
					"type": "input",
					"text": "금액",
					"placeholder": "숫자만 적으세요"
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
});
console.log("2913scorepay(ko).js loaded");
