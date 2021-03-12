import FieldError from '../entities/FieldError';

export const useAlreadyExistError = (field: string ): FieldError => {
    return {
        field,
        message: `${field} already taken`
    }
}

export const useCharacterRangeError = (field: string, { min = 0, max }: { min?: number, max?: number }): FieldError => {
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

    return { field, message }
}

export const useUnknownError = (exceptionMessage?: string): FieldError => {
    console.warn(`An unknown error has occurred. Consider replacing this error with a proper one. ${ exceptionMessage && `\n${exceptionMessage}`}`);

    return {
        field: 'unknown',
        message: 'an unknown error has occurred'
    }
}