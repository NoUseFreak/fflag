const flag = {
  id: 'some-id',
  description: 'Some description'
}

let flags = [flag];

const getFlags = () => {
  return new Promise((resolve, reject) => {
    resolve(flags);
  });
};

const getFlag = (id) => {
  return new Promise((resolve, reject) => {
    resolve(flags.filter(item => item.id === id)[0]);
  });
};

const createFlag = (flag) => {
  return new Promise((resolve, reject) => {
    flags.push(flag);
    resolve(flag);
  });
};

const updateFlag = (id, flag) => {
  return new Promise((resolve, reject) => {
    flags = flags.reduce((acc, item) => {
      if (item.id === id) {
        item = flag;
      }
      acc.push(item);
      return acc;
    }, []);
    resolve(getFlag(id))
  });
};

const deleteFlag = (id) => {
  return new Promise((resolve, reject) => {
    flags = flags.reduce((acc, item) => {
      if (item.id !== id) {
        acc.push(item);
      }
      return acc;
    }, []);
    resolve(id);
  });
};


module.exports = {
  getFlags,
  getFlag,
  createFlag,
  updateFlag,
  deleteFlag
};
