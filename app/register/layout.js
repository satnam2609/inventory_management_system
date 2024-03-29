import AuthProvider from "@/libs/AuthProvider";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function SignUpLayout({ children }) {
  return (
    <html lang="en">
      <body className="h-screen w-full">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
