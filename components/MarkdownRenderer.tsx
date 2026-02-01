"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          h1: ({children}) => <h1 className="text-3xl font-bold text-white mb-6 mt-8">{children}</h1>,
          h2: ({children}) => <h2 className="text-2xl font-semibold text-white mb-4 mt-7">{children}</h2>,
          h3: ({children}) => <h3 className="text-xl font-medium text-white mb-3 mt-6">{children}</h3>,
          h4: ({children}) => <h4 className="text-lg font-medium text-white mb-2 mt-5">{children}</h4>,
          p: ({children}) => <p className="text-zinc-300 mb-4 leading-relaxed">{children}</p>,
          ul: ({children}) => <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-2">{children}</ul>,
          ol: ({children}) => <ol className="list-decimal list-inside text-zinc-300 mb-4 space-y-2">{children}</ol>,
          li: ({children}) => <li className="text-zinc-300 leading-relaxed">{children}</li>,
          blockquote: ({children}) => (
            <blockquote className="border-l-4 border-emerald-500/30 pl-6 py-3 my-6 bg-emerald-500/5 text-zinc-300 italic">
              {children}
            </blockquote>
          ),
          code: ({node, inline, children, ...props}: any) => 
            inline ? (
              <code className="bg-zinc-800 px-2 py-1 rounded text-emerald-400 text-sm font-mono" {...props}>
                {children}
              </code>
            ) : (
              <code className="block bg-zinc-800 p-4 rounded-lg text-sm font-mono overflow-x-auto text-zinc-300" {...props}>
                {children}
              </code>
            ),
          pre: ({children}) => (
            <pre className="bg-zinc-800 p-4 rounded-lg overflow-x-auto mb-6 border border-white/10">
              {children}
            </pre>
          ),
          a: ({href, children}) => (
            <a 
              href={href} 
              className="text-emerald-400 hover:text-emerald-300 underline transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          strong: ({children}) => <strong className="text-white font-semibold">{children}</strong>,
          em: ({children}) => <em className="text-zinc-200">{children}</em>,
          hr: () => <hr className="border-white/10 my-8" />,
          table: ({children}) => (
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border-collapse">
                {children}
              </table>
            </div>
          ),
          th: ({children}) => (
            <th className="border border-white/20 px-4 py-3 text-left font-semibold text-white bg-zinc-800/50">
              {children}
            </th>
          ),
          td: ({children}) => (
            <td className="border border-white/20 px-4 py-3 text-zinc-300">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
