export default function ForgotPasswordPage() {
  // TODO: Implement forgot password functionality
  return (
    <div>
      <h1>Forgot Password</h1>
      <form>
        <label>
          Email:
          <input type="email" name="email" required />
        </label>
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}
