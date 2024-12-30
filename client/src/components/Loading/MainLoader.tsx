import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function MainLoader() {
	return (
		<div className="flex items-center justify-center h-screen">
			<Button disabled className="p-5">
				<Loader2 className="animate-spin font-extrabold" />
			</Button>
		</div>
	);
}

export default MainLoader;
