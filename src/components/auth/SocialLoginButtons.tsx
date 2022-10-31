import { signIn } from "next-auth/react";
import Button from "../styles/Button";

export default function SocialLoginButtons() {
  return (
    <>
      <div className="mx-auto flex w-3/5 flex-row items-center justify-center">
        <div className="h-0 w-full border border-neutral" />
        <h1 className="mx-2 font-bold text-neutral">Or</h1>
        <div className="h-0 w-full border border-neutral" />
      </div>
      <Button
        className="hover:bg-[#0F9D58] hover:text-white"
        onClick={() => signIn("google")}
      >
        Sign in With Google
      </Button>
      <Button
        className="hover:bg-[#0165E1] hover:text-white"
        onClick={() => signIn("facebook")}
      >
        Sign in with Facebook
      </Button>
      <Button
        className="hover:bg-[#333] hover:text-white"
        onClick={() => signIn("github")}
      >
        Sign in with GitHub
      </Button>
    </>
  );
}
