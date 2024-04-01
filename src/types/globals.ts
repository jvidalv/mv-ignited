declare global {
  interface Window {
    ignite: {
      isFirstRender: boolean;
      render: () => Promise<void>;
      // roots : {
      //     get : (rootKey: string) => Root | undefined
      //     set : (rootKey: string, root: Root) => Root
      // }
    };
  }
}

export {};
