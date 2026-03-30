import Link from "next/link"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion"

interface MobileNavItemProps {
  title: string
  items?: { name: string; slug: string }[]
  href: string
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const MobileNavItem = ({
  href,
  title,
  items,
  setIsOpen,
}: MobileNavItemProps) => {
  const baseItemClass =
    "active:text-textHover flex justify-start items-center px-10 py-4 text-base font-semibold text-white hover:bg-white/5 w-full bg-slate-800/20"

  if (!items)
    return (
      <Link
        href={`/${href}`}
        onClick={() => setIsOpen(false)}
        className={baseItemClass}
      >
        {title}
      </Link>
    )

  return (
    <AccordionItem value={href} className="border-none">
      <AccordionTrigger
        className={`${baseItemClass} hover:no-underline data-[state=open]:text-textHover`}
      >
        {title}
      </AccordionTrigger>
      <AccordionContent className="bg-slate-900/50 pb-0">
        <div className="grid grid-cols-2 gap-2 p-4 px-10">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={`/${href}/${item.slug}`}
              onClick={() => setIsOpen(false)}
              className="rounded-md bg-primary/5 py-2 text-center text-sm font-semibold text-primary/80 no-underline! transition-colors hover:text-textHover!"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

export default MobileNavItem
