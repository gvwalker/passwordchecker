'use client'
import { useState } from "react";
let passwordChecker = require('zxcvbn');

export default function Home() {
  //const [password, setPassword] = useState('');
  const [passwordStrengh, setPasswordStrengh] = useState('very weak');
  const [passwordColor, setPasswordColor] = useState('text-red-600')
  const [timeToCrack, setTimeToCrack] = useState('less than a second')
  
  const handleCheckPassword = (password: string) => {
    const result = passwordChecker(password)
    switch (result.score) {
      case 0:
        setPasswordStrengh('very weak')
        setPasswordColor('text-red-600')
        break;
      case 1:
        setPasswordStrengh('weak')
        setPasswordColor('text-purple-600')
        break;
      case 2:
        setPasswordStrengh('good')
        setPasswordColor('text-blue-600')
        break;
      case 3:
        setPasswordStrengh('strong')
        setPasswordColor('text-teal-600')
        break;
      case 4:
        setPasswordStrengh('very strong')
        setPasswordColor('text-green-600')
        break;
    }
    setTimeToCrack(result.crack_times_display.offline_slow_hashing_1e4_per_second)
  };
  return (
    <main className="flex min-h-screen flex-col py-24">

      <div className="mb-32 text-center space-x-5">
      <input
        type="password"
        onChange={(e) => handleCheckPassword(e.target.value)}
        placeholder="Enter your password"
        className="py-2 text-2xl rounded-xl border-2 border-slate-300 text-center"
      />
      </div>
      <div className="mb-32 grid text-center"><p className={"text-lg " + passwordColor}>{passwordStrengh}</p><p className={"text-lg " + passwordColor}>{timeToCrack}</p></div>
    </main>
  )
}
