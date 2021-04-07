import DatabaseConst from 'consts/DatabaseConst';

export default {
  name: DatabaseConst.MODELS.VIDEO,
  primaryKey: 'id',
  properties: {
    id: 'int',
    title: 'string?',
    lessonId: 'int?',
    downloadPath: 'string?',
    isDownloadFinish: 'bool?'
  }
};
