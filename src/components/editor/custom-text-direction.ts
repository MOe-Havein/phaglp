// src/components/editor/custom-text-direction.ts
import { Extension } from "@tiptap/core";

const CustomTextDirection = Extension.create({
  name: "textDirection",
  addOptions() {
    return { types: ["paragraph", "heading", "blockquote"] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          dir: {
            default: null,
            parseHTML: (el) => el.getAttribute("dir"),
            renderHTML: (attrs) => (attrs.dir ? { dir: attrs.dir } : {}),
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setTextDirection:
        (direction: "ltr" | "rtl") =>
        ({ commands }: any) => {
          return this.options.types.every((type: string) =>
            commands.updateAttributes(type, { dir: direction }),
          );
        },
    } as any;
  },
});

export default CustomTextDirection;
