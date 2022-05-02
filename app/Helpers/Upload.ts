import Drive from "@ioc:Adonis/Core/Drive";
import { MultipartFileContract } from "@ioc:Adonis/Core/BodyParser";
import { cuid } from "@ioc:Adonis/Core/Helpers";
import sharp from "sharp";

export default class Upload {
	public static async image(
		disk: "local" | "s3" | "gcs" = "local",
		file: MultipartFileContract,
		width: number,
		height: number,
		lastFile = ""
	) {
		if (lastFile !== "") {
			const url = lastFile.split("/");
			lastFile = url[url.length - 1];
		}

		const exists = await Drive.use(disk).exists(lastFile);

		if (!exists) {
			await Drive.use(disk).delete(lastFile);
		}

		if (width === 0) {
			width = (await sharp(file.tmpPath).metadata()).width!;
		}

		if (height === 0) {
			height = (await sharp(file.tmpPath).metadata()).height!;
		}

		const extension = file.extname!;

		const image = await sharp(file.tmpPath)
			.resize(width, height)
			.toBuffer();

		const imageName = `image_${cuid()}.${extension}`;

		await Drive.use(disk).put(imageName, image);

		const imageUrl = await Drive.use(disk).getUrl(imageName);

		if (imageUrl) {
			return {
				url: imageUrl,
				name: file.clientName,
			};
		}
	}

	// public static async file(disk = "local", file: any) {}

	// public static async delete(disk = "local", file: any) {}
}
