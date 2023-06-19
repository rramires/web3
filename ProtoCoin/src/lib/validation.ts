/**
 * Validation class
 */
export default class Validation {
    success: boolean;
    message: string;

    /**
     * Creates a new validation object
     * @param success boolean - if the validation was successful
     * @param message string - message if the validation failed
     */
    constructor(success: boolean = true, message: string = ""){
        this.success = success;
        this.message = message;
    }
}