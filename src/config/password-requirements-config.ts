export const passwordRequirementsConfig = {
  minLength: 8, // default: 8
  maxLength: 32, // default: 32; max: 64
  hasNumbers: true, // default: true
  hasSpecialCharacters: true, // default: true
  hasUpperAndLowerCaseLetters: true, // default: true

  getRegex() {
    if (this.maxLength > 64) {
      throw new Error("max password length is larger than maximum allowed value"); //due to db restrictions
    }
    if (this.maxLength < this.minLength) {
      throw new Error("min password length is larger than max password length");
    }

    return new RegExp(
      "/^" + this.hasNumbers
        ? "(?=.*[0-9])"
        : "" + this.hasSpecialCharacters
        ? "(?=[*.!@#$%^&(){}[]:;<>,.?/~_+-=|\\])"
        : "" + this.hasUpperAndLowerCaseLetters
        ? "(?=.*[a-z])(?=.*[A-Z])"
        : "" + `.{${this.minLength}, ${this.maxLength}}$/`
    );
  },
  getDescription() {
    const hasAddionalRequirements = this.hasNumbers || this.hasSpecialCharacters || this.hasUpperAndLowerCaseLetters;
    const addionalRequirements: string[] = [];
    if (this.hasUpperAndLowerCaseLetters) {
      addionalRequirements.push("upper and lowercase letter");
    }
    if (this.hasNumbers) {
      addionalRequirements.push("number");
    }
    if (this.hasSpecialCharacters) {
      addionalRequirements.push("special character");
    }

    return `password has to be between ${this.minLength} and ${this.maxLength} characters in length${
      hasAddionalRequirements ? ` and contain at least one: ${addionalRequirements.join()}` : ""
    } `;
  },
};
