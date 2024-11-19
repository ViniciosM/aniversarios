import { Button } from "@/components/ui/button";
import BirthdayCardSkeletonLoading from "./birthday-card-skeleton-loading";
import { useCallback, useEffect, useState } from "react";
import { useBirthdayContext } from "../contexts/birthday-page-context";
import { useSession } from "next-auth/react";
import BirthdayList from "./birthday-list";
export function BirthdayContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { fetchBirthdays } = useBirthdayContext();
  const { data } = useSession();
  const loadBirthdays = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    await fetchBirthdays(data?.user.id ?? "", (err) => {
      setError(err);
    });
    setIsLoading(false);
  }, [fetchBirthdays, data]);

  useEffect(() => {
    loadBirthdays();
  }, [loadBirthdays]);

  if (isLoading) {
    return <BirthdayCardSkeletonLoading />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-[80%]">
        <p className="text-red-400 mb-4">
          Ocorreu um erro ao carregar os aniversários.
        </p>
        <Button onClick={loadBirthdays}>Tentar novamente</Button>
      </div>
    );
  }

  return (
    <>
      <BirthdayList></BirthdayList>
    </>
  );
}
