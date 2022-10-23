import { NextPage } from "next";
import AuthenticatedRoute from "./AuthenticatedRoute";

export default function requireAuthenticatedRoute(protectedPage: NextPage): NextPage {
    const ProtectedPage = protectedPage;

    const AuthenticatedPage: NextPage = (props) => {
        return (
            <AuthenticatedRoute>
                <ProtectedPage {...props} />
            </AuthenticatedRoute>
        )
    }

    return AuthenticatedPage;
}