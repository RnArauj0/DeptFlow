import { useState, useEffect, useCallback } from 'react'
import { clientApi } from '../api/clientApi'
import toast from 'react-hot-toast'

const useClients = () => {
    const [clients, setClients]   = useState([])
    const [loading, setLoading]   = useState(true)
    const [total, setTotal]       = useState(0)
    const [page, setPage]         = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [search, setSearch]     = useState('')

    const fetchClients = useCallback(async () => {
        setLoading(true)
        try {
            const res = await clientApi.getAll({
                page,
                size: pageSize,
                sort: 'name',
                ...(search ? { search } : {})
            })
            setClients(res.data.content)
            setTotal(res.data.totalElements)
        } catch {
            toast.error('Error al cargar clientes')
        } finally {
            setLoading(false)
        }
    }, [page, pageSize, search])

    useEffect(() => { fetchClients() }, [fetchClients])

    const createClient = async (data) => {
        await clientApi.create(data)
        toast.success('Cliente creado correctamente')
        fetchClients()
    }

    const updateClient = async (id, data) => {
        await clientApi.update(id, data)
        toast.success('Cliente actualizado correctamente')
        fetchClients()
    }

    const deactivateClient = async (id) => {
        await clientApi.deactivate(id)
        toast.success('Cliente desactivado')
        fetchClients()
    }

    return {
        clients, loading, total,
        page, setPage,
        pageSize, setPageSize,
        search, setSearch,
        createClient, updateClient, deactivateClient,
        refetch: fetchClients
    }
}

export default useClients