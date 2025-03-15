"use client";
import React, { useEffect, useState } from 'react'
import { serverGetAllProduct, serverGetCategory, serverGetProductById } from '../services/serverApi';

const useShop = (productId?: string) => {
  console.log('productId', productId)
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState([]);
  const [productDetail, setProductDetail] = useState<any>({});

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

  const getProductById = async () => {
    try {
      setLoading(true)
      const res = await serverGetProductById(productId ?? '');
      setProductDetail(res?.data[0])
      setLoading(false)
    }
    catch (error) { 
      console.error(error);
      setProductDetail({})
      setLoading(false)
    }
  }

  useEffect(() => {
    getProductData();
    getCategoryData();
  }, [])

  useEffect(() => {
    if (productId){
      getProductById();
    }
  }, [productId])

  return {
    loading,
    productData,
    categoryData,
    productDetail
  }
}

export default useShop