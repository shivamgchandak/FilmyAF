import { Link } from 'react-router-dom';
import AuthShell from '../components/auth/AuthShell';
import SignupForm from '../components/auth/SignupForm';

export default function Signup() {
  return (
    <>
      <title>Sign up · FilmyAF</title>
      <AuthShell
        eyebrow="New face"
        heading="Join the cast"
        blurb="An account keeps every script you write, and unlocks likes, comments and clones."
        footer={
          <>
            Already have one?{' '}
            <Link to="/login" className="text-[#D6294B] hover:underline">Log in</Link>
          </>
        }
      >
        <SignupForm />
      </AuthShell>
    </>
  );
}
