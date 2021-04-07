import Realms from 'realm/Realms';
import Funcs from 'common/helpers/Funcs';

export default class BaseController {
  model = 'Base';

  genNewId() {
    if (!Realms.getInstance()) return 0;
    try {
      let results = Realms.getInstance()
        .objects(this.model)
        .sorted('id');
      const id = results.length > 0 ? results[results.length - 1].id + 1 : 1;
      return id;
    } catch (err) {
      Funcs.log(err);
    }
    return 1;
  }

  add(data, update = true) {
    return new Promise((resolve, reject) => {
      try {
        Realms.getInstance().write(() => {
          const realmObj = Realms.getInstance().create(this.model, data, update);
          resolve(realmObj);
        });
      } catch (err) {
        Funcs.log(err);
        reject(err);
      }
    });
  }

  getAll = () =>
    new Promise((resolve, reject) => {
      try {
        let allData = Realms.getInstance().objects(this.model);
        resolve(allData);
      } catch (err) {
        Funcs.log(err);
        reject(err);
      }
    });

  getById = (id) =>
    new Promise((resolve, reject) => {
      try {
        let object = Realms.getInstance().objectForPrimaryKey(this.model, id);
        resolve(object);
      } catch (err) {
        Funcs.log(err);
        reject(err);
      }
    });

  getBy = (key, value) =>
    new Promise((resolve, reject) => {
      try {
        let object = Realms.getInstance()
          .objects(this.model)
          .filtered(`${key}=${value}`);
        resolve(object);
      } catch (err) {
        Funcs.log(err);
        reject(err);
      }
    });

  delete = (id) =>
    new Promise((resolve, reject) => {
      try {
        Realms.getInstance().write(() => {
          let deletingVideoDownload = Realms.getInstance().objectForPrimaryKey(this.model, id);
          Realms.getInstance().delete(deletingVideoDownload);
          resolve();
        });
      } catch (err) {
        Funcs.log(err);
        reject(err);
      }
    });

  deleteObjects = (objects) =>
    new Promise((resolve, reject) => {
      try {
        Realms.getInstance().write(() => {
          Realms.getInstance().delete(objects);
          resolve(objects);
        });
      } catch (err) {
        Funcs.log(err);
        reject(err);
      }
    });

  deleteBy = (key, value) =>
    new Promise(async (resolve, reject) => {
      try {
        let objects = await this.getBy(key, value);
        await this.deleteObjects(objects);
        resolve();
      } catch (err) {
        Funcs.log(err);
        reject(err);
      }
    });
}
