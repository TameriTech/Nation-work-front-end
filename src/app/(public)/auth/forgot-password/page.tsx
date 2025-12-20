export default function ForgotPasswordPage() {
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
