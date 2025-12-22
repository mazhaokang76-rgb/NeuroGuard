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
 * 获取用户地理位置信息 - 优化版
 */
export const getUserLocation = async (): Promise<LocationInfo> => {
  // 如果已有缓存，直接返回
  if (cachedLocation) {
    console.log('📍 使用缓存的位置信息:', cachedLocation);
    return cachedLocation;
  }

  console.log('📍 开始获取位置信息...');

  try {
    // 1. 先尝试通过IP获取位置（更可靠，作为主要方法）
    try {
      console.log('📍 尝试IP定位...');
      const ipResponse = await fetch('https://ipapi.co/json/', {
        signal: AbortSignal.timeout(3000) // 3秒超时
      });
      
      if (ipResponse.ok) {
        const ipData = await ipResponse.json();
        
        cachedLocation = {
          province: ipData.region || ipData.region_code,
          city: ipData.city,
          latitude: ipData.latitude,
          longitude: ipData.longitude
        };

        console.log('✅ IP定位成功:', cachedLocation);
        
        // 在后台尝试GPS精确定位（不阻塞）
        tryGPSInBackground();
        
        return cachedLocation;
      }
    } catch (ipError) {
      console.warn('⚠️ IP定位失败，尝试GPS定位', ipError);
    }

    // 2. IP失败后，尝试GPS定位（使用优化的配置）
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('浏览器不支持地理定位'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: false, // 使用低精度模式，速度更快
          timeout: 5000, // 5秒超时
          maximumAge: 600000 // 使用10分钟内的缓存
        }
      );
    });

    const { latitude, longitude, accuracy } = position.coords;
    console.log('✅ GPS定位成功:', { latitude, longitude, accuracy });

    // 3. 尝试逆地理编码（可选，失败也无所谓）
    try {
      const response = await fetch(
        `https://restapi.amap.com/v3/geocode/regeo?location=${longitude},${latitude}&key=YOUR_AMAP_KEY&extensions=base`,
        { 
          method: 'GET',
          signal: AbortSignal.timeout(3000)
        }
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

          console.log('✅ 逆地理编码成功:', cachedLocation);
          return cachedLocation;
        }
      }
    } catch (apiError) {
      console.warn('⚠️ 逆地理编码失败，仅使用坐标', apiError);
    }

    // 4. 如果逆地理编码失败，只返回坐标
    cachedLocation = {
      latitude,
      longitude,
      accuracy
    };

    return cachedLocation;

  } catch (error) {
    console.warn('⚠️ 所有定位方法均失败，返回空对象', error);
    
    // 所有方法都失败，返回空对象（不影响评估继续进行）
    cachedLocation = {};
    return cachedLocation;
  }
};

/**
 * 在后台尝试GPS定位以获取更精确的位置（不阻塞主流程）
 */
const tryGPSInBackground = () => {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      
      // 如果GPS精度更高，更新缓存
      if (!cachedLocation?.latitude || !cachedLocation.accuracy || accuracy < cachedLocation.accuracy) {
        cachedLocation = {
          ...cachedLocation,
          latitude,
          longitude,
          accuracy
        };
        console.log('✅ 后台GPS定位完成，已更新位置:', cachedLocation);
      }
    },
    (error) => {
      console.log('后台GPS定位失败（不影响主流程）:', error.message);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
};

/**
 * 检查答案是否与用户位置匹配
 * 注意：现在评分标准更宽松，只要是合理的地点就得分
 */
export const checkLocationMatch = (
  answer: string,
  locationType: 'province' | 'city' | 'district'
): boolean => {
  // 基本合理性检查：非空且长度合理
  if (!answer || answer.length === 0 || answer.length > 50) {
    return false;
  }

  // 如果没有位置信息，接受任何合理答案
  if (!cachedLocation || !cachedLocation[locationType]) {
    return true;
  }

  const locationValue = cachedLocation[locationType];
  
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
  console.log('🗑️ 位置缓存已清除');
};

/**
 * 请求位置权限并获取位置信息（优化版）
 * 在PatientForm提交时调用，提前获取位置
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    console.log('📍 请求位置权限...');
    await getUserLocation();
    return true;
  } catch (error) {
    console.warn('⚠️ 位置权限请求失败（不影响评估）', error);
    return false;
  }
};
