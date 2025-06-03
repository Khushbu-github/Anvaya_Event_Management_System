import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoginForm from '../components/LoginForm';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { isAuthenticated } from '../lib/auth';

const Login = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard/student'); // or redirect based on role
    }
  }, [navigate]);
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-primary mb-6">
            <ArrowLeft size={16} className="mr-1" />
            <span>Back to Home</span>
          </Link>
          
          <div className="max-w-md mx-auto">
            <LoginForm />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
