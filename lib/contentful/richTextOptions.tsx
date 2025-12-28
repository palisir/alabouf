import { BLOCKS } from "@contentful/rich-text-types";
import type { Options } from "@contentful/rich-text-react-renderer";

export const richTextOptions: Options = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (_node, children) => <p>{children}</p>,
  },
  renderText: (text) => {
    return text.split('\n').reduce((acc, line, i, arr) => {
      acc.push(line);
      if (i < arr.length - 1) {
        acc.push(<br key={i} />);
      }
      return acc;
    }, [] as React.ReactNode[]);
  },
};

