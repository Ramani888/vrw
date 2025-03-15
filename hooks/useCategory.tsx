"use Client";
import React, { useEffect, useState } from 'react'
import { serverGetAllProduct, serverGetCategory } from '../services/serverApi'

const useCategory = () => {
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

    const getProductData = async () => {
        try {
          setLoading(true)
          const res = await serverGetAllProduct();
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
    }, [])

    return {
        categoryData,
        loading,
        productData
    }
}

export default useCategory