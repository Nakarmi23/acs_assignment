const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*\(\)_+`\-=\{\}|:"<>?\[\]\\;\',./])[A-Za-z\d~!@#$%^&*\(\)_+`\-=\{\}|:"<>?\[\]\\;\',./]{8,}$/g;

export default passwordRegex;
