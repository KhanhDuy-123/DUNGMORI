import DatabaseConst from 'consts/DatabaseConst';

export default {
  name: DatabaseConst.MODELS.LESSON,
  primaryKey: 'id',
  properties: {
    id: 'int',
    group: DatabaseConst.MODELS.LESSON_GROUP,
    course: DatabaseConst.MODELS.COURSE,
    name: 'string',
    content: 'string?',
    sort: 'int?'
  }
};
