import SocialLoginButtons from "@/components/auth/SocialLoginButtons";
import Button from "@/components/styles/Button";
import { trpc } from "@/utils/trpc";
import { NextPage } from "next";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import Router from "next/router";
import { useForm } from "react-hook-form";

type FormData = {
  email: string;
  password: string;
};

export const SignUpPage: NextPage = ({ redirect, error, callbackUrl }: any) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const createUser = trpc.auth.createUser.useMutation();

  const onSubmit = async (data: FormData) => {
    const { email, password } = data;
    const result = await createUser.mutateAsync({ email, password });
    if (!result) {
      // TODO: handle error
    }
    if (result) {
      await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      Router.push(redirect || "/");
    }
  };

  return (
    <div className="flex min-h-screen w-screen items-center justify-center">
      <div className="m-5 flex h-full w-full flex-col space-y-4 border border-neutral bg-accent p-8 md:h-1/2 md:w-1/2 xl:h-1/4 xl:w-1/4">
        <h1 className="text-center text-3xl font-extrabold text-neutral">
          Sign Up
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-1"
        >
          <label className="text-md ml-1 text-neutral">Email</label>
          <input
            {...register("email", { required: true })}
            autoComplete="off"
            className="h-10 w-full border border-neutral bg-white p-1"
          />
          <label className="text-md ml-1 text-neutral">Password</label>
          <input
            {...register("password", { required: true, minLength: 8 })}
            type="password"
            autoComplete="off"
            className="h-10 w-full border border-neutral bg-white p-1 focus:border"
          />
          <div className="h-2" />
          <Button>
            <input
              type="submit"
              value="Sign Up"
              className="hover:cursor-pointer"
            />
          </Button>
          <Link href="/auth/signin">
            <h1 className="ml-1 w-fit pt-2 text-sm font-semibold text-neutral underline hover:cursor-pointer">
              Sign In
            </h1>
          </Link>
        </form>
        <SocialLoginButtons />
      </div>
    </div>
  );
};

export const getServerSideProps = async (context: any) => {
  const { req } = context;
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: {
        destination: "/", // Redirect to the home page if the user is already signed in
      },
    };
  }

  const { redirect, error, callbackUrl } = context.query;
  const props: any = {};
  if (redirect) props["redirect"] = redirect;
  if (error) props["error"] = error;
  if (callbackUrl) props["callbackUrl"] = callbackUrl;
  return {
    props, // will be passed to the page component as props
  };
};

export default SignUpPage;
