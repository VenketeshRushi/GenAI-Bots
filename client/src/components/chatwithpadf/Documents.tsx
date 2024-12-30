import { useAppSelector } from "@/hooks/reduxTransportHoot";
import Document from "./Document";
import PlaceholderDocument from "./PlaceholderDocument";

const Documents = () => {
	const fileData = useAppSelector((state) => state.auth.user?.files?.pdf || []);
	console.log("fileData_inside_Documents----", fileData);

	return (
		<div className="flex flex-wrap p-5 bg-muted justify-center lg:justify-start rounded-sm gap-5 max-w-7xl mx-auto">
			{fileData.length > 0 ? (
				fileData.map((file, index) => {
					const { name, downloadUrl, size, id } = file;
					return (
						<Document
							key={id.toString() || index} // Fallback to index if _id is not available
							id={id}
							name={name}
							size={size}
							downloadUrl={downloadUrl}
						/>
					);
				})
			) : (
				<PlaceholderDocument />
			)}
		</div>
	);
};

export default Documents;
