"use client"

import React, { useEffect, useState } from 'react'
import { serverGetAdsPosterData, serverGetBanners, serverGetCategory, serverGetPramotionProduct } from '../services/serverApi';
import { useAuth } from '@/components/auth-provider';

const useHome = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [bannerData, setBannerData] = useState([]);
  const [categoryData, setCategoryData] = useState([])
  const [adsPosterData, setAdsPosterData] = useState<any[]>([]);
  const [pramotionProductData, setPramotionProductData] = useState<any[]>([]);

  const getBannerData = async () => {
    try {
      setLoading(true)
      const res = await serverGetBanners();
      setBannerData(res?.data)
      setLoading(false)
    } catch (error) {
      console.error(error);
      setBannerData([])
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

  const getPramotionProductData = async (noLoading?: boolean) => {
    try {
      setLoading(noLoading ? false : true)
      const res = await serverGetPramotionProduct(user?._id?.toString());
      setPramotionProductData(res?.data)
      setLoading(false)
    } catch (e) {
      console.log(e)
      setPramotionProductData([])
      setLoading(false)
    }
  }

  const getAdsPosterData = async () => {
    try {
      setLoading(true)
      const res = await serverGetAdsPosterData();
      setAdsPosterData(res?.data)
      setLoading(false)
    } catch (error) {
      console.error(error);
      setAdsPosterData([])
      setLoading(false)
    }
  }

  useEffect(() => {
    getBannerData();
    getCategoryData();
    getAdsPosterData();
    getPramotionProductData();
  }, [user]);

  return {
    loading,
    bannerData,
    categoryData,
    adsPosterData,
    pramotionProductData,
    getPramotionProductData
  }
}

export default useHome