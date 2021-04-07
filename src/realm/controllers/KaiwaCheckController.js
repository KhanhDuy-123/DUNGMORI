import BaseController from './BaseController';
import DatabaseConst from 'consts/DatabaseConst';

class KaiwaCheckController extends BaseController {
  model = DatabaseConst.MODELS.KAIWA_CHECK;
}
export default new KaiwaCheckController();
