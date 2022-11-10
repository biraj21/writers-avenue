import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    const user = { name, email, password, confirmPassword };
    console.log(user);
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
          <input name="avatar" type="file" required accept="image/png, image/gif, image/jpeg" />
        </div>

        <div className="form__field">
          <label>Email:</label>
          <input
            name="email"
            type="email"
            placeholder="Email address"
            required
            value={email}
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
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

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
