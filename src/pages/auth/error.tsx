import { NextPage } from "next";
import { GetServerSideProps } from "next";

interface PageProps {
    error?: string;
}

const ErrorPage: NextPage<PageProps> = ({error}: PageProps) => {
    return (
        <>
        <h1>{error ?? "Error Encountered"}</h1>
        </>
    );
    }

export const getServerSideProps: GetServerSideProps = async (context) => {
    const {error} = context.query;
    if (!error) {
        return {
            props: {},
        }
    }
    return {
        props: {error}, // will be passed to the page component as props
    }
}

export default ErrorPage;