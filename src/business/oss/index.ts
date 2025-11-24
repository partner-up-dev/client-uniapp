import type { MIMETypes } from "@/data/enum";

// store
import { useAccountAPIStore } from "@/store/api/account";
import { useAccountStore } from "@/store/account";
import store from "@/store";

// utils
import { getMIMETypeFromFilename } from "@/utils";
import un from "@uni-helper/uni-network";


const SUPABASE_SERVER_URL: string = import.meta.env.VITE_SUPABASE_SERVER_URL
const SUPABASE_ANYONYMOUS_KEY: string = import.meta.env.VITE_SUPABASE_ANYONYMOUS_KEY
const STORAGE_BASE_URL: string = `${SUPABASE_SERVER_URL}/storage/v1`
const STORAGE_BASE_URL_PUBLIC: string = `${SUPABASE_SERVER_URL}/storage/v1/object/public`
const STORAGE_BASE_URL_SIGN: string = `${SUPABASE_SERVER_URL}/storage/v1/object/sign`

/**
 * @abstract 上传文件到OSS
 * @description
 * 默认使用已登录的账号的JWT
 * 
 * @param content_type
 * 未提供则自动根据文件名推断
 * 
 * @returns 返回上传后的文件URL
 */
export function uploadObj(
  bucket: string, key: string, fp: string,
  content_type?: MIMETypes,
  upsert: boolean = false,
): Promise<string> {
  let finalContentType = content_type;
  let finalKey = key;

  if (!finalContentType) {
    const mimeFromFp = getMIMETypeFromFilename(fp);
    if (mimeFromFp) {
      finalContentType = mimeFromFp;
      finalKey = adjustKeyExtension(finalKey, fp);
    } else {
      finalContentType = getMIMETypeFromFilename(finalKey);
    }
  }

  const headers = {
    ...useAccountStore(store).authHeaders,
    'X-Upsert': upsert.toString(),
    'Content-Type': finalContentType || getMIMETypeFromFilename(finalKey)
  }

  return un.upload({
    url: `${STORAGE_BASE_URL}/object/${bucket}/${finalKey}`,
    name: finalKey,
    filePath: fp,
    headers,
  })
}

/**
 * @abstract 选择图片并上传
 * @description
 * 封装选择图片和上传流程的 composable
 * 
 * @returns chooseImageAndUpload 方法，返回上传后的文件 URL
 */
export function useChooseImage() {
  /**
   * 选择图片并上传到 OSS
   * @returns Promise<string> 上传后的文件 URL
   */
  function chooseImageAndUpload(bucket: string, key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0];
          uploadObj(bucket, key, tempFilePath)
            .then(resolve)
            .catch(reject);
        },
        fail: (error) => {
          reject(error);
        }
      });
    });
  }

  return {
    chooseImageAndUpload
  };
}

/**
 * Get file extension from path
 */
function getExtensionFromPath(path: string): string | null {
  const lastDot = path.lastIndexOf('.');
  return lastDot !== -1 ? path.substring(lastDot + 1) : null;
}

/**
 * Adjust key's extension to match fp's extension
 */
function adjustKeyExtension(key: string, fp: string): string {
  const extFp = getExtensionFromPath(fp);
  if (extFp) {
    const lastDot = key.lastIndexOf('.');
    if (lastDot !== -1) {
      key = key.substring(0, lastDot);
    }
    key += '.' + extFp;
  }
  return key;
}



