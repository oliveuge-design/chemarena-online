import yup from "yup"

export const usernameValidator = yup
  .string()
  .required("Username is required")
  .min(3, "Username cannot be less than 3 characters")
  .max(20, "Username cannot exceed 20 characters")

export const inviteCodeValidator = yup
  .string()
  .required("Invite code is required")
  .min(4, "PIN must be at least 4 digits")
  .max(6, "PIN cannot exceed 6 digits")
  .matches(/^[0-9]{4,6}$/, "PIN must be 4-6 digits")
