//helper function
const properFormat = (val) => {
  if (val > 9) return val;
  return `0${val}`;
};

module.exports = properFormat;
