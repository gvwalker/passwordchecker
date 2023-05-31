"use client";
import { FormEvent, useState } from "react";
let passwordChecker = require("zxcvbn");
let crypto = require("crypto");

export default function Home() {
  const [password, setPassword] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [passwordStrengh, setPasswordStrengh] = useState("very weak");
  const [passwordColor, setPasswordColor] = useState("text-red-600");
  const [timeToCrack, setTimeToCrack] = useState("less than a second");
  const [exposureCount, setExposureCount] = useState(0);

  const handleCheckPassword = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowResult(false);
    const result = passwordChecker(password);
    switch (result.score) {
      case 0:
        setPasswordStrengh("very weak");
        setPasswordColor("text-red-600");
        break;
      case 1:
        setPasswordStrengh("weak");
        setPasswordColor("text-purple-600");
        break;
      case 2:
        setPasswordStrengh("good");
        setPasswordColor("text-blue-600");
        break;
      case 3:
        setPasswordStrengh("strong");
        setPasswordColor("text-teal-600");
        break;
      case 4:
        setPasswordStrengh("very strong");
        setPasswordColor("text-green-600");
        break;
    }
    setTimeToCrack(
      result.crack_times_display.offline_slow_hashing_1e4_per_second
    );

    getPasswordExposureCount(password)
      .then((passwordExposureCount) => {
        setExposureCount(passwordExposureCount);
        if (passwordExposureCount > 0) {
          setPasswordColor("text-red-600");
        }
        setShowResult(true);
      })
      .catch((error) => {
        console.error(error);
        setExposureCount(-1);
        setPasswordColor("text-red-600");
        setShowResult(true);
      });
  };

  const getPasswordExposureCount = async (password: string) => {
    const passwordHash = crypto
      .createHash("sha1")
      .update(password)
      .digest("hex")
      .toUpperCase();
    const passwordHashPrefix = passwordHash.substring(0, 5);
    const passwordHashSuffix = passwordHash.substring(5);

    const apiUrl = `https://api.pwnedpasswords.com/range/${passwordHashPrefix}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.text();

      // Split the response into individual lines
      const lines = data.split("\n");

      // Find the matching password hash suffix
      const matchingLine = lines.find((line) => {
        const [hashSuffix, _] = line.split(":");
        return hashSuffix === passwordHashSuffix;
      });

      if (matchingLine) {
        const [, count] = matchingLine.split(":");
        return parseInt(count, 10);
      }

      // If no matching line is found, return 0 exposures
      return 0;
    } catch (error) {
      console.error("Error occurred while fetching password exposures:", error);
      throw error;
    }
  };

  return (
    <main className="flex min-h-screen flex-col py-24">
      <div className="mb-8 px-2 text-center">
        <h2 className="mb-8 text-5xl text-bold">Password Checker</h2>
        <p>
          This tool allows you to check the strength of your password and
          whether the password has appeared in any password dumps.
        </p>
        <p>
          You password is never sent to other services and only a portion of a
          hash of your password is used to determine if it has been found in any
          password dumps.
        </p>
      </div>
      <form
        className="mb-32 text-center space-x-5"
        onSubmit={(e) => handleCheckPassword(e)}
      >
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="py-2 text-2xl rounded-xl border-2 border-slate-300 text-center"
        />
        <button
          type="submit"
          className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Check Password
        </button>
      </form>
      {showResult == true && (
        <div className="grid text-center">
          <p className={"text-lg " + passwordColor}>
            Your password strength is <b>{passwordStrengh}</b>
          </p>
          <p className={"text-lg " + passwordColor}>
            It would take <b>{timeToCrack}</b> to crack this password
          </p>
        </div>
      )}
      {showResult && exposureCount > 0 && (
        <div className="mb-32 grid text-center">
          <p className={"text-lg " + passwordColor}>
            Your password has been exposed in <b>{exposureCount}</b> password
            dumps
          </p>
        </div>
      )}
      <div className="mt-auto mb-8 text-center text-xs text-slate-500">
        <p>
          This tool makes use of the{" "}
          <a className="underline" href="https://github.com/dropbox/zxcvbn">
            zxcvbn
          </a>{" "}
          package to calculate password strengh.
        </p>
        <p>
          It also makes use of the{" "}
          <a className="underline" href="https://haveibeenpwned.com/Passwords">
            HIBP Pwned Passwords API
          </a>{" "}
          in order to determine if a password has been compromised.
        </p>
      </div>
      <div className="self-center">
        <a href="https://github.com/gvwalker/passwordchecker">
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          role="img"
          viewBox="0 0 24 24"
          height="2em"
          width="2em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title></title>
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
        </svg>
        </a>
      </div>
    </main>
  );
}
