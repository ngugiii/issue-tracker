"use client";
import { useRouter } from 'next/navigation';
import { useEffect,useState } from 'react';
import { toast } from "react-toastify";
import Loader from '../loader/Loader';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('accessToken'); 
    setIsLoading(true);
    if (!isAuthenticated) {
      router.push('/');
      toast.error("Access Denied!! Please Log in to access the page")
      setIsLoading(false);
    }
  }, []);

  return (
    <>
  <>{children}</>
    </>
  )
};

export default ProtectedRoute;
