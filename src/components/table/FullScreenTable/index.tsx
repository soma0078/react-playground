import { type Payment, useGetData } from '@/mock'
import { useEffect, useState, type CSSProperties } from 'react'

export default function FullScreenTable() {
  const [paymentData, setPaymentData] = useState<Payment[]>([])
  const [columnKeys, setColumnKeys] = useState<string[]>([])

  const data = useGetData()

  useEffect(() => {
    setColumnKeys(Object.keys(data[0]).filter((k) => k !== 'id'))
    setPaymentData(data)
  }, [data])

  const stickyStyles: CSSProperties = {
    position: 'sticky',
    // top: 0,
    top: 64,
    zIndex: 1
  }

  const y = window.scrollY
  console.log(y)

  const isScroll = y > 1
  console.log(isScroll)

  return (
    <div className="bg-gray-50">
      {/* <div className="relative overflow-x-auto"> */}
      {/* <div className="relative max-h-48 overflow-x-clip"> */}
      <div className="relative overflow-x-clip">
        <table className="relative w-full border bg-white">
          <thead>
            <tr>
              {columnKeys.map((k) => (
                <th
                  key={k}
                  className="border bg-blue-100 px-3 py-2 text-sm font-semibold"
                  style={isScroll ? stickyStyles : undefined}
                >
                  {k.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paymentData.map((v, rowIndex) => (
              <tr key={rowIndex}>
                {columnKeys.map((k) => (
                  <td key={k} className="border px-3 py-2 text-sm">
                    {v[k as keyof Payment]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
