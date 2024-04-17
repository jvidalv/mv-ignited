export function hasParentWithId(eventTarget: HTMLElement, parentId: string) {
  let currentNode: ParentNode | null | undefined = eventTarget;

  while (currentNode !== document) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (currentNode?.id === parentId) {
      return true;
    }
    currentNode = currentNode?.parentNode;
  }

  return false;
}
