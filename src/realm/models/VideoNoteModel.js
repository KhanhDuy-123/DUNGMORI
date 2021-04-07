import DatabaseConst from 'consts/DatabaseConst';

export default {
  name: DatabaseConst.MODELS.VIDEO_NOTE,
  primaryKey: 'id',
  properties: {
    id: 'int',
    video: DatabaseConst.MODELS.VIDEO,
    content: 'string',
    duration: 'string',
    createdAt: 'date?'
  }
};
