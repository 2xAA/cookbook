const fractions = {
  125: "⅛",
  16: "⅙",
  2: "⅕",
  25: "¼",
  33: "⅓",
  375: "⅜",
  4: "⅖",
  5: "½",
  6: "⅗",
  66: "⅔",
  75: "¾",
  8: "⅘",
  833: "⅚",
};

export const prettyFractions = (number) => {
  const remainder = (number % 1).toString().split(".").pop();
  const whole = Number(number.toString().split(".").shift());

  if (fractions[remainder]) {
    return `${whole > 0 ? `${whole} ` : ""}${fractions[remainder]}`;
  }

  return number;
};
