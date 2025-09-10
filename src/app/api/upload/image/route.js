import aws from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import nextConnect from "next-connect";

const s3 = new aws.S3({
  region: process.env.AWS_BUCKET_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: "public-read",
    key: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
}).single("image");

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(500).json({ error: `Upload error: ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload);

apiRoute.post((req, res) => {
  res.status(200).json({ imageUrl: req.file.location });
});

export const config = {
  api: {
    bodyParser: false, // disable default bodyParser for multer
  },
};

export default apiRoute;
