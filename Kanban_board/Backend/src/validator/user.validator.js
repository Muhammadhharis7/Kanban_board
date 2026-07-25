// const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// export const isValidEmail = (email) => {
//     return emailRegex.test(email);
// };

// export const isStrongPassword = (password) => {
//     return passwordRegex.test(password);
// };

import {ApiError} from '../utils/ApiError.js'

// Check if the fields are empty
export const checkRequiredFields = (fields) => {
    if(fields.some(f => f?.trim() === "")){
        throw new ApiError(400,"All fields are required");
    }
};

// Validate email format
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email)){
        throw new ApiError(400,"Please enter a valid email")
    }
};

// Validate password strength
export const validatePassword = (password) => {
    const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&+=/,.:;"'])[A-Za-z\d@$!%*?&+=/,.:;"']{8,}$/;

    if(!passwordRegex.test(password)){
        throw new ApiError(400,"Password must be at least 8 characters and include uppercase, lowercase, number, and special character")
    }
}