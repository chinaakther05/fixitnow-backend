import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import config from "./config";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";


const app : Application = express();

app.use(cors({
    origin: config.app_url,
    credentials : true,
}))


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())

app.get("/", (req : Request, res : Response) => {
    res.send("Hello World!");
})

app.post("/api/users/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, phone, address, profileImage, bio, experience, skills, hourlyRate } = req.body;

    // বেসিক validation
    if (!name || !email || !password || !role) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "name, email, password and role are required",
        errorDetails: "Missing required fields",
      });
    }

    const isUserExist = await prisma.user.findUnique({ where: { email } });

    if (isUserExist) {
      return res.status(httpStatus.CONFLICT).json({
        success: false,
        message: "User with this email already exists",
        errorDetails: "Duplicate email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

    const createdUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        phone,
        address,
        profileImage,
      },
    });

    // শুধু TECHNICIAN হলেই TechnicianProfile বানাও
    if (role === "TECHNICIAN") {
      await prisma.technicianProfile.create({
        data: {
          userId: createdUser.id,
          bio: bio || null,
          experience: experience || null,
          skills: skills || [],
          hourlyRate: hourlyRate || null,
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: createdUser.id },
      omit: { password: true },
      include: { technicianProfile: true },
    });

    res.status(httpStatus.CREATED).json({
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User registered successfully",
      data: { user },
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong during registration",
      errorDetails: error instanceof Error ? error.message : error,
    });
  }
});


export default app;