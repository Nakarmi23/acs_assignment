export interface PasswordRequirements {
  charNum: number;
  oneUpperCase: boolean;
  oneLowerCase: boolean;
  oneNumber: boolean;
  oneSpecialChar: boolean;
}

export const defaultPasswordRequirements: PasswordRequirements = {
  charNum: 8,
  oneUpperCase: true,
  oneLowerCase: true,
  oneNumber: true,
  oneSpecialChar: true,
};

export const lettersSequence = 'abcdefghijklmnopqrstuvwxyz';
export const numberSequence = '0123456789';
export const symbolSequence = '~!@#$%^&*()_+`-={}|:"<>?[]\\;\',./';

// base functions
export const getNumOfUpperCase = (password: string) =>
  // replace everything except UpperCase characters with empty string
  password.replace(/[^A-Z]/g, '').length;

export const getNumOfLowerCase = (password: string) =>
  // replace everything except LowerCase characters with empty string
  password.replace(/[^a-z]/g, '').length;

export const getNumOfNumbers = (password: string) =>
  // replace everything except numbers characters with empty string
  password.replace(/[^0-9]/g, '').length;

export const getNumOfSpecialChars = (password: string) =>
  // replace everything except special characters with empty string
  password.replace(/[a-zA-Z0-9]/g, '').length;

// points functions for addition
const getRequirementMetPoint = (
  passwordRequirements: PasswordRequirements,
  password: string
) => {
  // get number of requirements which are set to true or have value greater than 0
  const requirementCount =
    Object.values(passwordRequirements).filter(Boolean).length;

  const requirements = {
    // only check if requirement is met if charNum in passwordRequirements is greater than 0
    charNum:
      passwordRequirements.charNum &&
      password.length >= passwordRequirements.charNum,
    // only check other requirements if oneUpperCase, oneLowerCase, oneNumber, and oneSpecialChar in variable passwordRequirements are true
    oneUpperCase:
      passwordRequirements.oneUpperCase && getNumOfUpperCase(password) >= 1,
    oneLowerCase:
      passwordRequirements.oneLowerCase && getNumOfLowerCase(password) >= 1,
    oneNumber: passwordRequirements.oneNumber && getNumOfNumbers(password) >= 1,
    oneSpecialChar:
      passwordRequirements.oneSpecialChar &&
      getNumOfSpecialChars(password) >= 1,
  };

  // check if all requirements are met`
  const areAllRequirementsMet =
    Object.values(requirements).filter(Boolean).length === requirementCount;

  if (areAllRequirementsMet) {
    return requirementCount * 2;
  }

  return 0;
};

export const getPassLengthPoint = (password: string) => password.length * 4;

export const getUpperCasePoint = (password: string) =>
  (password.length - getNumOfUpperCase(password)) * 2;

export const getLowerCasePoint = (password: string) =>
  (password.length - getNumOfLowerCase(password)) * 2;

export const getNumberPoint = (password: string) =>
  getNumOfNumbers(password) * 4;

export const getSpecialCharPoint = (password: string) =>
  getNumOfSpecialChars(password) * 2;

// points functions for subtraction
export const getOnlyLetterPenalty = (password: string) =>
  /[0-9]/g.test(password) ? 0 : password.length;

export const getOnlyNumberPenalty = (password: string) =>
  /[a-zA-Z]/g.test(password) ? 0 : password.length;

export const getConsecutivePenalty = (patten: RegExp, password: string) => {
  let deduc = 0;
  for (let i = 0; i < password.length - 1; i++) {
    // check if current and next character are of the same type (number, letter or symbol)
    if (
      i < password.length &&
      password[i].match(patten) &&
      password[i + 1].match(patten)
    ) {
      deduc++;
    }
  }
  return deduc;
};

export const getSequentialPenalty = (sequence: string, password: string) => {
  let deduc = 0;
  for (let i = 0; i < sequence.length - 3; i++) {
    // Example:
    // i = 0
    // sequence = '01234567890'
    // then s = '012' because s is the 3 characters from i to i+3

    const s = sequence.substring(i, i + 3);

    // check if s is in password
    if (password.indexOf(s) !== -1) {
      deduc++;
    }
  }
  return deduc * 3;
};

export const calculatePasswordStrength = (
  password: string,
  passwordRequirements = defaultPasswordRequirements
) => {
  // using points to indicate the strength of the password.

  // points for length, uppercase, lowercase, number, special char and if all requirements are met
  const addition = [
    getRequirementMetPoint(passwordRequirements, password),
    getPassLengthPoint(password),
    getUpperCasePoint(password),
    getLowerCasePoint(password),
    getNumberPoint(password),
    getSpecialCharPoint(password),
  ];

  // Penalty points for: using only letters, using only numbers, consecutive and sequential characters, numbers and special characters
  const penalty = [
    getOnlyLetterPenalty(password),
    getOnlyNumberPenalty(password),
    // get deduction for consecutive characters, numbers, and symbols
    getConsecutivePenalty(/[A-Z]/, password),
    getConsecutivePenalty(/[a-z]/, password),
    getConsecutivePenalty(/[0-9]/, password),
    // get deduction for sequential characters, numbers, and symbols
    getSequentialPenalty(lettersSequence, password),
    getSequentialPenalty(numberSequence, password),
    getSequentialPenalty(symbolSequence, password),
  ];

  // calculate total points
  const total = addition.reduce((acc, curr) => acc + curr, 0);

  // calculate total points after Penalty
  const totalPenalty = penalty.reduce((acc, curr) => acc + curr, 0);

  const totalScore = total - totalPenalty;

  return totalScore;
};
