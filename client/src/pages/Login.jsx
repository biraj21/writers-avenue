import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { authContext } from "../contexts/auth";

// styles for this page are in index.scss
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useContext(authContext);

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      setError(null);
      setIsSubmitting(true);

      if (password.includes(" ")) {
        throw new Error("Passwords cannot have spaces!");
      } else if (password.length < 8) {
        throw new Error("Password should be at least 8 characters long!");
      }

      const user = { email: email.trim(), password };
      await login(user);
    } catch (err) {
      console.error(err);
      if (err.response) {
        setError(err.response.data.error);
      } else {
        setError(err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page" id="login-page">
      <h2>Login</h2>

      <form action="POST" className="form" onSubmit={handleSubmit}>
        <div className="form__field">
          <label>Email:</label>
          <input
            name="email"
            type="text"
            placeholder="Email address"
            required
            value={email}
            autoComplete="username"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form__field">
          <label>Password:</label>
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <div className="error-msg">{error}</div>}

        <button type="submit" className="btn" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        <span>
          Don't have an account?
          <br />
          <Link to="/register">Create Account</Link>
        </span>
      </form>
    </div>
  );
}
