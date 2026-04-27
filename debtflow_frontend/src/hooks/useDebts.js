import { useState, useEffect, useCallback } from 'react'
import { debtApi } from '../api/debtApi'
import toast from 'react-hot-toast'

const useDebts = () => {
    const [debts, setDebts]       = useState([])
    const [loading, setLoading]   = useState(true)
    const [total, setTotal]       = useState(0)
    const [page, setPage]         = useState(0)
    const [pageSize, setPageSize] = useState(10)

    const fetchDebts = useCallback(async () => {
        setLoading(true)
        try {
            const res = await debtApi.getAll({ page, size: pageSize })
            setDebts(res.data.content)
            setTotal(res.data.totalElements)
        } catch {
            toast.error('Error al cargar deudas')
        } finally {
            setLoading(false)
        }
    }, [page, pageSize])

    useEffect(() => { fetchDebts() }, [fetchDebts])

    const updateStatus = async (id, status) => {
        await debtApi.updateStatus(id, status)
        toast.success('Estado actualizado')
        fetchDebts()
    }

    const deleteDebt = async (id) => {
        await debtApi.delete(id)
        toast.success('Deuda eliminada')
        fetchDebts()
    }

    return {
        debts, loading, total,
        page,     setPage,       // ← asegura que se exportan
        pageSize, setPageSize,   // ← asegura que se exportan
        updateStatus, deleteDebt,
        refetch: fetchDebts
    }
}

export default useDebts