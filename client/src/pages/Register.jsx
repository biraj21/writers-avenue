import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { CurrentUserContext } from "../contexts/currentUserContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { setCurrentUser } = useContext(CurrentUserContext);

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      setError(null);
      setIsSubmitting(true);

      if (password.includes(" ") || confirmPassword.includes(" ")) {
        throw new Error("Passwords cannot have spaces!");
      } else if (password.length < 8) {
        throw new Error("Password should be at least 8 characters long!");
      } else if (password !== confirmPassword) {
        throw new Error("Passwords do not match!");
      }

      const user = {
        name: name.trim(),
        email: email.trim(),
        password,
        confirmPassword,
      };

      const res = await axios.post("/auth/register", user);
      setCurrentUser(res.data.data);
      navigate("/");
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
    <div className="page register">
      <h2>Create New Account</h2>

      <form action="POST" className="form" onSubmit={handleSubmit}>
        <div className="form__field">
          <label>Name:</label>
          <input
            name="name"
            type="text"
            placeholder="Your name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form__field">
          <label>Picture:</label>
          <input name="avatar" type="file" accept="image/png, image/gif, image/jpeg" />
        </div>

        <div className="form__field">
          <label>Email:</label>
          <input
            name="email"
            type="email"
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
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="form__field">
          <label>Password:</label>
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            required
            value={confirmPassword}
            autoComplete="new-password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" className="btn" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Account"}
        </button>

        <span>
          Already have an account? <Link to="/login">Login</Link>.
        </span>
      </form>
    </div>
  );
}
