import fs from 'react-native-fs';
import Funcs from './Funcs';

const Files = {
  deleteFile: async (path) => {
    try {
      let check = await fs.exists(path);
      if (check) await fs.unlink(path);
      Funcs.log('Remove file', path);
    } catch (err) {
      Funcs.log(err);
    }
  },

  getAllFileInFolder: async (path, currentFolder = '') => {
    let list = [];
    try {
      let files = await fs.readDir(path);
      for (let i = 0; i < files.length; i += 1) {
        if (files[i].isDirectory()) {
          const filesInFolder = await Files.getAllFileInFolder(path + '/' + files[i].name, files[i].name);
          list = [...list, ...filesInFolder];
        } else if (files[i].isFile()) {
          const file = currentFolder.length > 0 ? currentFolder + '/' + files[i].name : files[i].name;
          list.push(file);
        }
      }
    } catch (err) {
      Funcs.log(err);
    }
    return list;
  }
};

export default Files;
