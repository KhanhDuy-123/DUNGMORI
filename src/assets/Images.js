import CourseConst from 'consts/CourseConst';

const Images = {
  icPlane: require('./images/ic_plane.png'),
  icCamera: require('./images/ic_camera.png'),
  smile: require('./images/smile.png'),
  icComment: require('./images/ic_comment.png'),
  like: require('./images/like.png'),
  iconPhoto: require('./images/ic_photo.png'),
  iconLike: require('./images/ic_like.png'),
  iconSticker: require('./images/ic_smile.png'),
  iconSend: require('./images/ic_send.png'),
  iconNotSend: require('./images/ic_not_send.png'),
  iconCall: require('./images/ic_call.png'),
  share: require('./images/share.png'),
  send: require('./images/send.png'),
  logo: require('./images/logo.png'),
  icHeart: require('./images/ic_heart.png'),
  icHeart2: require('./images/ic_heart2.png'),
  icChat: require('./images/ic_chat.png'),
  icChat2: require('./images/ic_chat2.png'),
  icTest: require('./images/ic_test.png'),
  icTest2: require('./images/ic_test2.png'),
  icPerson: require('./images/ic_person.png'),
  icPerson2: require('./images/ic_person2.png'),
  icLeft: require('./images/ic_left.png'),
  icRight: require('./images/ic_right.png'),
  icCircleLession: require('./images/ic_circle.png'),
  imLogin: require('./images/im_login.png'),
  imRegister: require('./images/im_register.png'),
  imPregnant: require('./images/im_pregnant.png'),
  imPregnant1: require('./images/im_pregnant1.png'),
  imPregnant2: require('./images/im_pregnant2.png'),
  buyCourse: require('./images/im_buyCourse.png'),
  bgEju: require('./images/bg_eju.png'),
  logoGif: require('./images/logo_gif.gif'),
  logoChangePass: require('./images/ic_change_pass.gif'),
  welcomeGif: require('./images/welcome.gif'),
  icPause: require('./images/ic_pause.png'),
  icPlay: require('./images/ic_play.png'),
  icRotate: require('./images/ic_rotate.png'),
  icUp: require('./images/ic_up.png'),
  icDown: require('./images/ic_down.png'),
  icFullScreen: require('./images/ic_full_screen.png'),
  icNext10s: require('./images/ic_next10s.png'),
  icBack10s: require('./images/ic_back10s.png'),
  icNoti: require('./images/ic_noti.png'),
  icCode: require('./images/ic_code.png'),
  icChangePass: require('./images/ic_changepass.png'),
  icLogout: require('./images/ic_logout.png'),
  icCource: require('./images/ic_cource.png'),
  determinationGif: require('./images/ic_determination.gif'),
  imChangePass: require('./images/im_change_pass.png'),
  noBuyCoursegif: require('./images/no_buy_course.gif'),
  icEmpty: require('./images/ic_empty.png'),
  imgLowPoint: require('./images/diemkem.gif'),
  imgHightPoint: require('./images/congrats.gif'),
  icAvatar: require('./images/ic_image.png'),
  imgEmpty: require('./images/img_empty.png'),
  noAvt: require('./images/no_avt.png'),
  testGif: require('./images/test_gif.gif'),
  hocTiepGif: require('./images/hoctiep.gif'),
  intro1: require('./images/intro1.png'),
  intro2: require('./images/intro2.png'),
  intro3: require('./images/intro3.png'),
  intro4: require('./images/intro4.png'),
  icEJU: require('./images/ic_EJU.png'),
  icJLPT: require('./images/ic_JLPT.png'),
  icKAIWA: require('./images/ic_KAIWA_1.png'),
  icCap: require('./images/ic_cap.png'),
  iconForgotPass: require('./images/forgot_pass.gif'),
  iconNewPass: require('./images/new_pass.gif'),
  iconConfirmCode: require('./images/confirm_code.gif'),
  img25Percent: require('./images/25percent.gif'),
  img50Percent: require('./images/50percent.gif'),
  img75Percent: require('./images/75percent.gif'),
  img100Percent: require('./images/100percent.gif'),
  icCmt: require('./images/ic_cmt.png'),
  icMenu: require('./images/ic_menu.png'),
  imgTopBg: require('./images/topbg.png'),
  imLogoDungmori: require('./images/logoDungmori.png'),
  imgN5: require('./images/N5.jpg'),
  imgN4: require('./images/N4.jpg'),
  imgN3: require('./images/N3.jpg'),
  imgN2: require('./images/N2.jpg'),
  imgN1: require('./images/N1.jpg'),
  imgLogoJLPT: require('./images/test_jlpt.png'),
  imgFooter: require('./images/img_footer.png'),
  icHideVideo: require('./images/ic_hide_video.png'),
  icon: {
    icN1: require('./images/ic_n1.png'),
    icN2: require('./images/ic_n2.png'),
    icN3: require('./images/ic_n3.png'),
    icN4: require('./images/ic_n4.png'),
    icN5: require('./images/ic_n5.png'),
    icPracticeN1: require('./images/icPracticeN1.png'),
    icPracticeN2: require('./images/icPracticeN2.png'),
    icPracticeN3: require('./images/icPracticeN3.png'),
    icPracticeN4: require('./images/icPracticeN4.png'),
    icEJU: require('./images/ic_ejuu.png'),
    'icchuyen nganh': require('./images/ic_chuyennganh.png'),
    'icN2+N1': require('./images/ic_n1_n2.png'),
    'icN4+N3': require('./images/ic_n3_n4.png'),
    'icN3+N2': require('./images/ic_n3_n2.png'),
    'icN4+N3+N2': require('./images/ic_n4_n3_n2.png'),
    'icN3+N2+N1': require('./images/ic_n3_n2_n1.png'),
    'icN4+N3 N2+N1': require('./images/ic_n4_n3_n2_n1.png'),
    icKaiwa: require('./images/icon_KAIWA.png'),
    icBuyKaiwaSoCap: require('./images/kaiwa/ic_so_cap.png'),
    icBuyKaiwaTrungCap: require('./images/kaiwa/ic_trung_cap.png'),
    'icEJU TN': require('./images/eju/eju_tn.png'),
    'icEJU - Toán': require('./images/eju/eju_toan.png'),
    'icEJU - XHTH': require('./images/eju/eju_xh.png'),
    'icEJU TN - Toán': require('./images/eju/eju_tn_toan.png'),
    'icEJU TN - XHTH': require('./images/eju/eju_tn_xh.png'),
    'icEJU Toán + XHTH': require('./images/eju/eju_xh_toan.png'),
    'icEJU TN - XHTH - Toán': require('./images/eju/eju_tn_toan_xh.png')
  },
  imTeacher: require('./images/teacher.png'),
  gifLogin: require('./images/Login.gif'),
  icKaiwaComent: require('./images/ic_kaiwa_comment.png'),
  icTesting: require('./images/ic_testing.png'),
  icTestTime: require('./images/ic_test_time.png'),
  icLichSu: require('./images/ic_lichsu.png'),
  icThiThu: require('./images/ic_thithu.png'),
  icRank: require('./images/ic_xephang.png'),
  imgDocument: require('./images/img_document.png'),
  imgFlashCard: require('./images/img_flashcard.png'),
  imgTest: require('./images/img_test.png'),
  icCheck: require('./images/ic_dat.png'),
  icNo1: require('./images/ic_no1.png'),
  icNo2: require('./images/ic_no2.png'),
  icNo3: require('./images/ic_no3.png'),
  icTeacher: require('./images/icTeacher.png'),
  icActiveNoti: require('./images/ic_noti_active.png'),
  icInActiveNoti: require('./images/ic_noti_inactive.png'),
  icHomeKaiwa: require('./images/ic_home_kaiwa.png'),
  bannerKaiwa1: require('./images/banner_kaiwa1.png'),
  bannerKaiwa2: require('./images/banner_kaiwa2.png'),
  bannerKaiwa3: require('./images/banner_kaiwa3.png'),
  bannerKaiwa4: require('./images/banner_kaiwa4.png'),
  icAdmin: require('./images/dungmori.png'),
  icSkype: require('./images/skype.png'),
  icFlashcard: require('./images/ic_Flashcard.jpg'),
  imTutoriol1: require('./images/huongdan1.png'),
  imTutoriol2: require('./images/huongdan2.png'),
  imTutoriol3: require('./images/huongdan3.png'),
  icDownload: require('./images/download.png'),
  N1a: require('./images/ic_n1a.png'),
  N1b: require('./images/ic_n1b.png'),
  N2a: require('./images/ic_n2a.png'),
  N2b: require('./images/ic_n2b.png'),
  N3a: require('./images/ic_n3a.png'),
  N3b: require('./images/ic_n3b.png'),
  N4a: require('./images/ic_n4a.png'),
  N4b: require('./images/ic_n4b.png'),
  EJUTOANa: require('./images/eju_toana.png'),
  EJUTOANb: require('./images/eju_toanb.png'),
  EJUXHTHa: require('./images/eju_xhtha.png'),
  EJUXHTHb: require('./images/eju_xhthb.png'),
  EJUTNa: require('./images/eju_japana.png'),
  EJUTNb: require('./images/eju_japanb.png'),
  KAIWAa: require('./images/ic_kaiwaa.png'),
  KAIWAb: require('./images/ic_kaiwab.png'),
  KAIWASOCAPa: require('./images/ic_kaiwa_so_capa.png'),
  KAIWASOCAPb: require('./images/ic_kaiwa_so_capb.png'),
  KAIWATRUNGCAPa: require('./images/ic_kaiwa_trung_capa.png'),
  KAIWATRUNGCAPb: require('./images/ic_kaiwa_trung_capb.png'),
  iconLamp: require('./images/icon_lamp.png'),
  icSound: require('./images/ic_sound.png'),
  icNoInternet: require('./images/no_internet.png'),
  icSecurity: require('./images/baomat.png'),
  icThiThuFocus: require('./images/ic_thithufocus.png'),
  icLichSuFocus: require('./images/ic_lichsufocus.png'),
  icCheckCircle: require('./images/check_circle.png'),
  icTime: require('./images/ic_time_complete.png'),
  icOnline: require('./images/ic_online.png'),
  IcCalendar: require('./images/ic_calendar.png'),
  icDropDown: require('./images/ic_dropdown.png'),
  icSuccess: require('./images/ic_success.png'),
  icCancel: require('./images/ic_cancel.png'),
  imgDegree: require('./images/img_degree.jpg'),
  logoGreen: require('./images/logo_green.png'),
  icTimeToTest: require('./images/ic_time_to_test.png'),
  icOclock: require('./images/ic_oclock.png'),
  icLang: require('./images/iconLang.png'),
  imgTestJLPT: require('./images/img_test_jlpt.png'),
  imgStampDungMori: require('./images/stamp.png'),
  imgTesting: require('./images/testing.png'),
  icXepHangFocus: require('./images/ic_xephang_focus.png'),
  imTesta: require('./images/ic_worka.png'),
  imTestb: require('./images/ic_workb.png'),
  imCommenta: require('./images/im_cmta1.png'),
  imCommentb: require('./images/im_cmtb1.png'),
  imDocumenta: require('./images/im_doca.png'),
  imDocumentb: require('./images/im_docb.png'),
  icArrowUp: require('./images/ic_arrow_up.png'),
  icArrowDown: require('./images/ic_arrow_down.png'),
  icError: require('./images/ic_error.png'),
  gifKaiwaLvS: require('./images/kaiwa/gift_kaiwa_lvs.gif'),
  gifKaiwaLvA: require('./images/kaiwa/gift_kaiwa_lva.gif'),
  gifKaiwaLvB: require('./images/kaiwa/gift_kaiwa_lvb.gif'),
  gifKaiwaLvC: require('./images/kaiwa/gift_kaiwa_lvc.gif'),
  imCalendar: require('./images/im_calendar.png'),
  imVideoDownload: require('./images/ic_video_download.png'),
  icTreeLeft: require('./images/ic_tree_left.png'),
  icTreeRight: require('./images/ic_tree_right.png'),
  icShape: require('./images/ic_shape.png'),
  imCheckCircle: require('./images/ic_check_circle.png'),
  icCertificate: require('./images/ic_certificate.png'),
  icCertiGreen: require('./images/ic_certi_green.png'),
  icForwad: require('./images/ic_forwad.png'),
  icScore: require('./images/ic_score.png'),
  icTotalScore: require('./images/ic_total_score.png'),
  icZoom: require('./images/ic_zoom.png'),
  bgKaiwa: require('./images/bg_kaiwa.png'),
  icStamp: require('./images/ic_stamp.png'),
  icFb: require('./images/ic_fb.png'),
  icSignature: require('./images/ic_signature.png'),
  teacherBackground: require('./images/teachers/teacher_bg.png'),
  icKanji: require('./images/ic_kanji.png'),
  icVocabulary: require('./images/ic_vocabulary.png'),
  icGramar: require('./images/ic_gramar.png'),
  icExtend: require('./images/ic_extend.png'),
  imExpert: require('./images/im_expert.png'),
  icIntersect: require('./images/ic_intersect.png'),
  icRectangle: require('./images/ic_rectangle.png'),
  icTreeline: require('./images/ic_treeline.png'),
  icDoc: require('./images/ic_doc.png'),
  icQuestion: require('./images/ic_question.png'),
  icVideo: require('./images/ic_video.png'),
  ejuJapan: require('./images/eju/eju_japan.png'),
  ejuMath: require('./images/eju/eju_math.png'),
  ejuSocial: require('./images/eju/eju_social.png'),
  imgClass: require('./images/teachers/img_class.png'),
  icLock: require('./images/ic_lock.png'),
  icFlash: require('./images/ic_flascard.png'),
  imgTeacherBackgound: require('./images/teachers/teacher_background.jpg'),
  imgTeacherBackgound2: require('./images/teachers/teacher_bg2.jpg'),
  icTakeGift: require('./images/ic_take_gift.png'),
  icKaiwaTrungCap: require('./images/kaiwa/ic_kaiwa_trung_cap.png'),
  icKaiwaSoCap: require('./images/kaiwa/ic_kaiwa_so_cap.png'),
  icKaiwaNormal: require('./images/kaiwa/ic_kaiwa_normal.png'),
  imCertificate: require('./images/im_cetificate.jpg'),
  icEyes: require('./images/ic_eyes.png'),
  icLa: require('./images/ic_la.png'),
  icHoaLeft: require('./images/ic_hoa_left.png'),
  icHoaRight: require('./images/ic_hoa_right.png'),
  icCay: require('./images/ic_cay.png'),
  icBackgroundCerti: require('./images/ic_background_certi.png'),
  icShareGift: require('./images/share_gift.png'),
  icShoppingCart: require('./images/ic_shopping_cart.png'),
  icCourse: require('./images/ic_course.png'),
  icLoa: require('./images/ic_loa.png'),
  icGiftBox: require('./images/ic_gift_box.png'),
  icClose: require('./images/ic_close.png'),
  icPlus: require('./images/ic_plus.png'),
  icDot: require('./images/ic_dot.png'),
  icTeacherText: require('./images/ic_teacher_text.png'),
  icGoogle: require('./images/ic_google.png'),
  icKaiwaBanner: require('./images/ic_kaiwa_banner.png'),
  icAddition: require('./images/ic_addition.png'),
  icAdditionN4: require('./images/ic_n4_addition.png'),

  intensive: {
    icDocument: require('./images/intensiveTopic/icDocument.png'),
    icPen: require('./images/intensiveTopic/icPen.png'),
    icPlayVideo: require('./images/intensiveTopic/icPlayVideo.png'),
    icFile: require('./images/intensiveTopic/icFile.png'),
    iconSnow: require('./images/intensiveTopic/iconSnow.png'),
    iconLesson: require('./images/intensiveTopic/icLesson.png'),
    icCheckCircle: require('./images/intensiveTopic/icCheckCircle.png'),
    icCheck: require('./images/intensiveTopic/icCheck.png'),
    icCloseCircle: require('./images/intensiveTopic/icCloseCircle.png'),
    icChevron: require('./images/intensiveTopic/icChevron.png'),
    icDoWork: require('./images/intensiveTopic/icDoWork.png'),
    icEditWork: require('./images/intensiveTopic/icEditWork.png'),
    icWatch: require('./images/intensiveTopic/icWatch.png'),
    imCertificate: require('./images/intensiveTopic/imCertificate.png')
  },

  getIconBuyCourse: (courseId, comboName) => {
    if (comboName) return Images.icon[`ic${comboName}`];
    if (!courseId) courseId = 0;
    switch (parseInt(courseId)) {
      default:
        return null;
      case CourseConst.N1.ID:
        return Images.icon.icN1;
      case CourseConst.N2.ID:
        return Images.icon.icN2;
      case CourseConst.N3.ID:
        return Images.icon.icN3;
      case CourseConst.N4.ID:
        return Images.icon.icN4;
      case CourseConst.N5.ID:
        return Images.icon.icN5;
      case CourseConst.KAIWA.ID:
        return Images.icon.icKaiwa;
      case CourseConst.KAIWA_SOCAP.ID:
        return Images.icon.icBuyKaiwaSoCap;
      case CourseConst.KAIWA_TRUNGCAP.ID:
        return Images.icon.icBuyKaiwaTrungCap;
      case CourseConst.EJU_TN.ID:
        return Images.icon['icEJU TN'];
      case CourseConst.EJU_TOAN.ID:
        return Images.icon['icEJU - Toán'];
      case CourseConst.EJU_XHTH.ID:
        return Images.icon['icEJU - XHTH'];
      case CourseConst.N4_ADDITIONAL.ID:
        return Images.icAdditionN4;
    }
  }
};

export default Images;
