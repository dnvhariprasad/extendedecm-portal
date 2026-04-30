import { LoginForm } from "@/components/admin/login-form";

export const metadata = {
  title: "Admin Login",
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-6 py-12">
      <LoginForm />
    </div>
  );
}
