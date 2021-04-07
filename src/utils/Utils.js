import Time from 'common/helpers/Time';
import listTestingAddress from 'assets/jsons/vn_state.json';

var token = '';
var deviceId = '';
var location = 'us';
var user = {};
var listCourse = [];
var resultAnswers = [];
var listCareer = [
  { id: 1, title: 'Thực tập sinh', location: 'other', name: 'Thực tập sinh' },
  { id: 2, title: 'Du học sinh Nhật Bản', location: 'jp', name: 'Du học sinh Nhật Bản' },
  { id: 3, title: 'Chuẩn bị du học', location: 'vn', name: 'Chuẩn bị du học' },
  { id: 4, title: 'Chuẩn bị đi thực tập sinh', location: 'vn', name: 'Chuẩn bị đi thực tập sinh' },
  { id: 5, title: 'Làm việc tại Việt Nam', location: 'vn', name: 'Làm việc tại Việt Nam' },
  { id: 6, title: 'Làm việc tại Nhật Bản', location: 'jp', name: 'Làm việc tại Nhật Bản' },
  { id: 7, title: 'Làm việc tự do', location: 'vn', name: 'Làm việc tự do' },
  { id: 8, title: 'Học sinh', location: 'vn', name: 'Học sinh' },
  { id: 9, title: 'Sinh viên', location: 'vn', name: 'Sinh viên' },
  { id: 10, title: 'Khác', location: 'vn', name: 'Khác' }
];
var currentTime = Time.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
const listTestingLevel = [{ id: 0, name: 'N5' }, { id: 1, name: 'N4' }, { id: 2, name: 'N3' }, { id: 3, name: 'N2' }, { id: 4, name: 'N1' }];
const listTestingRoom = [
  {},
  { course: 'N5', time_start: '-', notify: 0, color: '#73AE37' },
  { course: 'N4', time_start: '-', notify: 0, color: '#3F9FA8' },
  { course: 'N3', time_start: '-', notify: 0, color: '#6B3B89' },
  { course: 'N2', time_start: '-', notify: 0, color: '#E52A6C' },
  { course: 'N1', time_start: '-', notify: 0, color: '#CE2135' }
];

export default {
  token,
  location,
  deviceId,
  user,
  currentTime,
  listCourse,
  listCareer,
  listTestingLevel,
  listTestingAddress,
  listTestingRoom,
  resultAnswers
};
