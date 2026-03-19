import React from 'react'
import * as LucideIcons from 'lucide-react'

interface IconRendererProps extends LucideIcons.LucideProps {
  name: string
}

export const IconRenderer: React.FC<IconRendererProps> = ({ name, ...props }) => {
  // @ts-expect-error - indexing lucide icons dynamically
  const Icon = LucideIcons[name] || LucideIcons.HelpCircle
  return <Icon {...props} />
}
