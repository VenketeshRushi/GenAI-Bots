import byteSize from "byte-size";
import { DownloadCloud, Trash2Icon } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/reduxTransportHoot";

const Document = ({
	id,
	name,
	size,
	downloadUrl,
}: {
	id?: string;
	name: string;
	size: number;
	downloadUrl: string;
}) => {
	const navigate = useNavigate();
	const activeMembership = useAppSelector(
		(state) => state?.auth?.user?.membership?.activeMembership || false
	);

	return (
		<div className="flex flex-col w-64 h-80 rounded-xl drop-shadow-md justify-between p-4 transition-all transform hover:scale-105 hover:bg-primary hover:text-background cursor-pointer group">
			<div
				className="flex-1"
				onClick={() => {
					navigate(`/dashboard/files/${id}`);
				}}
			>
				<p className="font-medium line-clamp-2">{name}</p>
				<p className="text-sm text-foreground group-hover:text-background">
					{byteSize(size).value || 0} KB
				</p>
			</div>

			<div className="flex space-x-2 justify-end">
				<Button variant="outline" disabled={!activeMembership}>
					<Trash2Icon className="h-6 w-6 text-red-500" />
					{!activeMembership && (
						<span className="text-red-500 ml-2">PRO Feature</span>
					)}
				</Button>
				<Button variant="outline" asChild>
					<a href={downloadUrl} download target="_blank">
						<DownloadCloud className="h-6 w-6 text-primary" />
					</a>
				</Button>
			</div>
		</div>
	);
};

export default Document;
