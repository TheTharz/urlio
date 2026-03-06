import { ShortUrlRequestDTO } from "@/dtos/ShortUrlRequest.dto"
import { ShortUrlResponseDTO } from "@/dtos/ShortUrlResponse.dto"
import axiosInstance from "@/lib/api"

export const shortenUrl = async (urlData: ShortUrlRequestDTO): Promise<ShortUrlResponseDTO> => {
  const res = await axiosInstance.post<ShortUrlResponseDTO>("/shorten/create", urlData)
  return res.data;
}

export const getAllUrls = async (): Promise<any[]> => {
  const res = await axiosInstance.get<{ success: boolean, data: any[] }>("/shorten/all");
  return res.data.data;
}