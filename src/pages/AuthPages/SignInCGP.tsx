import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInFormCGP from "../../components/auth/SignInFormCGP";

export default function SignInCGP() {
  return (
    <>
      <PageMeta
        title="Página que muestra el login"
        description="This is React.js SignIn Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <AuthLayout>
        <SignInFormCGP />
      </AuthLayout>
    </>
  );
}
