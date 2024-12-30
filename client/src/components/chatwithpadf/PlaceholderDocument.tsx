import { PlusCircleIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const PlaceholderDocument = () => {
	const navigate = useNavigate();
	const handleClick = () => {
		navigate("/dashboard/upload");
	};
	return (
		<Button
			onClick={handleClick}
			className="flex flex-col items-center h-80 w-64 rounded-xl drop-shadow-md bg-primary/10 text-foreground/50 hover:text-background"
		>
			<PlusCircleIcon className="h-16 w-16" />
			<p>Add a document</p>
		</Button>
	);
};

export default PlaceholderDocument;
