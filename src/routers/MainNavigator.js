import WebViewScreen from 'common/components/base/WebViewScreen';
import { createStackNavigator } from 'react-navigation';
import { ConfirmOTPScreen, CreateNewPasswordScreen, ForgotPasswordScreen, IntroAppScreen, ParentAuthenticateScreen, SplashScreen } from 'screens/authenticate';
import ChatScreen from 'screens/chat/ChatScreen';
import {
  BuyCourseScreen,
  ChooseLessionScreen,
  DetailBuyCourseScreen,
  DetailComboScreen,
  DetailCourseScreen,
  DetailLessonScreen,
  DetailListBanner,
  DetaiShareLearnScreen
} from 'screens/course';
import CourseProgressScreen from 'screens/course/info/CourseProgressScreen';
import DetailCourseNewScreen from 'screens/course/info/DetailCourseNewScreen';
import BookingKaiwaScreen from 'screens/course/lession/BookingKaiwaScreen';
import GetIdSkypeTutoriol from 'screens/course/lession/containers/containers/GetIdSkypeTutoriol';
import QuickTestScreen from 'screens/course/lession/containers/QuickTestScreen';
import VocabularyScreen from 'screens/course/lession/VocabularyScreen';
import TeacherScreen from 'screens/course/teachers/TeacherScreen';
import DebugScreen from 'screens/DebugScreen';
import { DetailTeacherScreen, NewfeedScreen } from 'screens/newfeed';
import {
  ChangePasswordScreen,
  DetailPayment,
  EnterCodeScreen,
  HistoryTestScreen,
  MyCourseScreen,
  MyProfileScreen,
  NotifyScreen,
  PaymentHistoryScreen,
  ProfileScreen
} from 'screens/profile';
import KaiwaForTeacherScreen from 'screens/profile/KaiwaForTeacherScreen';
import HistoryTestLessonResultScreen from 'screens/profile/infoCourse/HistoryTestLessonResultScreen';
import EditInfoUserScreen from 'screens/profile/myProfile/EditInfoUserScreen';
import CourseOfflineScreen from 'screens/profile/offlineCourse/CourseOfflineScreen';
import DetailVideoOfflineScreen from 'screens/profile/offlineCourse/DetailVideoOfflineScreen';
import ExchangePolicyScreen from 'screens/profile/policyApp/ExchangePolicyScreen';
import SecurityPolicyScreen from 'screens/profile/policyApp/SecurityPoliceScreen';
import TermOfUseScreen from 'screens/profile/policyApp/TermOfUseScreen';
import ConfirmInfoScreen from 'screens/test/ConfirmInfoScreen';
import KaiwaCertidicateScreen from 'screens/test/KaiwaCertidicateScreen';
import ShowAnswersScreen from 'screens/test/ShowAnswersScreen';
import TestingScreen from 'screens/test/TestingScreen';
import TestScreen from 'screens/test/TestScreen';
import UpdateProfileCertificateScreen from 'screens/test/UpdateProfileCertificateScreen';
import Configs from 'utils/Configs';
import ScreenNames from '../consts/ScreenName';
import BlogScreen from '../screens/course/lession/BlogScreen';
import DetailSeriScreen from '../screens/course/lession/DetailSeriScreen';
import TabHome from './TabHome';
import TabQuickTest from './TabQuickTest';
import DetailIntensiveTopic from 'screens/course/info/DetailIntensiveTopic';
import CategoryScreen from 'screens/course/info/DetailIntensiveTopic/CategoryScreen';
import TestIntensiveTopicScreen from 'screens/course/info/DetailIntensiveTopic/DetailIntensiveTopicScreen';
import CertificateLuyenDeScreen from 'screens/course/info/DetailIntensiveTopic/DetailIntensiveTopicScreen/CertificateLuyenDeScreen';
import ListVideoCorrectScreen from 'screens/course/info/DetailIntensiveTopic/DetailIntensiveTopicScreen/ListVideoCorrectScreen';

