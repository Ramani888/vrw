"use Client";
import React, { useEffect, useState } from 'react'
import { serverGetAllProduct, serverGetCategory } from '../services/serverApi'
import { useAuth } from '@/components/auth-provider';

const useCategory = () => {
    const { user } = useAuth();
    const [categoryData, setCategoryData] = useState([])
    const [loading, setLoading] = useState(false)
    const [productData, setProductData] = useState<any[]>([]);

    const getCategoryData = async () => {
        try {
            setLoading(true)
            const res = await serverGetCategory();
            setCategoryData(res?.data)
            setLoading(false)
        } catch (e) {
            console.log(e)
            setCategoryData([])
            setLoading(false)
        }
    }

    const getProductData = async (noLoading?: boolean) => {
        try {
          setLoading(noLoading ? false : true)
          const res = await serverGetAllProduct(user?._id?.toString());
          setProductData(res?.data)
          setLoading(false)
        } catch (error) {
          console.error(error);
          setProductData([])
          setLoading(false)
        }
    }

    useEffect(() => {
        getCategoryData();
        getProductData();
    }, [user])

    return {
        categoryData,
        loading,
        productData,
        getProductData
    }
}

export default useCategory