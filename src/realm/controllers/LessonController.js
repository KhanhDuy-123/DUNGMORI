import DatabaseConst from 'consts/DatabaseConst';
import BaseController from './BaseController';

class LessonController extends BaseController {
  model = DatabaseConst.MODELS.LESSON;
}

export default new LessonController();
