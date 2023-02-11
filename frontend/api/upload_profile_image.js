import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
const s3Client = require("../helpers/s3-client")

module.exports = async function handler(req, res) {
  const post = await createPresignedPost(s3Client, {
    Bucket: process.env.DD_COMMUNITY_BUCKET_NAME,
    Key: req.query.file,
    Fields: {
      acl: 'public-read',
      'Content-Type': req.query.fileType,
    },
    Expires: 600, // seconds
    Conditions: [
      ['content-length-range', 0, 1048576], // up to 1 MB
    ],
  });

  res.status(200).json(post);
}