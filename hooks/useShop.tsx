"use client";
import React, { useEffect, useState } from 'react'
import { serverGetAllProduct, serverGetCategory } from '../services/serverApi';
import { useAuth } from '@/components/auth-provider';

const useShop = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState([]);

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

  useEffect(() => {
    getProductData();
    getCategoryData();
  }, [user])


  return {
    loading,
    productData,
    categoryData,
    getProductData
  }
}

export default useShop