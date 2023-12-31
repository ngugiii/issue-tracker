import styles from './Loader.module.scss';
import loaderImg from '../../../public/loader.gif';

const Loader = () => {
  return (
    <div className="fixed top-0 left-0 flex justify-center items-center w-full h-full bg-black bg-opacity-80">
      <div className="text-center">
      <img src="/loader.gif" alt="Loading..." className="w-12 h-12" />
      </div>
    </div>
  );
};

export default Loader;
