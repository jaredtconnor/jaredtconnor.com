import React from 'react'
import { cn } from '@/lib/utils'

interface RichTextNode {
  type?: string
  children?: (RichTextNode | string)[]
  [key: string]: unknown
}

type RichTextContent = RichTextNode | string | (RichTextNode | string)[]

interface RichTextProps {
  content: RichTextContent
  className?: string
}

export const RichText = ({ content, className }: RichTextProps) => {
  if (!content) {
    return null
  }

  const renderNode = (node: RichTextNode | string, index: number): React.ReactNode => {
    if (typeof node === 'string') {
      return node
    }

    if (Array.isArray(node)) {
      return node.map((child, i) => renderNode(child, i))
    }

    const { type, children, ...props } = node

    switch (type) {
      case 'h1':
        return (
          <h1 key={index} {...props}>
            {children?.map((child: RichTextNode | string, i: number) => renderNode(child, i))}
          </h1>
        )
      case 'h2':
        return (
          <h2 key={index} {...props}>
            {children?.map((child: RichTextNode | string, i: number) => renderNode(child, i))}
          </h2>
        )
      case 'h3':
        return (
          <h3 key={index} {...props}>
            {children?.map((child: RichTextNode | string, i: number) => renderNode(child, i))}
          </h3>
        )
      case 'h4':
        return (
          <h4 key={index} {...props}>
            {children?.map((child: RichTextNode | string, i: number) => renderNode(child, i))}
          </h4>
        )
      case 'h5':
        return (
          <h5 key={index} {...props}>
            {children?.map((child: RichTextNode | string, i: number) => renderNode(child, i))}
          </h5>
        )
      case 'h6':
        return (
          <h6 key={index} {...props}>
            {children?.map((child: RichTextNode | string, i: number) => renderNode(child, i))}
          </h6>
        )
      case 'p':
        return (
          <p key={index} {...props}>
            {children?.map((child: RichTextNode | string, i: number) => renderNode(child, i))}
          </p>
        )
      case 'ul':
        return (
          <ul key={index} {...props}>
            {children?.map((child: RichTextNode | string, i: number) => renderNode(child, i))}
          </ul>
        )
      case 'ol':
        return (
          <ol key={index} {...props}>
            {children?.map((child: RichTextNode | string, i: number) => renderNode(child, i))}
          </ol>
        )
      case 'li':
        return (
          <li key={index} {...props}>
            {children?.map((child: RichTextNode | string, i: number) => renderNode(child, i))}
          </li>
        )
      case 'a':
        return (
          <a key={index} {...props}>
            {children?.map((child: RichTextNode | string, i: number) => renderNode(child, i))}
          </a>
        )
      case 'strong':
        return (
          <strong key={index} {...props}>
            {children?.map((child: RichTextNode | string, i: number) => renderNode(child, i))}
          </strong>
        )
      case 'em':
        return (
          <em key={index} {...props}>
            {children?.map((child: RichTextNode | string, i: number) => renderNode(child, i))}
          </em>
        )
      case 'code':
        return (
          <code key={index} {...props}>
            {children?.map((child: RichTextNode | string, i: number) => renderNode(child, i))}
          </code>
        )
      case 'pre':
        return (
          <pre key={index} {...props}>
            {children?.map((child: RichTextNode | string, i: number) => renderNode(child, i))}
          </pre>
        )
      case 'blockquote':
        return (
          <blockquote key={index} {...props}>
            {children?.map((child: RichTextNode | string, i: number) => renderNode(child, i))}
          </blockquote>
        )
      case 'hr':
        return <hr key={index} {...props} />
      case 'br':
        return <br key={index} {...props} />
      case 'img':
        return <img key={index} {...props} alt={(props.alt as string) || ''} />
      default:
        return (
          <span key={index}>
            {children?.map((child: RichTextNode | string, i: number) => renderNode(child, i))}
          </span>
        )
    }
  }

  return (
    <div className={cn('prose prose-lg', className)}>
      {Array.isArray(content) 
        ? content.map((node, index) => renderNode(node, index))
        : renderNode(content, 0)
      }
    </div>
  )
}
