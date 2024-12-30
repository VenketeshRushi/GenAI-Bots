import { surpriseMePrompts } from "@/constant/exampleprompts";

export function getRandomPrompt(prompt: string) {
	const randomIndex = Math.floor(Math.random() * surpriseMePrompts.length);
	const randomPrompt = surpriseMePrompts[randomIndex];

	if (randomPrompt === prompt) {
		return getRandomPrompt(prompt);
	}

	return randomPrompt;
}

function downloadImage({ _id, photo }: { _id: string; photo: string }) {
	// Create an anchor element
	const anchor = document.createElement("a");
	anchor.href = photo; // Set the href to the photo URL
	anchor.download = `download-${_id}.jpg`; // Set the download attribute with a filename

	// Programmatically click the anchor to trigger the download
	document.body.appendChild(anchor); // Append the anchor to the body
	anchor.click(); // Trigger a click event
	document.body.removeChild(anchor); // Remove the anchor from the DOM
}

export const ext = {
	getRandomPrompt,
	downloadImage,
};
