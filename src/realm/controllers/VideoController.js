const { default: BaseController } = require('./BaseController');
const { default: DatabaseConst } = require('consts/DatabaseConst');

class VideoController extends BaseController {
  model = DatabaseConst.MODELS.VIDEO;
}
export default new VideoController();
