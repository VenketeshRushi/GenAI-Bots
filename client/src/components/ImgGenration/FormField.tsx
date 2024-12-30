import React from "react";

interface FormFieldProps {
	labelName: string;
	type: string;
	name: string;
	placeholder?: string;
	value: string;
	handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	isSurpriseMe?: boolean;
	handleSurpriseMe?: () => void;
}

const FormField = ({
	labelName,
	type,
	name,
	placeholder,
	value,
	handleChange,
	isSurpriseMe,
	handleSurpriseMe,
}: FormFieldProps) => {
	return (
		<div>
			<div className="flex items-center gap-2 mb-2">
				<label
					htmlFor={name}
					className="block text-sm font-medium text-muted-foreground"
				>
					{labelName}
				</label>
				{isSurpriseMe && (
					<button
						type="button"
						onClick={handleSurpriseMe}
						className="font-semibold text-xs bg-muted-foreground/20 py-1 px-3 rounded-[5px] text-foreground"
					>
						Surprise me!
					</button>
				)}
			</div>
			<input
				type={type}
				id={name}
				name={name}
				placeholder={placeholder}
				value={value}
				onChange={handleChange}
				required
				className="bg-background/40 border border-foreground/10 text-foreground/80 text-sm rounded-lg focus:ring-primary focus:border-primary outline-none block w-full p-3"
			/>
		</div>
	);
};

export default FormField;
