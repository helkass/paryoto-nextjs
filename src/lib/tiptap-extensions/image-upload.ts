import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ImageUploadComponent } from "@/components/rich-text-editor/image-upload-component";

export const ImageUpload = Node.create({
  name: "imageUpload",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: null,
      },
      height: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img[data-type="image-upload"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    return ["img", { ...HTMLAttributes, "data-type": "image-upload" }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageUploadComponent);
  },
});
