import DatabaseConst from 'consts/DatabaseConst';
import BaseController from './BaseController';

class LessonGroupController extends BaseController {
  model = DatabaseConst.MODELS.LESSON_GROUP;
}

export default new LessonGroupController();
