import { Helmet } from 'react-helmet-async';
import LoginForm from '../components/auth/LoginForm.jsx';

export default function Login() {
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <Helmet><title>Login · FilmyAF</title></Helmet>
      <div className="card">
        <h1 className="heading text-3xl text-bolly-paper mb-1">Welcome back 🎬</h1>
        <p className="text-bolly-paper/60 mb-6">Log in to save, like, comment & clone.</p>
        <LoginForm />
      </div>
    </div>
  );
}
