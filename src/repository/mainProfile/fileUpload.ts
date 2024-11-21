import { customAxios } from "../../lib/axios/customAxios";
import { fileUpload } from "../../types/fileUpload/fileUpload.type";

class FileUpload {
  public async postFileUpload(formData: FormData | ""): Promise<fileUpload> {
    const { data } = await customAxios.post("/upload", formData || null);
    return data;
  }
}
export default new FileUpload();
