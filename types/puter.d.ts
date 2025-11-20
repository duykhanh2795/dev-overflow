declare module "@heyputer/puter.js/src/init.cjs" {
  interface PuterAI {
    chat: (message: string) => Promise<any>;
    print: (response: any) => void;
  }

  interface Puter {
    ai: PuterAI;
  }

  export function init(authToken: string): Puter;
}
