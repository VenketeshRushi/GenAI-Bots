const express = require("express");
const multer = require("multer");
const { uploadFileToS3 } = require("../config/s3");

const router = express.Router();

// Configure multer for file upload
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload a file to S3
 *     tags: [File Upload]
 */
router.post("/", upload.single("file"), async (req, res) => {
	try {
		const fileUrl = await uploadFileToS3(req.file);
		res.status(200).json({ message: "File uploaded successfully", fileUrl });
	} catch (error) {
		res
			.status(500)
			.json({ error: "Failed to upload file", details: error.message });
	}
});

module.exports = router;
