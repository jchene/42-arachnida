import { Spider } from "./Spider"
import * as col from '../utils/colors'

async function main() {
	try {
		const spider: Spider = new Spider()
		spider.scrap()
	}
	catch (e) {
		console.log(col.red, "Error:", e)
		return
	}
}

main()