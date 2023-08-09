import exifr from 'exifr';

export class ScorpionReader {
	public async extract(path: string) {
		const metadata = await exifr.parse(path, {iptc: true, xmp: true });
		console.log(metadata);
	}
}