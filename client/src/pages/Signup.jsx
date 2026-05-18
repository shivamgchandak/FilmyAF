import { Helmet } from 'react-helmet-async';
import SignupForm from '../components/auth/SignupForm.jsx';

export default function Signup() {
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <Helmet><title>Sign up · FilmyAF</title></Helmet>
      <div className="card">
        <h1 className="heading text-3xl text-bolly-paper mb-1">Join the cast 🎭</h1>
        <p className="text-bolly-paper/60 mb-6">Create an account to save your dramas.</p>
        <SignupForm />
      </div>
    </div>
  );
}
