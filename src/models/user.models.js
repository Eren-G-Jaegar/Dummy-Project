//FOR SANDESH TO READ  main error line 71 ke wajah se aaraha hai
//line 62 - 73 tak mera handwriiten code hai jisme error aarhaha hai
//isme next() ko as function le hi nahi raha hai

//mene AI se pucha toh usne solution diya jo line 76 - 96 tak hai 
//par fir isme bhi same error aaya toh AI ne async hi hata diya aur 99 - 119 ka code provide kiya



import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, //Used for searching although it increases complexity
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //Cloudinary url
      required: true,
    },
    coverImage: {
      type: String, //Cloudinary url
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    passWord: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// userSchema.pre("save", async function (next) {
//   // If password is not modified → skip hashing
//   if (!this.isModified("passWord")) {
//       return next();
//   }

//   try {
//       // hash the password
//       this.passWord = await bcrypt.hash(this.passWord, 10);
//       next();           // very important – tell mongoose to continue
//   } catch (error) {
//       next(error);      // pass error to mongoose → it will fail the save
//   }
// });


userSchema.pre("save", async function () {
  if (!this.isModified("passWord")) return ;

  this.passWord = await bcrypt.hash(this.passWord, 10);
});

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("passWord")) {
//     return next();
//   } //If pwd field isn't modified then there is no need to hash pwd

//   try {
//     this.passWord = await bcrypt.hash(this.passWord, 10);
//     next();
//   } catch (err) {
//     next();  // pass error to Mongoose if hashing fails
//   }
// });

// Force regular function + explicit next check
// userSchema.pre("save", function (next) {   // ← NO async here for safety

//   // Debug line – must appear in console when registering
//   console.log("INSIDE PRE-SAVE HOOK – next exists?", typeof next === 'function');

//   if (!this.isModified("passWord")) {
//     console.log("Password not modified – skipping hash");
//     return next();
//   }

//   bcrypt.hash(this.passWord, 10, function(err, hash) {
//     if (err) {
//       console.log("Bcrypt hash error:", err);
//       return next(err);
//     }

//     this.passWord = hash;
//     console.log("Password hashed successfully");
//     next();
//   });
// });


// userSchema.pre("save", function (next) {
    
//   console.log("PRE-SAVE HOOK RUNNING");
//   console.log("next type:", typeof next);           // should be "function"
  
//   if (!this.isModified("passWord")) {
//       console.log("Password not modified → skipping");
//       return next();
//   }

//   bcrypt.hash(this.passWord, 10, (err, hash) => {
//       if (err) {
//           console.log("bcrypt error:", err);
//           return next(err);
//       }
      
//       this.passWord = hash;
//       console.log("Password successfully hashed");
//       next();
//   });
// });

userSchema.methods.isPassWordCorrect = async function (passWord) {
  //used to decrypt and compare pwds to verify login
  return await bcrypt.compare(passWord, this.passWord); //it will return either true or false
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
// export { generateAccessToken, generateRefreshToken };
