# MV-Ignited

A browser extension which re-imagines mediavida-forum experience.

## Project Structure

- public: Public files bundled with the extension
- src: Typescript files bundled with the extension after being build with webpack.
  - src/injected: Main file that gets injected into the forum to generate the functionality, it imports file from `/src/react` etc...

## Setup

```
pnpm install
```

## Build

```
pnpm build
```

## Build in watch mode

```
pnpm watch
```
