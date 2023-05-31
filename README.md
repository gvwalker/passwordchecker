# Password Checker

This tool allows you to check the strength of your password and whether the password has appeared in any password dumps.

You password is never sent to other services and only a portion of a hash of your password is used to determine if it has been found in any password dumps.

## Getting Started

First, install the requirements

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building

To create a static version of this site

```bash
npm run build
```
## Contributing

Please feel free to contribute by creating issues and making pull requests.

## Acknowledgements

Use of [zxcvbn](https://github.com/dropbox/zxcvbn) the excellent "low-budget" password strength meter; credit to DropBox for this excellent tool.

PasswordChecker makes use of the [HIBP](https://haveibeenpwned.com) PwnedPasswords API to determine if a password has been compromised in the past.