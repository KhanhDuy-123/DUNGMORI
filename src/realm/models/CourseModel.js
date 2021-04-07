import DatabaseConst from 'consts/DatabaseConst';

export default {
  name: DatabaseConst.MODELS.COURSE,
  primaryKey: 'id',
  properties: {
    id: 'int',
    name: 'string?',
    expiredDate: 'date'
  }
};
