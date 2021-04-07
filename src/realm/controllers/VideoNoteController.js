import DatabaseConst from 'consts/DatabaseConst';
import BaseController from './BaseController';

class VideoNoteController extends BaseController {
  model = DatabaseConst.MODELS.VIDEO_NOTE;
}
export default new VideoNoteController();
