import { styled } from "styled-components";
import UseTerm from "./UseTerm";
import PrivacyTerm from "./PrivacyTerm";

const ModalStyle = styled.div`
  .modal {
    display: none;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 1000;
  }

  .openModal {
    display: flex;
    align-items: center;
    /* 팝업이 열릴때 스르륵 열리는 효과 */
    animation: modal-bg-show 0.8s;
  }

  section {
    width: 90%;
    max-width: 450px;
    margin: 0 auto;
    border-radius: 0.3rem;
    background-color: white;
    /* 팝업이 열릴때 스르륵 열리는 효과 */
    animation: modal-show 0.3s;
    overflow: hidden;
    header {
      position: relative;
      padding: 16px 64px 16px 16px;
      background-color: var(--RED);
      font-weight: 600;
      color: #fff;
      button {
        position: absolute;
        top: 15px;
        right: 15px;
        width: 30px;
        font-size: 21px;
        font-weight: 700;
        /* text-align: center; */
        color: #999;
        background-color: transparent;
      }
    }
    .agreeBox {
      padding: 16px;
      height: 50vh;
      border-bottom: 2px solid #dee2e6;
      /* text-align: center; */
      color: #333;
      /* overflow-y: scroll; */
    }
    footer {
      padding: 12px 16px;
      text-align: right;
      button {
        padding: 6px 12px;
        color: #fff;
        background-color: var(--RED);
        border-radius: 5px;
        font-size: 13px;
      }
    }
  }

  @keyframes modal-show {
    from {
      opacity: 0;
      margin-top: -50px;
    }
    to {
      opacity: 1;
      margin-top: 0;
    }
  }
  @keyframes modal-bg-show {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Button = styled.button`
  outline: none;
  cursor: pointer;
  margin-right: 10px;
  border: 0;
  width: 60px;
`;

const AgreementModal = (props) => {
  const { open, close, type } = props;

  return (
    <ModalStyle>
      <div className={open ? "openModal modal" : "modal"}>
        {open && (
          <section>
            <header>
              {type && type === "use" ? "이용약관" : "개인정보 취급방침"}
            </header>
            <div className="agreeBox">
              {type && type === "use" ? <UseTerm /> : <PrivacyTerm />}
            </div>
            <footer>
              <Button onClick={close}>확인</Button>
            </footer>
          </section>
        )}
      </div>
    </ModalStyle>
  );
};
export default AgreementModal;
