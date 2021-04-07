import DatabaseConst from 'consts/DatabaseConst';

export default {
  name: DatabaseConst.MODELS.LESSON_GROUP,
  primaryKey: 'id',
  properties: {
    id: 'int',
    name: 'string',
    course: DatabaseConst.MODELS.COURSE,
    sort: 'int?'
  }
};
