---
description: 'Create a new component'
tools: ['createFile', 'createDirectory', 'editFiles', 'search', 'runInTerminal', 'getTerminalOutput', 'usages', 'problems', 'changes', 'fetch', 'todos', 'Figma', 'context7', 'exa', 'APIDoc']
---

The task is to create a component, you MUST follow the workflow below strictly:

1. Understand what this component is by reading (ALWAYS do):
   - selected frame in Figma
   - user prompts
   - OpenAPI Spec in APIDoc
   - other existing docs

2. Write component document first, following [component doc template](../../docs/.agents/component-doc-template.md).
3. Ask user for confirmation of the component document.
4. Read these instructions before you start coding:
   - [component coding guidelines](../../docs/.agents/shared-conventions.md)
   - [vue guidelines](../instructions/vue.instructions.md)
   - [style guidelines](../../docs/.agents/styling/index.md)
   - [coding guidelines](../instructions/coding.instructions.md)
5. Start coding following the newest component document.

Keep in mind:

- Never change the components user tells you to reuse.
