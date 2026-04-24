// src/components/auth/RegisterButton.tsx
type RegisterButtonProps = {
  loading: boolean;
};

export default function RegisterButton({ loading }: RegisterButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-purple-600 hover:bg-purple-700 active:scale-[0.99]
                 text-white font-medium py-2.5 rounded-md transition
                 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? "Creating account..." : "Create Account"}
    </button>
  );
}