import { Alert } from "react-native"

/**
 * Abstract base class representing the result of an operation.
 * Cannot be instantiated directly.
 */
export class Result {
    /**
     * Creates an instance of Result.
     * @throws {Error} Throws an error if attempting to instantiate Result directly.
     */
    constructor() {
      if (this.constructor === Result) {
        throw new Error("Abstract classes can't be instantiated.");
      }
    }

    /**
     * Checks if the result is an instance of Ok.
     * @returns {boolean} True if the result is Ok, otherwise false.
     */
    isOk() { return this instanceof Ok }

    /**
     * Checks if the result is an instance of Err.
     * @returns {boolean} True if the result is Err, otherwise false.
     */
    isErr() { return this instanceof Err }
}

/**
 * Class representing a successful result.
 * @extends Result
 */
export class Ok extends Result {
    /**
     * Creates an instance of Ok with a value.
     * @param {*} value - The value representing the successful result.
     */
    constructor(value) {
      super()
      this.value = value
    }

    /**
     * Gets the value of the successful result.
     * @returns {*} The value of the result.
     */
    getValue() { return this.value }
}

/**
 * Class representing an error result.
 * @extends Result
 */
export class Err extends Result {
    /**
     * Creates an instance of Err with a code and message.
     * @param {string} code - The error code.
     * @param {string} message - The error message.
     */
    constructor(message) {
        super()
        this.message = message
    }

    /**
     * Gets the error message.
     * @returns {string} The error message.
     */
    getMessage() { return this.message }

    /**
     * Displays the error message in an alert dialog.
     * @returns {Err} The current instance of Err for chaining.
     */
    show() { 
      Alert.alert(this.message)
      return this
    }
}
