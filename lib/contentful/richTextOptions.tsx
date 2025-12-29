import { BLOCKS, MARKS } from "@contentful/rich-text-types";
import type { Options } from "@contentful/rich-text-react-renderer";

export const richTextOptions: Options = {
  renderMark: {
    [MARKS.BOLD]: (text) => <strong>{text}</strong>,
    [MARKS.ITALIC]: (text) => <em>{text}</em>,
    [MARKS.UNDERLINE]: (text) => <u>{text}</u>,
    [MARKS.CODE]: (text) => <code>{text}</code>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (_node, children) => <p className="mb-4">{children}</p>,
    [BLOCKS.HEADING_1]: (_node, children) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
    [BLOCKS.HEADING_2]: (_node, children) => <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>,
    [BLOCKS.HEADING_3]: (_node, children) => <h3 className="text-xl font-bold mt-5 mb-2">{children}</h3>,
    [BLOCKS.HEADING_4]: (_node, children) => <h4 className="text-lg font-bold mt-4 mb-2">{children}</h4>,
    [BLOCKS.HEADING_5]: (_node, children) => <h5 className="text-base font-bold mt-3 mb-1">{children}</h5>,
    [BLOCKS.HEADING_6]: (_node, children) => <h6 className="text-sm font-bold mt-2 mb-1">{children}</h6>,
    [BLOCKS.UL_LIST]: (_node, children) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
    [BLOCKS.OL_LIST]: (_node, children) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
    [BLOCKS.LIST_ITEM]: (_node, children) => <li className="mb-1">{children}</li>,
    [BLOCKS.QUOTE]: (_node, children) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">{children}</blockquote>,
    [BLOCKS.HR]: () => <hr className="my-6 border-gray-300" />,
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

