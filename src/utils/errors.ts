import { Error } from '../entities/errors';

interface ErrorResponse {
    error: Error;
}

export const useIncorrectFieldError = (field: string): ErrorResponse => {
    return {
        error: {
            fieldError: {
                field,
                message: `incorrect ${field}`
            }
        }
    }
}

export const useAlreadyExistError = (field: string ): ErrorResponse => {
    return { 
        error: {
            fieldError: {
                field,
                message: `${field} already taken`
            }
        }
    }
}

export const useCharacterRangeError = (field: string, { min = 0, max }: { min?: number, max?: number }): ErrorResponse => {
    let message: string;

    if (max && min === 0) {
        message = `${field} must be less than ${max} characters`
    } else if (max && min !== 0) {
        message = `${field} must be between ${min} and ${max} characters`
    } else if (min === 0) {
        message = `${field} must not be blank`
    } else {
        message = `${field} must be more than ${min} characters`
    }

    return {
        error: { 
            fieldError: {
                field, 
                message 
            } 
        }
    }
}

export const useUnknownError = (exceptionMessage?: string): ErrorResponse => {
    console.warn(`An unknown error has occurred. Consider replacing this error with a proper one. ${ exceptionMessage && `\n${exceptionMessage}`}`);

    return {
        error: {
            formError: {
                message: 'an unknown error has occurred'
            }
        }
    }
}