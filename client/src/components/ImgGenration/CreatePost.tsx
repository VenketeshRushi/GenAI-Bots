import { ext } from "@/utils/ext";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { preview } from "../../assets";
import FormField from "./FormField";
import ImgGenrationLoader from "./ImgGenrationLoader";

interface FormType {
	name: string;
	prompt: string;
	photo: string;
}

const CreatePost = () => {
	const navigate = useNavigate();
	const [form, setForm] = useState<FormType>({
		name: "",
		prompt: "",
		photo: "",
	});

	const [generatingImg, setGeneratingImg] = useState<boolean>(false);
	const [loading, setloading] = useState<boolean>(false);

	const generateImage = async () => {
		if (form.prompt) {
			try {
				setGeneratingImg(true);

				const response = await fetch(
					"https://reactjs-dall-e-app.onrender.com/api/v1/dalle",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ prompt: form.prompt }),
					}
				);

				const data = await response.json();

				setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
			} catch (error) {
				console.log("generateImage error---", error);
			} finally {
				setGeneratingImg(false);
			}
		} else {
			alert("Please enter a prompt.");
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (form.prompt && form.photo) {
			setloading(true);

			try {
				const response = await fetch(
					"https://reactjs-dall-e-app.onrender.com/api/v1/post",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(form),
					}
				);

				await response.json();
				navigate("/");
			} catch (error) {
				console.log("error while submitting...", error);
			} finally {
				setloading(false);
			}
		} else {
			alert("Please enter a prompt & generate an image");
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSurpriseMe = () => {
		const randomPrompt = ext.getRandomPrompt(form.prompt);
		setForm({ ...form, prompt: randomPrompt });
	};

	return (
		<section className="max-w-7xl mx-auto">
			<div>
				<h1 className="font-extrabold text-foreground text-[32px]">Create</h1>
				<p className="mt-2 text-muted-foreground text-[16px] max-w-[500px]">
					Create imaginative and visually stunning images through DALL-E AI and
					share them with the community
				</p>
			</div>

			<form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
				<div className="flex flex-col gap-5">
					<FormField
						labelName="Your name"
						type="text"
						name="name"
						placeholder="Enter your name"
						value={form.name}
						handleChange={handleChange}
					/>
					<FormField
						labelName="Prompt"
						type="text"
						name="prompt"
						placeholder="a fortune-telling shiba inu reading your fate in a giant hamburger, digital art"
						value={form.prompt}
						handleChange={handleChange}
						isSurpriseMe
						handleSurpriseMe={handleSurpriseMe}
					/>

					<div className="relative bg-muted-foreground/10 border border-muted-foreground/20 text-foreground/90 text-sm rounded-lg focus:ring-primary focus:border-primary w-64 p-3 h-64 flex justify-center items-center">
						{form.photo ? (
							<img
								src={form.photo}
								alt={form.prompt}
								className="w-full h-full object-contain"
							/>
						) : (
							<img
								src={preview}
								alt="preview"
								className="w-9/12 h-9/12 object-contain opacity-40"
							/>
						)}

						{generatingImg && (
							<div className="absolute inset-0 z-0 flex justify-center items-center bg-foreground/50">
								<ImgGenrationLoader />
							</div>
						)}
					</div>
				</div>

				<div className="mt-5 flex gap-5">
					<button
						type="button"
						onClick={generateImage}
						className="text-background bg-green-600 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
					>
						{generatingImg ? "Generating..." : "Generate"}
					</button>
				</div>

				<div className="mt-10">
					<p className="mt-2 text-muted-foreground text-[14px]">
						Once you have created the image you want, you can sahre it with
						others in the community
					</p>
					<button
						type="submit"
						className="mt-3 text-background bg-primary font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
					>
						{loading ? "Sharing..." : "Share with the community"}
					</button>
				</div>
			</form>
		</section>
	);
};

export default CreatePost;
