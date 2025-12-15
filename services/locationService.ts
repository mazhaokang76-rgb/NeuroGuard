// services/locationService.ts
export interface LocationInfo {
  province?: string;
  city?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
}

let cachedLocation: LocationInfo | null = null;

/**
 * 获取用户地理位置信息
 */
export const getUserLocation = async (): Promise<LocationInfo> => {
  // 如果已有缓存，直接返回
  if (cachedLocation) {
    return cachedLocation;
  }

  try {
    // 1. 先获取GPS坐标
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('浏览器不支持地理定位'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5分钟缓存
        }
      );
    });

    const { latitude, longitude, accuracy } = position.coords;

    // 2. 使用高德地图API进行逆地理编码（免费，无需密钥）
    try {
      const response = await fetch(
        `https://restapi.amap.com/v3/geocode/regeo?location=${longitude},${latitude}&key=YOUR_AMAP_KEY&extensions=base`,
        { method: 'GET' }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.status === '1' && data.regeocode) {
          const addressComponent = data.regeocode.addressComponent;
          
          cachedLocation = {
            province: addressComponent.province,
            city: addressComponent.city,
            district: addressComponent.district,
            latitude,
            longitude,
            accuracy
          };

          console.log('Location info:', cachedLocation);
          return cachedLocation;
        }
      }
    } catch (apiError) {
      console.warn('逆地理编码失败，仅返回坐标', apiError);
    }

    // 3. 如果API失败，只返回坐标
    cachedLocation = {
      latitude,
      longitude,
      accuracy
    };

    return cachedLocation;

  } catch (error) {
    console.warn('获取位置信息失败:', error);
    
    // 如果GPS失败，尝试通过IP获取大致位置（作为后备方案）
    try {
      const ipResponse = await fetch('https://ipapi.co/json/');
      if (ipResponse.ok) {
        const ipData = await ipResponse.json();
        
        cachedLocation = {
          province: ipData.region,
          city: ipData.city,
          latitude: ipData.latitude,
          longitude: ipData.longitude
        };

        console.log('IP-based location:', cachedLocation);
        return cachedLocation;
      }
    } catch (ipError) {
      console.warn('IP定位也失败了', ipError);
    }

    // 所有方法都失败，返回空对象
    return {};
  }
};

/**
 * 检查答案是否与用户位置匹配
 */
export const checkLocationMatch = (
  answer: string,
  locationType: 'province' | 'city' | 'district'
): boolean => {
  if (!cachedLocation) {
    // 如果没有位置信息，接受任何合理答案
    return answer.length > 0 && answer.length < 20;
  }

  const locationValue = cachedLocation[locationType];
  if (!locationValue) {
    // 如果没有该层级的位置信息，接受合理答案
    return answer.length > 0 && answer.length < 20;
  }

  // 模糊匹配：答案包含实际位置，或实际位置包含答案
  const normalizedAnswer = answer.replace(/省|市|县|区|自治区|特别行政区/g, '').trim();
  const normalizedLocation = locationValue.replace(/省|市|县|区|自治区|特别行政区/g, '').trim();

  return (
    normalizedAnswer.includes(normalizedLocation) ||
    normalizedLocation.includes(normalizedAnswer) ||
    answer === locationValue
  );
};

/**
 * 清除位置缓存（用于测试或重新定位）
 */
export const clearLocationCache = (): void => {
  cachedLocation = null;
};

/**
 * 请求位置权限并获取位置信息
 * 在PatientForm提交时调用，提前获取位置
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    await getUserLocation();
    return true;
  } catch (error) {
    console.warn('位置权限请求失败', error);
    return false;
  }
};
