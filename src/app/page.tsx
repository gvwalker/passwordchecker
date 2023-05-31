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
    </main>
  );
}
