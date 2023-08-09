import { Scorpion } from "./Scorpion"

async function main() {
	const scorpion = new Scorpion()
	await scorpion.extract()
}

main()