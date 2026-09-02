import { Link } from 'react-router-dom';
import AuthShell from '../components/auth/AuthShell';
import LoginForm from '../components/auth/LoginForm';

export default function Login() {
  return (
    <>
      <title>Log in · FilmyAF</title>
      <AuthShell
        eyebrow="Returning cast"
        heading="Welcome back"
        blurb="Log in to keep your scripts, like, comment and clone."
        footer={
          <>
            No account yet?{' '}
            <Link to="/signup" className="text-[#D6294B] hover:underline">Create one</Link>
          </>
        }
      >
        <LoginForm />
      </AuthShell>
    </>
  );
}
