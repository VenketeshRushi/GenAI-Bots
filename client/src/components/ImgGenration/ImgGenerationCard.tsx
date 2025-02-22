import { ext } from "@/utils/ext";
import { download } from "@/assets";
import { Post } from "@/pages/Bots/ImageGenerationBot";

const ImgGenerationCard = ({ _id, name, prompt, photo }: Post) => {
	return (
		<div className="rounded-xl group relative shadow-card hover:shadow-cardhover card">
			<img
				className="w-full h-auto object-cover rounded-xl"
				src={photo}
				alt={prompt}
			/>

			<div className="group-hover:flex flex-col max-h-[94.5%] hidden absolute bottom-0 left-0 right-0 bg-foreground/80 m-2 p-4 rounded-md">
				<p className="text-background text-sm overflow-y-auto prompt">
					{prompt}
				</p>
				<div className="mt-5 flex justify-between items-center gap-2">
					<div className="flex items-center gap-2">
						<div className="w-7 h-8 rounded-full object-cover bg-green-700 flex justify-center items-center text-background text-xs font-bold">
							{name[0]}
						</div>
						<p className="text-background text-sm">{name}</p>
					</div>
					<button
						type="button"
						onClick={() => ext.downloadImage({ _id, photo })}
						className="outline-none bg-transparent border-none"
					>
						<img
							src={download}
							alt="download"
							className="w-6 h-6 object-contain invert"
						/>
					</button>
				</div>
			</div>
		</div>
	);
};

export default ImgGenerationCard;
