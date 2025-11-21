import { DataTable, FullScreenTable, StickyTable } from '@/components/table'
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
        <h3 className="bg-purple-200">
          Sticky table{' '}
          <span className="text-sm text-red-500">
            (*cannot horizontal scroll)
          </span>
        </h3>
        <StickyTable />
      </section>
      <section>
        {/* <h3 className="bg-purple-200">FullScreen table</h3> */}
        <FullScreenTable />
      </section>
    </div>
  )
}
