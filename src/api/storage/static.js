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

const user = {
  id: 'some-id',
  description: 'Some description'
}

let users = [user];

const getUsers = () => {
  return new Promise((resolve, reject) => {
    resolve(users);
  });
};

const getUser = (id) => {
  return new Promise((resolve, reject) => {
    resolve(users.filter(item => item.id === id)[0]);
  });
};

const createUser = (user) => {
  return new Promise((resolve, reject) => {
    users.push(user);
    resolve(user);
  });
};

const updateUser = (id, user) => {
  return new Promise((resolve, reject) => {
    users = users.reduce((acc, item) => {
      if (item.id === id) {
        item = user;
      }
      acc.push(item);
      return acc;
    }, []);
    resolve(getUser(id))
  });
};

const deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    users = users.reduce((acc, item) => {
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
  deleteFlag,
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
};

