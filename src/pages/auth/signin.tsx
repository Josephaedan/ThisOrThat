import Button from "@/components/button/Button";
import { motion } from "framer-motion";
import { NextPage } from "next";
import { GetServerSideProps } from "next";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { FieldValues, FormState, useForm } from "react-hook-form";

type FormData = {
  email: string;
  password: string;
};

export const SignInPage: NextPage<{
  redirect?: string;
  error?: string;
  callbackUrl: string;
}> = ({ redirect, error, callbackUrl }) => {
  const router = useRouter();

  console.log(redirect, error, callbackUrl);
  // if (callbackUrl && typeof window !== "undefined") router.push(callbackUrl);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const { email, password } = data;
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (result?.error) {
      console.log(result.error);
    }
  };

  return (
    <div className="flex min-h-screen w-screen items-center justify-center overflow-hidden">
      {/* <div className="absolute bottom-0 right-0 h-full w-full overflow-hidden">
        <div className="absolute bottom-0 -right-40">
          <Image
            // animate={{
            //   transition: { duration: 0.5 },
            //   translateX: 10,
            //   translateY: 10,
            // }}
            src="/../public/purple.png"
            alt="purple"
            layout="fill"
            // className="h-96 w-96"
          />
        </div>
      </div> */}

      <div className="m-5 flex h-full w-full flex-col space-y-4 rounded-lg bg-accent p-8 md:h-1/2 md:w-1/2 xl:h-1/4 xl:w-1/4">
        <h1 className="text-center text-3xl font-extrabold text-neutral">
          Sign In to
          <br /> This or That
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-1"
        >
          <label className="text-md ml-1 text-neutral">Email</label>
          <input
            defaultValue="email"
            {...register("email", { required: true })}
            autoComplete="off"
            className="h-10 w-full rounded-md border border-neutral bg-white p-1"
          />
          <label className="text-md ml-1 text-neutral">Password</label>
          <input
            {...register("password", { required: true })}
            type="password"
            autoComplete="off"
            className="h-10 w-full rounded-md border border-neutral bg-white p-1 focus:border"
          />
          <div className="h-2" />
          <Button>
            <input
              type="submit"
              value="Sign In"
              className="hover:cursor-pointer"
            />
          </Button>
          <Link href="/auth/signup">
            <h1 className="ml-1 w-fit pt-2 text-sm font-semibold text-neutral underline hover:cursor-pointer">
              Sign up
            </h1>
          </Link>
        </form>
        <div className="flex flex-row items-center justify-center">
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
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { redirect, error, callbackUrl } = context.query;
  const props: any = {};
  if (redirect) props["redirect"] = redirect;
  if (error) props["error"] = error;
  if (callbackUrl) props["callbackUrl"] = callbackUrl;
  return {
    props, // will be passed to the page component as props
  };
};

export default SignInPage;
