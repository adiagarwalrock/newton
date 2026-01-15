import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChevronLeft, ChevronRight, Users } from "lucide-react"

const SOURCE_STYLES = {
  direct: "bg-blue-50 text-blue-700 border-blue-200",
  partner: "bg-violet-50 text-violet-700 border-violet-200",
  internal: "bg-emerald-50 text-emerald-700 border-emerald-200",
}

const AVATAR_COLORS = [
  "bg-gradient-to-br from-blue-500 to-blue-600",
  "bg-gradient-to-br from-violet-500 to-violet-600",
  "bg-gradient-to-br from-emerald-500 to-emerald-600",
  "bg-gradient-to-br from-amber-500 to-amber-600",
  "bg-gradient-to-br from-rose-500 to-rose-600",
  "bg-gradient-to-br from-cyan-500 to-cyan-600",
]

const getInitials = (name) => {
  if (!name) return "?"
  const parts = name.trim().split(/\s+/)
  return parts.length === 1 
    ? parts[0].substring(0, 2).toUpperCase() 
    : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const getAvatarColor = (name) => AVATAR_COLORS[name ? name.charCodeAt(0) % AVATAR_COLORS.length : 0]

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { 
  month: 'short', 
  day: 'numeric', 
  year: 'numeric' 
})

const Pagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
  if (totalPages <= 1) return null

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, '...', totalPages)
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
    }
    return pages
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-100 bg-slate-50/30">
      <p className="text-sm text-slate-500">
        Showing <span className="font-medium text-slate-700">{startItem}</span> to{' '}
        <span className="font-medium text-slate-700">{endItem}</span> of{' '}
        <span className="font-medium text-slate-700">{totalItems}</span> results
      </p>
      
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 px-2 border-slate-200 hover:bg-slate-100 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {getPageNumbers().map((page, idx) => (
          page === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-slate-400">...</span>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              className={`h-8 w-8 p-0 ${
                currentPage === page 
                  ? 'bg-slate-900 text-white hover:bg-slate-800' 
                  : 'border-slate-200 hover:bg-slate-100'
              }`}
            >
              {page}
            </Button>
          )
        ))}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 px-2 border-slate-200 hover:bg-slate-100 disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

const EmptyState = () => (
  <TableRow>
    <TableCell colSpan={5} className="h-64 text-center">
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
          <Users className="w-8 h-8 text-slate-400" />
        </div>
        <div className="space-y-1">
          <p className="text-lg font-medium text-slate-700">No professionals found</p>
          <p className="text-sm text-slate-500">Add your first professional or adjust your filters.</p>
        </div>
      </div>
    </TableCell>
  </TableRow>
)

const LoadingState = () => (
  <div className="flex items-center justify-center h-64">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-3 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
      <span className="text-slate-500 text-sm">Loading profiles...</span>
    </div>
  </div>
)

const ProfessionalRow = ({ prof, index }) => (
  <TableRow className={`hover:bg-slate-50/80 transition-colors border-b border-slate-100 last:border-0 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
    <TableCell className="py-4 pl-6">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full ${getAvatarColor(prof.full_name)} flex items-center justify-center text-white font-semibold text-sm shadow-sm`}>
          {getInitials(prof.full_name)}
        </div>
        <span className="font-medium text-slate-800 capitalize">{prof.full_name}</span>
      </div>
    </TableCell>
    <TableCell className="py-4">
      <div className="flex flex-col gap-0.5">
        {prof.email && (
          <a href={`mailto:${prof.email}`} className="text-slate-700 hover:text-blue-600 transition-colors text-sm">
            {prof.email}
          </a>
        )}
        {prof.phone && <span className="text-slate-500 text-xs">{prof.phone}</span>}
        {!prof.email && !prof.phone && <span className="text-slate-400 italic text-sm">No contact info</span>}
      </div>
    </TableCell>
    <TableCell className="py-4">
      <div className="flex flex-col gap-0.5">
        <span className="font-medium text-slate-800 text-sm">{prof.job_title}</span>
        {prof.company_name && prof.company_name.toLowerCase() !== 'na' && (
          <span className="text-slate-500 text-xs">{prof.company_name}</span>
        )}
      </div>
    </TableCell>
    <TableCell className="py-4">
      <Badge className={`${SOURCE_STYLES[prof.source] || "bg-slate-100 text-slate-600"} border font-medium text-xs px-2.5 py-0.5 capitalize`}>
        {prof.source}
      </Badge>
    </TableCell>
    <TableCell className="text-right pr-6 py-4">
      <span className="text-slate-500 text-sm">{formatDate(prof.created_at)}</span>
    </TableCell>
  </TableRow>
)

const TABLE_HEAD_CLASS = "font-semibold text-slate-600 text-xs uppercase tracking-wider py-4"

const ProfessionalTable = ({ 
  data, 
  loading,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 30,
  onPageChange = () => {}
}) => {
  if (loading) return <LoadingState />

  return (
    <div className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 border-b border-slate-100">
            <TableHead className={`${TABLE_HEAD_CLASS} pl-6`}>Name</TableHead>
            <TableHead className={TABLE_HEAD_CLASS}>Contact</TableHead>
            <TableHead className={TABLE_HEAD_CLASS}>Position</TableHead>
            <TableHead className={TABLE_HEAD_CLASS}>Source</TableHead>
            <TableHead className={`${TABLE_HEAD_CLASS} text-right pr-6`}>Added</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <EmptyState />
          ) : (
            data.map((prof, index) => (
              <ProfessionalRow key={prof.id} prof={prof} index={index} />
            ))
          )}
        </TableBody>
      </Table>
      
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
      />
    </div>
  )
}

export default ProfessionalTable
