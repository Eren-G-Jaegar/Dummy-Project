import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//  This function creates Access & Refresh Tokens
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "An error occurred while generating Access and Refresh Tokens."
    );
  }
};

//  This function is used to Register a user
const registerUser = asyncHandler(async (req, res) => {
  // 1. get user details from frontend
  // 2. validation - not empty
  // 3.check if user already exists : username or email
  // 4. check for images, check for avatar
  // 5. upload them to cloudinary,avatar
  // 6. create user Object-create entry in db
  // 7. remove password and refresh token field from response
  // 8. check for user creation
  // 9. return res

  // res.status(200).json({
  //   message:"ok"
  // })

  // 1. get user details from frontend
  const { fullName, email, userName, passWord } = req.body;
  console.log("email : ", email);

  // 2. validation - not empty
  if (
    [fullName, userName, email, passWord].some((field) => field?.trim === "")
  ) {
    throw new ApiError(400, "All fields are required...");
  }

  // 3.check if user already exists : username or email
  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User already exists...");
  }

  // 4. check for images, check for avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is reqiured...");
  }
  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover Image is required...");
  }

  // 5. upload them to cloudinary,avatar
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar is reqiured...");
  }

  // 6. create user Object-create entry in db
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    passWord,
    userName: userName.toLowerCase(),
  });

  // 7. remove password and refresh token field from response
  const createdUser = await User.findById(user._id).select(
    "-passWord -refreshToken"
  );

  // 8. check for user creation
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully."));

  res.end();
});

// This function is used to Login a user
const loginUser = asyncHandler(async (req, res) => {
  // 1. receive data from body
  // 2. using either userName or email
  // 3. check if User already exists or not
  // 4. match both passwords
  // 5. generate access & refresh tokens

  // 1. receive data from body
  const { userName, email, passWord } = req.body;

  console.log("Destructured passWord:", passWord);

  if (!(userName || email)) {
    throw new ApiError(401, "Username or email is required.");
  }

  // 2. using either userName or email
  const user = await User.findOne({
    $or: [{ userName }, { email }],
  })

  // 3. check if User already exists or not
  if (!user) {
    throw new ApiError(404, "User not found...");
  }

  // 4. match both passwords
  const isPasswordValid = await user.isPassWordCorrect(passWord);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password is Incorrect.");
  }

  // 5. generate access & refresh tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-passWord - refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In successfully."
      )
    );
});

// const loginUser = asyncHandler(async (req, res) => {
//   console.log("LOGIN REQUEST BODY:", req.body);
//   console.log("Received fields:", Object.keys(req.body || {}));

//   const { userName, email, passWord } = req.body;

//   console.log("Destructured passWord:", passWord);           // ← crucial log

//   if (!(userName || email)) {
//     throw new ApiError(400, "Username or email is required.");
//   }

//   if (!passWord) {
//     throw new ApiError(400, "Password is required.");
//   }

//   const user = await User.findOne({
//     $or: [{ userName }, { email }],
//   }).select("+passWord");

//   if (!user) {
//     throw new ApiError(404, "User not found");
//   }

//   console.log("Stored hash:", user.passWord.substring(0, 30) + "...");

//   const isPasswordValid = await user.isPassWordCorrect(passWord);

//   // ...
// });




//  This function is used to Logout a user
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out."));
});

export { registerUser, loginUser, logoutUser };
