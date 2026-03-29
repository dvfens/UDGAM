"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import styles from "@/components/admin/admin.module.css";

interface AdminLoginFormProps {
  demoHint: {
    email: string;
    password: string;
  } | null;
}

export function AdminLoginForm({ demoHint }: AdminLoginFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setMessage("Login failed. Check the organizer credentials and try again.");
      return;
    }

    setMessage("Desk unlocked. Loading controls...");
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <section className={styles.card}>
      <div className={styles.shell}>
        <p className={styles.text}>Organizer access</p>
        <h2 className={styles.title}>Unlock the Live Desk</h2>
        <p className={styles.text}>
          Scores and gallery uploads publish instantly to the public site from here.
        </p>

        {demoHint ? (
          <div className={styles.hintBox}>
            Demo login: <strong>{demoHint.email}</strong> / <strong>{demoHint.password}</strong>
          </div>
        ) : null}

        <form
          action={(formData) => {
            void handleSubmit(formData);
          }}
          className={styles.form}
        >
          <label className={styles.label}>
            Email
            <input className={styles.input} defaultValue={demoHint?.email} name="email" type="email" />
          </label>
          <label className={styles.label}>
            Password
            <input
              className={styles.input}
              defaultValue={demoHint?.password}
              name="password"
              type="password"
            />
          </label>
          <div className={styles.buttonRow}>
            <button className={styles.primaryButton} disabled={isPending} type="submit">
              {isPending ? "Signing in..." : "Enter desk"}
            </button>
          </div>
          <p className={styles.message}>{message}</p>
        </form>
      </div>
    </section>
  );
}

