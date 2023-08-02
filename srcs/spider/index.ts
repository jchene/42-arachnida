import { Spider } from "./Spider"

async function main() {
	const spider = new Spider()
    await spider.scrap()
}

main()