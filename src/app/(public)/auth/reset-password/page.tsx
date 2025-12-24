export default function ResetPasswordPage() {
  // TODO: Implement reset password functionality
  return (
    <div>
      <h1>Reset Password</h1>
      <form>
        <label>
          New Password:
          <input type="password" name="new-password" required />
        </label>
        <button type="submit">Set New Password</button>
      </form>
    </div>
  );
}