const MainNavigator = createStackNavigator(
  {
    [ScreenNames.SplashScreen]: { screen: SplashScreen },
    [ScreenNames.IntroAppScreen]: { screen: IntroAppScreen },
    [ScreenNames.ParentAuthenticateScreen]: { screen: ParentAuthenticateScreen },
    [ScreenNames.ForgotPasswordScreen]: { screen: ForgotPasswordScreen },
    [ScreenNames.ConfirmOTPScreen]: { screen: ConfirmOTPScreen },
    [ScreenNames.CreateNewPasswordScreen]: { screen: CreateNewPasswordScreen },
    [ScreenNames.HomeScreen]: { screen: TabHome },
    [ScreenNames.ChatScreen]: { screen: ChatScreen },
    [ScreenNames.ProfileScreen]: { screen: ProfileScreen },
    [ScreenNames.EditInfoUserScreen]: { screen: EditInfoUserScreen },
    [ScreenNames.ChangePasswordScreen]: { screen: ChangePasswordScreen },
    [ScreenNames.ChooseLessionScreen]: { screen: ChooseLessionScreen },
    [ScreenNames.CourseProgressScreen]: { screen: CourseProgressScreen },
    [ScreenNames.BuyCourseScreen]: { screen: BuyCourseScreen },
    [ScreenNames.NewfeedScreen]: { screen: NewfeedScreen },
    [ScreenNames.MyProfileScreen]: { screen: MyProfileScreen },
    [ScreenNames.MyCourseScreen]: { screen: MyCourseScreen },
    [ScreenNames.EnterCodeScreen]: { screen: EnterCodeScreen },
    [ScreenNames.DetailCourseScreen]: { screen: DetailCourseScreen },
    [ScreenNames.TestScreen]: { screen: TestScreen },
    [ScreenNames.DetailComboScreen]: { screen: DetailComboScreen },
    [ScreenNames.DetaiShareLearnScreen]: { screen: DetaiShareLearnScreen },
    [ScreenNames.DetailListBanner]: { screen: DetailListBanner },
    [ScreenNames.DetailLessonScreen]: { screen: DetailLessonScreen },
    [ScreenNames.DetailBuyCourseScreen]: { screen: DetailBuyCourseScreen },
    [ScreenNames.NotifyScreen]: { screen: NotifyScreen },
    [ScreenNames.HistoryTestScreen]: { screen: HistoryTestScreen },
    [ScreenNames.PaymentHistoryScreen]: { screen: PaymentHistoryScreen },
    [ScreenNames.DetailTeacherScreen]: { screen: DetailTeacherScreen },
    [ScreenNames.DetailPayment]: { screen: DetailPayment },
    [ScreenNames.HistoryTestLessonResultScreen]: { screen: HistoryTestLessonResultScreen },
    [ScreenNames.VocabularyScreen]: { screen: VocabularyScreen },
    [ScreenNames.BookingKaiwaScreen]: { screen: BookingKaiwaScreen },
    [ScreenNames.GetIdSkypeTutoriol]: { screen: GetIdSkypeTutoriol },
    [ScreenNames.CourseOfflineScreen]: { screen: CourseOfflineScreen },
    [ScreenNames.DetailVideoOfflineScreen]: { screen: DetailVideoOfflineScreen },
    [ScreenNames.TestingScreen]: { screen: TestingScreen, navigationOptions: { gesturesEnabled: false } },
    [ScreenNames.BlogScreen]: { screen: BlogScreen },
    [ScreenNames.DetailSeriScreen]: { screen: DetailSeriScreen },
    [ScreenNames.ShowAnswersScreen]: { screen: ShowAnswersScreen },
    [ScreenNames.WebViewScreen]: { screen: WebViewScreen },
    [ScreenNames.ExchangePolicyScreen]: { screen: ExchangePolicyScreen },
    [ScreenNames.TermOfUseScreen]: { screen: TermOfUseScreen },
    [ScreenNames.SecurityPolicyScreen]: { screen: SecurityPolicyScreen },
    [ScreenNames.UpdateProfileCertificateScreen]: { screen: UpdateProfileCertificateScreen },
    [ScreenNames.KaiwaCertidicateScreen]: { screen: KaiwaCertidicateScreen },
    [ScreenNames.ConfirmInfoScreen]: { screen: ConfirmInfoScreen, navigationOptions: { gesturesEnabled: false } },
    [ScreenNames.DebugScreen]: DebugScreen,
    [ScreenNames.TabQuickTest]: { screen: TabQuickTest },
    [ScreenNames.QuickTestScreen]: { screen: QuickTestScreen },
    [ScreenNames.TeacherScreen]: { screen: TeacherScreen },
    [ScreenNames.DetailCourseNewScreen]: { screen: DetailCourseNewScreen },
    [ScreenNames.KaiwaForTeacherScreen]: { screen: KaiwaForTeacherScreen },
    [ScreenNames.DetailIntensiveTopic]: { screen: DetailIntensiveTopic },
    [ScreenNames.CategoryScreen]: { screen: CategoryScreen },
    [ScreenNames.TestIntensiveTopicScreen]: { screen: TestIntensiveTopicScreen },
    [ScreenNames.CertificateLuyenDeScreen]: { screen: CertificateLuyenDeScreen },
    [ScreenNames.ListVideoCorrectScreen]: { screen: ListVideoCorrectScreen }
  },
  {
    headerMode: 'none',
    initialRouteName: Configs.startScreen ? Configs.startScreen : 'SplashScreen'
  }
);
export default MainNavigator;
