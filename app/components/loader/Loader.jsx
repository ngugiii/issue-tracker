import styles from './Loader.module.scss';
import loaderImg from '../../../public/loader.gif';
import Image from 'next/image'

const Loader = () => {
  return (
    <div className="fixed z-10 top-0 left-0 flex justify-center items-center w-full h-full bg-black bg-opacity-80">
      <div className="text-center">
      <Image src="/loader.gif" alt="Loading..." className="w-24 h-12" width={3} height={3}/>
      </div>
    </div>
  );
};

export default Loader;
