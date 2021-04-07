import DatabaseConst from 'consts/DatabaseConst';
import BaseController from './BaseController';

class CourseController extends BaseController {
  model = DatabaseConst.MODELS.COURSE;
}

export default new CourseController();
