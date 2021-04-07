import DatabaseConst from 'consts/DatabaseConst';

export default {
  name: DatabaseConst.MODELS.KAIWA_CHECK,
  primaryKey: 'id',
  properties: {
    id: 'int',
    lessonId: 'int',
    count: 'int',
    lastScore: 'float?',
    lastCheck: 'date?'
  }
};
