"use client";
import React, { useEffect, useState } from 'react'
import { serverGetAllProduct, serverGetCategory } from '../services/serverApi';

const useShop = () => {
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState([]);

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
  }, [])


  return {
    loading,
    productData,
    categoryData
  }
}

export default useShop