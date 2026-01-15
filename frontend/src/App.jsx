import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from 'react'
import ProfessionalForm from './components/ProfessionalForm'
import ProfessionalTable from './components/ProfessionalTable'
import SourceFilter from './components/SourceFilter'
import { getProfessionals } from './lib/api'

const ITEMS_PER_PAGE = 30

function App() {
  const [professionals, setProfessionals] = useState([])
  const [sourceFilter, setSourceFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const fetchData = async () => {
    setLoading(true)
    try {
      const source = sourceFilter === 'all' ? null : sourceFilter
      const res = await getProfessionals(source)
      setProfessionals(res.data)
      setCurrentPage(1)
    } catch (err) {
      console.error("Failed to fetch professionals", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [sourceFilter])

  const totalItems = professionals.length
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedData = professionals.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">
              Professional Profiles
            </h1>
            <p className="text-slate-500 text-base md:text-lg">
              Manage and track professional profiles from various sources.
            </p>
          </div>
          <ProfessionalForm onSuccess={fetchData} />
        </div>

        <Card className="border border-slate-200/80 shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/50 px-6 py-5">
            <div className="space-y-1">
              <CardTitle className="text-xl font-semibold text-slate-800">All Profiles</CardTitle>
              <CardDescription className="text-slate-500">
                {loading ? 'Loading...' : `${totalItems} professional${totalItems !== 1 ? 's' : ''} registered`}
              </CardDescription>
            </div>
            <SourceFilter value={sourceFilter} onChange={setSourceFilter} />
          </CardHeader>
          <CardContent className="p-0">
            <ProfessionalTable
              data={paginatedData}
              loading={loading}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
            />
          </CardContent>
        </Card>

        <p className="text-center text-sm text-slate-400 pt-4">
          Professional Profile Management System
        </p>
      </div>
    </div>
  )
}

export default App
