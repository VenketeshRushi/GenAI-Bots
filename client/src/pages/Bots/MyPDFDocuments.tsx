import Documents from "../../components/chatwithpadf/Documents";

function MyPDFDocuments() {
	return (
		<div className="h-full space-y-4">
			<div className="py-6 px-4 bg-secondary">
				<h1 className="text-xl font-medium">My PDF Documents</h1>
			</div>
			<div className="px-4">
				<Documents />
			</div>
		</div>
	);
}

export default MyPDFDocuments;
