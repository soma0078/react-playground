import { DataTable, StickyTable } from '@/components/table'
import { cn } from '@/lib/utils'

export default function TablePage() {
  return (
    <div
      className={cn(
        '*:mx-6 *:py-10',
        '[&_h3]:mb-6 [&_h3]:py-2 [&_h3]:text-center [&_h3]:text-xl [&_h3]:font-medium'
      )}
    >
      <section>
        <h3 className="bg-pink-200">Data table</h3>
        <DataTable />
      </section>
      <section>
        <h3 className="bg-purple-200">Sticky table</h3>

        <StickyTable />
      </section>
    </div>
  )
}
