import { Spider } from "./Spider"
import * as col from '../utils/colors'

async function main() {
	try {
		const spider: Spider = new Spider()
		spider.scrape()
	}
	catch (e) {
		console.log(col.red + "Error:" + e + col.reset)
		return
	}
}

main()