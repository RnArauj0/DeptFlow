import { useState, useEffect } from 'react'
import { dashboardApi } from '../api/dashboardApi'

const useDashboard = () => {
    const [data, setData]       = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError]     = useState(null)

    const fetchSummary = async () => {
        setLoading(true)
        try {
            const res = await dashboardApi.getSummary()
            setData(res.data)
        } catch (err) {
            setError(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchSummary() }, [])

    return { data, loading, error, refetch: fetchSummary }
}

export default useDashboard