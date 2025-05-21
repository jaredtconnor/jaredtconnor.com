"use client";
import styles from "./page.module.css";
import { trpc } from "./utils/trpc";

export default function Home() {
  const { data, isLoading, error } = trpc.user.getAllUsers.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log(data);
  return (
    <div className={styles.page}>
      TRPC, Next.js, Prisma, Tanstackquery starter
    </div>
  );
}
