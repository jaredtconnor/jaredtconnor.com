import * as React from 'react'

const styles =
  'w-full rounded-md text-gray-1000 dark:text-gray-100 px-4 py-2 bg-gray-1000 dark:bg-white dark:bg-opacity-5 bg-opacity-5 hover:bg-opacity-10 border border-gray-200 dark:border-gray-700 focus:border-gray-1000 focus:outline-none focus:ring-0 dark:focus:border-gray-600'

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={styles} {...props} />
}

export function Textarea({ 
  rows = 1, 
  ...props 
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={rows}
      className={`${styles} block resize-none`}
      {...props}
    />
  )
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={styles} {...props} />
}