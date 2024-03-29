import KakaoApi from "../api/KakaoApi";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Join from "./Join";
import MemberApi from "../api/MemberApi";
import Common from "../util/Common";
import { UserContext } from "../context/UserStore";
import Loading from "../component/Kakao/Loading";
import Modal from "../util/Modal";

const Kakao = () => {
  const navigate = useNavigate();
  const context = useContext(UserContext);
  const { setLoginStatus } = context;

  // 카카오 엑세스 토큰 요청을 위한 코드
  const code = new URL(window.location.href).searchParams.get("code");
  // console.log(code);

  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState("");
  const [kakaoId, setKakaoId] = useState("");
  const [isMember, setIsMember] = useState("");

  const kakaoToken = async () => {
    try {
      const res = await KakaoApi.getToken(code);
      if (res.data) {
        // console.log(res.data.access_token);
        kakaoUser(res.data.access_token);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const kakaoUser = async (token) => {
    try {
      const res = await KakaoApi.getInfo(token);
      // console.log("kakaoUser", typeof res.data);
      if (res.data !== "") {
        setIsMember(!res.data.isMember);
        if (!res.data.isMember) {
          setEmail(res.data.userInfo.kakao_account.email);
          setProfile(
            Common.convertToHttps(
              res.data.userInfo.kakao_account.profile.profile_image_url
            )
          );
          setKakaoId(res.data.userInfo.id);
        }
      } else if (res.data === "") {
        handleModal("오류", "이미 일반회원으로 사용중인 이메일입니다", false);
      }
      if (res.data.isMember) {
        login(res.data.userInfo.kakao_account.email, res.data.userInfo.id);
      }
    } catch (e) {
      console.error("카카오 로그인 중 에러 발생 :", e);
      handleModal(
        "오류",
        "오류가 발생 했습니다 \n 로그인창으로 돌아갑니다.",
        false
      );
    }
  };

  const login = async (email, password) => {
    // console.log("카카오 로그인!");
    try {
      const res = await MemberApi.login(email, password);
      // console.log(res.data);
      if (res.data.grantType === "Bearer") {
        // console.log("KL accessToken : " + res.data.accessToken);
        // console.log("KL refreshToken : " + res.data.refreshToken);
        Common.setAccessToken(res.data.accessToken);
        Common.setRefreshToken(res.data.refreshToken);
        setLoginStatus(true);
        navigate("/");
      }
    } catch (err) {
      console.log("로그인 에러 : " + err);
      handleModal(
        "오류",
        "오류가 발생 했습니다 \n 로그인창으로 돌아갑니다.",
        false
      );
    }
  };

  useEffect(() => {
    kakaoToken();
  }, []);
  // 카카오 정보 확인
  // useEffect(() => {
  //   console.log("isMember : " + isMember);
  //   console.log("email : " + email);
  //   console.log("profile : " + profile);
  //   console.log("id : " + kakaoId);
  // }, [isMember, email, profile, kakaoId]);

  //Modal
  const [openModal, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [modalHeader, setModalHeader] = useState("");
  const [modalType, setModalType] = useState(null);

  // 모달 닫기
  const closeModal = (num) => {
    setModalOpen(false);
    navigate("/login");
  };
  const handleModal = (header, msg, type) => {
    setModalOpen(true);
    setModalHeader(header);
    setModalMsg(msg);
    setModalType(type);
  };

  return (
    <>
      {isMember && <Join email={email} kakaoId={kakaoId} profile={profile} />}
      {!isMember && <Loading />}
      <Modal
        open={openModal}
        close={closeModal}
        header={modalHeader}
        children={modalMsg}
        type={modalType}
      />
    </>
  );
};
export default Kakao;
