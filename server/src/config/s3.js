const AWS = require("aws-sdk");

// Configure AWS SDK
AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const uploadFileToS3 = async (
	file,
	bucketName = process.env.AWS_S3_BUCKET_NAME
) => {
	const params = {
		Bucket: bucketName,
		Key: file.originalname, // Use the file's original name
		Body: file.buffer, // File buffer
		ContentType: file.mimetype, // File MIME type
	};

	try {
		const result = await s3.upload(params).promise();
		console.log("File uploaded successfully:", result.Location);
		return result.Location; // Return the file URL
	} catch (error) {
		console.error("Error uploading file to S3:", error);
		throw error;
	}
};

module.exports = { uploadFileToS3 };
