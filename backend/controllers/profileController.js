// controllers/profileController.js
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select(
      "-passwordHash -refreshTokens -emailVerificationCode -emailVerificationExpires"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        name: user.name || "",
        profilePhoto: user.profilePhoto || "",
        height: user.height || 0,
        gender: user.gender || "",
        neckCircumference: user.neckCircumference || 0,
        waistCircumference: user.waistCircumference || 0,
        targetWeight: user.targetWeight || 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      name,
      neckCircumference,
      waistCircumference,
      targetWeight,
      height,
    } = req.body;

    const updateData = {};


    if (name !== undefined) updateData.name = name;

    if (neckCircumference !== undefined)
      updateData.neckCircumference = Number(neckCircumference);

    if (waistCircumference !== undefined)
      updateData.waistCircumference = Number(waistCircumference);

    if (targetWeight !== undefined)
      updateData.targetWeight = Number(targetWeight);

    if (height !== undefined)
      updateData.height = Number(height);


    // 🔹 Upload profile photo to Cloudinary
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString(
          "base64"
        )}`,
        {
          folder: "profiles",
          public_id: `user_${userId}`,
          overwrite: true,
        }
      );

      updateData.profilePhoto = uploadResult.secure_url;
    }

    console.log(updateData)
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-passwordHash -refreshTokens");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        name: updatedUser.name,
        profilePhoto: updatedUser.profilePhoto,
        neckCircumference: updatedUser.neckCircumference,
        waistCircumference: updatedUser.waistCircumference,
        targetWeight: updatedUser.targetWeight,
        height: updatedUser.height
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

