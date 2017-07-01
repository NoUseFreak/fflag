const flag = {
  id: 'some-id',
  description: 'Some description'
}

module.exports = {
  getFlags: () => {
    return [flag, flag];
  },
  getFlag: (id) => {
    return flag;
  },
  createFlag: (flag) => {
    flag.id = 'some-new-id';
    return flag;
  }
};
