import { useContext } from "react";

import { AdminContext } from "../context/AdminContext";

const ModalWindow = (props) => {
  const { title, content, confirmAction } = props;
  const { setIsModalOpen } = useContext(AdminContext);

  return (
    <section className="modal">
      <div className="modal__box">
        <div className="modal__header">
          <h3 className="header__title">
            <span>🚧</span>
            <b> {title}</b>
          </h3>
          <svg
            className="header__close-btn"
            onClick={() => setIsModalOpen(false)}
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 490 490"
            xmlSpace="preserve"
          >
            <polygon
              points="456.851,0 245,212.564 33.149,0 0.708,32.337 212.669,245.004 0.708,457.678 33.149,490 245,277.443 456.851,490 
	489.292,457.678 277.331,245.004 489.292,32.337 "
            />
          </svg>
        </div>
        <div className="modal__content">
          <p className="content__text">{content}</p>
        </div>
        <div className="modal__footer">
          <button className="footer__agree" onClick={confirmAction}>
            Yes
          </button>
          <button
            className="footer__cancel"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </section>
  );
};

export default ModalWindow;
