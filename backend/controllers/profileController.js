// controllers/profileController.js
import User from "../models/User.js";

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId)

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
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        profilePhoto: user.profilePhoto || "",
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
      firstName,
      lastName,
      profilePhoto,
      neckCircumference,
      waistCircumference,
      targetWeight,
    } = req.body;

    const updateData = {};

    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (profilePhoto !== undefined) updateData.profilePhoto = profilePhoto;

    if (neckCircumference !== undefined)
      updateData.neckCircumference = Number(neckCircumference);

    if (waistCircumference !== undefined)
      updateData.waistCircumference = Number(waistCircumference);

    if (targetWeight !== undefined)
      updateData.targetWeight = Number(targetWeight);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-passwordHash -refreshTokens");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        profilePhoto: updatedUser.profilePhoto,
        neckCircumference: updatedUser.neckCircumference,
        waistCircumference: updatedUser.waistCircumference,
        targetWeight: updatedUser.targetWeight,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};
