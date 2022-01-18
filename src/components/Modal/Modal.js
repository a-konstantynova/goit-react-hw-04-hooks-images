import { useEffect } from 'react';
import PropTypes from 'prop-types';
import s from './Modal.module.css';

export default function Modal({
  onCloseModal,
  onClickByEscape,
  largeModalImg,
}) {
  useEffect(() => {
    window.addEventListener('keydown', closeModalByEscape);

    return () => {
      window.removeEventListener('keydown', closeModalByEscape);
    };
  });

  const closeModalByEscape = e => {
    if (e.key !== 'Escape') {
      return;
    }
    onClickByEscape();
  };

  return (
    <div className={s.overlay} onClick={onCloseModal}>
      <div className={s.modal}>
        <img src={largeModalImg} alt="" />
      </div>
    </div>
  );
}

Modal.propTypes = {
  onCloseModal: PropTypes.func.isRequired,
  largeModalImg: PropTypes.string.isRequired,
  onClickByEscape: PropTypes.func.isRequired,
};
