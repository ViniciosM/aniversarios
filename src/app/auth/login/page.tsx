import { Metadata } from "next";
import { UserAuthForm } from "./components/user-auth-form";

export const metadata: Metadata = {
  title: "Login - App Aniversários",
  description: "Faça login para gerenciar seus lembretes de aniversário.",
};

export default function AuthenticationPage() {
  return (
    <div className="relative h-screen flex-col items-center justify-center flex lg:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative h-full flex-col bg-primary/60 p-10 text-primary-foreground dark:border-r hidden lg:flex">
        <div className="absolute inset-0 bg-primary/60" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
          </svg>
          App Aniversários
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Com o App Aniversários, nunca mais esqueci um aniversário!
              É tão fácil de usar e me ajuda a ser mais atencioso com meus
              amigos e familiares.&rdquo;
            </p>
            <footer className="text-sm">Vinicius</footer>
          </blockquote>
        </div>
      </div>
      <div className="flex justify-center p-8 lg:p-8 w-full bg-background">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-primary">
              Bem-vindo ao App Aniversários
            </h1>
            <p className="text-sm text-muted-foreground">
              Faça login com sua conta Google para começar a gerenciar
              aniversários
            </p>
          </div>
          <UserAuthForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Ao fazer login, você concorda com nossos{" "}
            <a
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Termos de Serviço
            </a>{" "}
            e{" "}
            <a
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Política de Privacidade
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
