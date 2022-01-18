import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Searchbar from './components/Searchbar';
import ImageGallery from './components/ImageGallery';
import Loader from './components/Loader';
import Modal from './components/Modal';
import Button from './components/Button';
import fetchImages from './components/APIservice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [largeImage, setLargeImage] = useState('');
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    if (!searchQuery) {
      return;
    }
    setStatus('pending');
    fetchImages(searchQuery, page)
      .then(images => {
        setImages(prevState => [...prevState, ...images.hits]);
        setStatus('resolved');
        if (page !== 1) {
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
          });
        }
      })
      .catch(error => {
        setError(error);
        setStatus('rejected');
      });
  }, [searchQuery, page]);

  const handleSearchbarSubmit = searchQuery => {
    setSearchQuery(searchQuery);
    setImages([]);
    setPage(1);
  };

  const onLoadMoreClick = () => {
    setPage(prevState => prevState + 1);
  };

  const handleCloseModal = e => {
    if (e.target.nodeName === 'IMG') {
      return;
    }
    setIsOpenModal(false);
    setLargeImage('');
  };

  const handleCloseModalByEscape = () => {
    setIsOpenModal(false);
    setLargeImage('');
  };

  const handleOpenModal = e => {
    setIsOpenModal(true);
    setLargeImage(e.target.dataset.source);
  };

  return (
    <div>
      <Searchbar onSubmit={handleSearchbarSubmit} />

      <ImageGallery images={images} onOpenModal={handleOpenModal} />

      {status === 'pending' && <Loader />}
      {images.length !== 0 && (
        <Button text="Load more" onClick={onLoadMoreClick} />
      )}

      {status === 'rejected' && <h1>{error.message}</h1>}

      {isOpenModal && (
        <Modal
          largeModalImg={largeImage}
          onCloseModal={handleCloseModal}
          onClickByEscape={handleCloseModalByEscape}
        />
      )}

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

App.propTypes = {
  page: PropTypes.number,
  status: PropTypes.string,
  error: PropTypes.string,
  largeImage: PropTypes.string,
  isOpenModal: PropTypes.bool,
};
