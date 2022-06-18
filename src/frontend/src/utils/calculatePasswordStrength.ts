export interface PasswordRequirements {
  charNum: number;
  oneUpperCase: boolean;
  oneLowerCase: boolean;
  oneNumber: boolean;
  oneSpecialChar: boolean;
}

export const sLetters = 'abcdefghijklmnopqrstuvwxyz';
export const sNumbers = '0123456789';
export const sSymbols = '~!@#$%^&*()_+`-={}|:"<>?[]\\;\',./';

export const getNumOfUpperCase = (password: string) =>
  password.replace(/[^A-Z]/g, '').length;
export const getNumOfLowerCase = (password: string) =>
  password.replace(/[^a-z]/g, '').length;
export const getNumOfNumbers = (password: string) =>
  password.replace(/[^0-9]/g, '').length;
export const getNumOfSpecialChars = (password: string) =>
  password.replace(/[a-zA-Z0-9]/g, '').length;

export const charNumAdd = (password: string) => password.length * 4;

export const upperCaseAdd = (password: string) =>
  (password.length - getNumOfUpperCase(password)) * 2;

export const lowerCaseAdd = (password: string) =>
  (password.length - getNumOfLowerCase(password)) * 2;

export const numAdd = (password: string) => getNumOfNumbers(password) * 4;

export const specialCharsAdd = (password: string) =>
  getNumOfSpecialChars(password) * 2;

export const onlyLetterDeduc = (password: string) =>
  /[0-9]/g.test(password) ? 0 : password.length;

export const onlyNumberDeduc = (password: string) =>
  /[a-zA-Z]/g.test(password) ? 0 : password.length;

export const consecutiveUpperCaseDeduc = (password: string) => {
  let deduc = 0;
  for (let i = 0; i < password.length - 1; i++) {
    if (
      i < password.length &&
      password[i].match(/[A-Z]/) &&
      password[i + 1].match(/[A-Z]/)
    ) {
      deduc += 1;
    }
  }
  return deduc;
};

export const consecutiveLowerCaseDeduc = (password: string) => {
  let deduc = 0;
  for (let i = 0; i < password.length - 1; i++) {
    if (
      i < password.length &&
      password[i].match(/[a-z]/) &&
      password[i + 1].match(/[a-z]/)
    ) {
      deduc += 1;
    }
  }
  return deduc * 2;
};

export const consecutiveNumberDeduc = (password: string) => {
  let deduc = 0;
  for (let i = 0; i < password.length - 1; i++) {
    if (
      i < password.length &&
      password[i].match(/[0-9]/) &&
      password[i + 1].match(/[0-9]/)
    ) {
      deduc += 1;
    }
  }
  return deduc;
};

export const sequentialLetterDeduc = (password: string) => {
  let deduc = 0;
  for (let i = 0; i < sLetters.length - 3; i++) {
    const s = sLetters.substring(i, i + 3);
    if (password.indexOf(s) !== -1) {
      deduc++;
    }
  }
  return deduc * 3;
};

export const sequentialNumberDeduc = (password: string) => {
  let deduc = 0;
  for (let i = 0; i < sNumbers.length - 3; i++) {
    const s = sNumbers.substring(i, i + 3);
    if (password.indexOf(s) !== -1) {
      deduc++;
    }
  }
  return deduc * 3;
};

export const sequentialSymbolDeduc = (password: string) => {
  let deduc = 0;
  for (let i = 0; i < sSymbols.length - 3; i++) {
    const s = sSymbols.substring(i, i + 3);
    if (password.indexOf(s) !== -1) {
      deduc++;
    }
  }
  return deduc * 3;
};

export const defaultPasswordRequirements: PasswordRequirements = {
  charNum: 8,
  oneUpperCase: true,
  oneLowerCase: true,
  oneNumber: true,
  oneSpecialChar: true,
};

export const calculatePasswordStrength = (
  password: string,
  passwordRequirements = defaultPasswordRequirements
) => {
  const addition = [];
  const deduction = [];

  // check if password meets requirements
  const requirementCount =
    Object.values(passwordRequirements).filter(Boolean).length;

  const requirements = {
    charNum: password.length >= passwordRequirements.charNum,
    oneUpperCase:
      getNumOfUpperCase(password) >= 1 && passwordRequirements.oneUpperCase,
    oneLowerCase:
      getNumOfLowerCase(password) >= 1 && passwordRequirements.oneLowerCase,
    oneNumber: getNumOfNumbers(password) >= 1 && passwordRequirements.oneNumber,
    oneSpecialChar:
      getNumOfSpecialChars(password) >= 1 &&
      passwordRequirements.oneSpecialChar,
  };

  const areAllRequirementsMet =
    Object.values(requirements).filter(Boolean).length === requirementCount;

  if (areAllRequirementsMet) {
    addition.push(requirementCount * 2);
  }

  addition.push(charNumAdd(password));
  addition.push(getNumOfUpperCase(password) >= 1 ? upperCaseAdd(password) : 0);
  addition.push(lowerCaseAdd(password));
  addition.push(numAdd(password));
  addition.push(specialCharsAdd(password));

  deduction.push(onlyLetterDeduc(password));
  deduction.push(onlyNumberDeduc(password));
  deduction.push(consecutiveUpperCaseDeduc(password));
  deduction.push(consecutiveLowerCaseDeduc(password));
  deduction.push(consecutiveNumberDeduc(password));
  deduction.push(sequentialLetterDeduc(password));
  deduction.push(sequentialNumberDeduc(password));
  deduction.push(sequentialSymbolDeduc(password));

  console.log(addition, deduction);

  const total = addition.reduce((acc, curr) => acc + curr, 0);
  const totalDeduc = deduction.reduce((acc, curr) => acc + curr, 0);
  const totalScore = total - totalDeduc;

  return totalScore;
};
